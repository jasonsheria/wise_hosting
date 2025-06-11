// Google Auth notification, serveur, et WebSocket
let ws = null;
let wsConnected = false;
let wsUserId = null;

function connectWebSocket(token, userId) {
  if(ws) ws.close();
  ws = new WebSocket('https://wise-technology.onrender.com/'); // Remplace par ton vrai backend
  wsUserId = userId;
  wsConnected = false;
  ws.onopen = function() {
    wsConnected = true;
    // Authentification initiale via token
    ws.send(JSON.stringify({ type: 'auth', token }));
  };
  ws.onmessage = function(e) {
    try {
      const msg = JSON.parse(e.data);
      if(msg.type === 'logout' && msg.userId === wsUserId) {
        // Déconnexion serveur
        localStorage.removeItem('googleUser');
        alert('Vous avez été déconnecté(e) du serveur.');
        location.reload();
      }
      // Ajoute ici d'autres types de messages si besoin
    } catch {}
  };
  ws.onclose = function() {
    wsConnected = false;
    // Tentative de reconnexion après 2s si user toujours connecté
    if(localStorage.getItem('googleUser')) {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('googleUser'));
        if(user && user.token && user._id) connectWebSocket(user.token, user._id);
      }, 2000);
    }
  };
}

window.addEventListener('DOMContentLoaded', function() {
  // Si déjà connecté, tente reconnexion WebSocket
  const user = localStorage.getItem('googleUser');
  if(user) {
    const u = JSON.parse(user);
    if(u.token && u._id) connectWebSocket(u.token, u._id);
    return;
  }
  if(localStorage.getItem('googleUser')) return;

  // Attendre la fin du preloader avant d'afficher la notification Google
  function showGoogleNotifAfterPreloader() {
    function showGoogleNotif() {
      const notif = document.createElement('div');
      notif.id = 'google-login-notif';
      notif.style = `
        position:fixed;top:24px;left:50%;transform:translateX(-50%);
        background:#fff;border-radius:12px;box-shadow:0 4px 24px #0002;
        padding:18px 32px;z-index:99999;display:flex;align-items:center;gap:18px;
        font-size:1.1rem;animation:fadeIn 0.5s;
      `;
      notif.innerHTML = `
        <span>Connectez-vous avec Google pour profiter de toutes les fonctionnalités !</span>
        <div id="g_id_onload"
          data-client_id="900358554333-g3k99qk3da90po7cc3ajm5cv8oq2dkda.apps.googleusercontent.com"
          data-callback="onGoogleSignIn"
          data-auto_prompt="false">
        </div>
        <div class="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left">
        </div>
        <button id="notif-close" style="margin-left:12px;background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>
        <style>
          @keyframes fadeIn {from{opacity:0;transform:translateY(-30px);}to{opacity:1;transform:translateY(0);}}
        </style>
      `;
      document.body.appendChild(notif);
      notif.querySelector('#notif-close').onclick = () => notif.remove();
      setTimeout(() => notif.remove(), 12000);
      // Forcer le rendu du bouton Google si besoin
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.renderButton(
          notif.querySelector('.g_id_signin'),
          { theme: 'outline', size: 'large' }
        );
      }
    }
    // Attendre que le script Google soit prêt
    function waitForGoogleScript(tries = 0) {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        showGoogleNotif();
      } else if (tries < 20) {
        setTimeout(() => waitForGoogleScript(tries + 1), 200);
      }
    }
    waitForGoogleScript();
  }
  // Attendre la fin du preloader
  if (document.getElementById('ftco-loader')) {
    window.addEventListener('preloader:done', showGoogleNotifAfterPreloader);
  } else {
    // Si pas de preloader, afficher directement
    showGoogleNotifAfterPreloader();
  }
});
window.onGoogleSignIn = async function(response) {
  try {
    // Envoie le token Google au backend pour authentification
    const res = await fetch('https://wise-technology.onrender.com/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    if(!res.ok) throw new Error('Erreur serveur: ' + res.status);
    const data = await res.json();
    // data doit contenir { token, user: { ... } }
    localStorage.setItem('googleUser', JSON.stringify(data));
    // Connexion WebSocket
    if(data.token && data.user && data.user._id) connectWebSocket(data.token, data.user._id);
    alert('Bienvenue, ' + (data.user.name || data.user.email) + ' !');
    const notif = document.getElementById('google-login-notif');
    if(notif) notif.remove();
    location.reload();
  } catch(e) {
    alert('Erreur de connexion Google: ' + (e.message || e));
  }
};

window.getGoogleUser = function() {
  try {
    const user = JSON.parse(localStorage.getItem('googleUser'));
    return user ? { ...user, ws, wsConnected } : null;
  } catch {
    return null;
  }
};

window.googleLogout = function() {
  // Déconnexion côté serveur (optionnel)
  const user = window.getGoogleUser();
  if(user && user.token) {
    fetch('https://wise-technology.onrender.com/api/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + user.token }
    });
  }
  localStorage.removeItem('googleUser');
  if(ws) ws.close();
  location.reload();
};
