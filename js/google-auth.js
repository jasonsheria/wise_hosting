// Google Auth notification, serveur, et WebSocket
let ws = null;
let wsConnected = false;
let wsUserId = null;
let googleLoginNotificationShown = false;

function connectWebSocket(token, userId) {
  if(ws) ws.close();
  ws = new WebSocket('https://wise-server.onrender.com'); // Remplace par ton vrai backend
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
        showAuthNotification('Vous avez été déconnecté(e) du serveur.', 'error');
        setTimeout(() => location.reload(), 1200);
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

function isGoogleScriptLoaded() {
  return !!(window.google && window.google.accounts && window.google.accounts.id);
}

function showGoogleLoginNotification() {
  if (googleLoginNotificationShown) return;
  googleLoginNotificationShown = true;
  const notif = document.createElement('div');
  notif.id = 'google-login-notif';
  notif.style = `
    position:fixed;top:24px;left:50%;transform:translateX(-50%);
    background:linear-gradient(135deg,#e0f7fa 60%,#e3e6ff 100%);
    border-radius:20px;box-shadow:0 8px 32px #36d1c422;
    padding:22px 38px 28px 38px;z-index:99999;display:flex;align-items:center;gap:18px;
    font-size:1.13rem;font-weight:500;min-width:320px;max-width:96vw;
    animation:fadeInNotif 0.7s cubic-bezier(.4,2,.6,1);
    justify-content:center;pointer-events:auto;transition:box-shadow 0.2s, background 0.2s;overflow:visible;
  `;
  notif.innerHTML = `
    <span style="display:block;text-align:center;font-size:1.08em;flex:1;font-weight:600;letter-spacing:0.01em;">Connectez-vous avec Google pour profiter de toutes les fonctionnalités !</span>
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
    <button id="notif-close" style="margin-left:12px;background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:50%;width:36px;height:36px;font-size:1.5rem;cursor:pointer;line-height:1.1;box-shadow:0 2px 8px #36d1c422;transition:background 0.2s;position:absolute;top:12px;right:12px;display:flex;align-items:center;justify-content:center;">&times;</button>
    <style>
      @keyframes fadeInNotif {from{opacity:0;transform:translateY(-40px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
      @media (max-width: 600px) {
        #google-login-notif {
          left: 0 !important;
          right: 0 !important;
          top: 0 !important;
          transform: none !important;
          width: 98vw !important;
          min-width: 0 !important;
          max-width: 98vw !important;
          border-radius: 0 0 18px 18px !important;
          padding: 18px 4vw 22px 4vw !important;
          font-size: 1.01rem !important;
          box-shadow: 0 4px 24px #0002;
          z-index: 99999 !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg,#e0f7fa 60%,#e3e6ff 100%) !important;
          position: fixed !important;
          justify-content: center;
        }
        #google-login-notif .g_id_signin {
          width: 100% !important;
          min-width: 0 !important;
          display: flex;
          justify-content: center;
        }
        #notif-close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 2rem !important;
          width: 36px !important;
          height: 36px !important;
        }
      }
    </style>
  `;
  // Animation d'apparition avec anime.js si dispo
  setTimeout(() => {
    if (window.anime) {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(-50%) translateY(-40px) scale(0.95)';
      document.body.appendChild(notif);
      window.anime({
        targets: notif,
        opacity: [0, 1],
        translateY: [-40, 0],
        scale: [0.95, 1],
        duration: 900,
        easing: 'easeOutElastic(1, .7)'
      });
    } else {
      document.body.appendChild(notif);
    }
    notif.querySelector('#notif-close').onclick = () => notif.remove();
    setTimeout(() => notif.remove(), 12000);
  }, 0);
  // Forcer le rendu du bouton Google
  function tryRenderGoogleButton(attempt = 0) {
    if (isGoogleScriptLoaded()) {
      // Initialiser Google Identity Services une seule fois
      if (!window._googleIdInitialized) {
        window.google.accounts.id.initialize({
          client_id: "900358554333-g3k99qk3da90po7cc3ajm5cv8oq2dkda.apps.googleusercontent.com",
          callback: window.onGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: false
        });
        window._googleIdInitialized = true;
      }
      window.google.accounts.id.renderButton(
        notif.querySelector('.g_id_signin'),
        { theme: 'outline', size: 'large' }
      );
      setTimeout(() => {
        if (notif.querySelector('.g_id_signin').children.length > 0) {
          if (!document.body.contains(notif)) {
            document.body.appendChild(notif);
            notif.querySelector('#notif-close').onclick = () => notif.remove();
            setTimeout(() => notif.remove(), 12000);
            console.log('[GoogleAuth] Notification affichée.');
          }
        } else if (attempt < 20) {
          setTimeout(() => tryRenderGoogleButton(attempt + 1), 500);
        } else {
          console.warn('[GoogleAuth] Impossible de rendre le bouton Google après plusieurs tentatives.');
        }
      }, 200);
    } else if (attempt < 20) {
      setTimeout(() => tryRenderGoogleButton(attempt + 1), 500);
    } else {
      console.warn('[GoogleAuth] Script Google non chargé après plusieurs tentatives.');
    }
  }
  tryRenderGoogleButton();
}

function waitForPreloaderAndGoogleScript() {
  let preloaderDone = false;
  let maxWait = 15000; // 15s timeout
  let start = Date.now();

  function checkReady() {
    if (preloaderDone && isGoogleScriptLoaded()) {
      showGoogleLoginNotification();
    } else if (Date.now() - start < maxWait && !googleLoginNotificationShown) {
      setTimeout(checkReady, 200);
    } else if (!googleLoginNotificationShown) {
      // Affiche quand même la notif si Google script trop lent
      if (preloaderDone) showGoogleLoginNotification();
      else console.warn('[GoogleAuth] Preloader non terminé après 15s.');
    }
  }

  // Attendre la fin du preloader
  if (document.getElementById('ftco-loader')) {
    window.addEventListener('preloader:done', function handler() {
      preloaderDone = true;
      window.removeEventListener('preloader:done', handler);
    });
  } else {
    preloaderDone = true;
  }

  // Attendre que le script Google soit chargé
  function pollGoogleScript() {
    if (isGoogleScriptLoaded()) {
      // nothing
    } else if (Date.now() - start < maxWait) {
      setTimeout(pollGoogleScript, 200);
    }
  }
  pollGoogleScript();
  checkReady();
}

function showAuthNotification(message, type = 'success') {
  // type: 'success' | 'error'
  const notif = document.createElement('div');
  notif.className = 'auth-toast-notif';
  notif.style = `
    position:fixed;top:24px;left:50%;transform:translateX(-50%);
    min-width:280px;max-width:90vw;
    background:${type === 'success' ? '#e6f9ec' : '#ffeaea'};
    color:${type === 'success' ? '#1a7f37' : '#b91c1c'};
    border:1.5px solid ${type === 'success' ? '#34d399' : '#f87171'};
    border-radius:12px;box-shadow:0 4px 24px #0002;
    padding:16px 32px;z-index:99999;display:flex;align-items:center;gap:14px;
    font-size:1.08rem;animation:fadeIn 0.5s;pointer-events:auto;
    font-weight:500;
  `;
  notif.innerHTML = `
    <span style="font-size:1.3em;">${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
    <button style="margin-left:12px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:inherit;">&times;</button>
    <style>@keyframes fadeIn {from{opacity:0;transform:translateY(-30px);}to{opacity:1;transform:translateY(0);}}</style>
  `;
  notif.querySelector('button').onclick = () => notif.remove();
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 5000);
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
  waitForPreloaderAndGoogleScript();
});
window.onGoogleSignIn = async function(response) {
  try {
    // Envoie le token Google au backend pour authentification
    const res = await fetch('https://wise-server.onrender.com/auth/api/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    if(!res.ok) throw new Error('Erreur serveur: ' + res.status);
    const data = await res.json();
    localStorage.setItem('googleUser', JSON.stringify(data));
    if(data.token && data.user && data.user._id) connectWebSocket(data.token, data.user._id);
    showAuthNotification('Bienvenue, ' + (data.user.name || data.user.email) + ' !', 'success');
    const notif = document.getElementById('google-login-notif');
    if(notif) notif.remove();
    setTimeout(() => location.reload(), 1200);
  } catch(e) {
    showAuthNotification('Erreur de connexion Google: ' + (e.message || e), 'error');
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
    fetch('https://wise-server.onrender.com/auth/api/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + user.token }
    });
  }
  localStorage.removeItem('googleUser');
  if(ws) ws.close();
  showAuthNotification('Déconnexion réussie.', 'success');
  setTimeout(() => location.reload(), 1200);
};
