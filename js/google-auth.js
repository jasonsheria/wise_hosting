// Google Auth notification, serveur, et WebSocket
let ws = null;
let wsConnected = false;
let wsUserId = null;
let googleLoginNotificationShown = false;

function connectWebSocket(token, userId) {
  if (typeof io === 'undefined') {
    console.error('[GoogleAuth] Socket.IO client (io) is not loaded!');
    return;
  }
  console.log('[GoogleAuth] connectWebSocket called. Token present:', !!token, 'UserId:', userId);
  if(ws) {
    console.log('[GoogleAuth] Closing existing WebSocket connection.');
    ws.close();
  }
  // Use Socket.IO client, not native WebSocket
  ws = io('http://localhost:5000', {
    auth: { token },
    transports: ['websocket']
  });
  wsUserId = userId;
  wsConnected = false;
  // L'ID du socket n'est disponible qu'après connexion
  console.log('[GoogleAuth] Socket.IO: Attempting to connect...');

  ws.on('connect', function() {
    wsConnected = true;
    console.log('[GoogleAuth] Socket.IO: Connection opened. Socket ID:', ws.id);
    // Authentification initiale via token is already handled by backend middleware
    // If you need to send a custom event, do it here
     ws.emit('identify', { userId });
  });

  ws.on('disconnect', function(reason) {
    wsConnected = false;
    console.log('[GoogleAuth] Socket.IO: Disconnected. Reason:', reason);
  });

  ws.on('connect_error', function(error) {
    wsConnected = false;
    console.error('[GoogleAuth] Socket.IO: Connection error.', error);
    // Gestion du token expiré ou invalide
    const errMsg = (error && (error.message || error.data || error.toString())).toLowerCase();
    if (errMsg.includes('jwt expired') || errMsg.includes('invalid token') || errMsg.includes('401') || errMsg.includes('403')) {
      console.warn('[GoogleAuth] Token expiré ou invalide détecté lors de la reconnexion WebSocket. Suppression du localStorage et relance de l’auth Google.');
      localStorage.removeItem('googleUser');
      if (ws) ws.close();
      showAuthNotification('Session expirée. Veuillez vous reconnecter avec Google.', 'error');
      setTimeout(() => {
        waitForPreloaderAndGoogleScript();
      }, 800);
    }
  });

  // Example: handle custom events from backend
  ws.on('logout', function(msg) {
    if(msg.userId === wsUserId) {
      localStorage.removeItem('googleUser');
      showAuthNotification('Vous avez été déconnecté(e) du serveur.', 'error');
      setTimeout(() => location.reload(), 1200);
    }
  });

  // ...add other event handlers as needed...
}

function isGoogleScriptLoaded() {
  return !!(window.google && window.google.accounts && window.google.accounts.id);
}

function showGoogleLoginNotification() {
  console.log('[GoogleAuth] showGoogleLoginNotification called.');
  if (googleLoginNotificationShown) {
    console.log('[GoogleAuth] Google login notification already shown or in process.');
    return;
  }
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
      console.log('[GoogleAuth] Appended Google login notification (no anime.js).');
    }
    notif.querySelector('#notif-close').onclick = () => {
      console.log('[GoogleAuth] Google login notification closed by user.');
      notif.remove();
    };
    setTimeout(() => {
      if (document.body.contains(notif)) {
        console.log('[GoogleAuth] Google login notification timed out and removed.');
        notif.remove();
      }
    }, 12000);
  }, 0);
  // Forcer le rendu du bouton Google
  function tryRenderGoogleButton(attempt = 0) {
    console.log('[GoogleAuth] tryRenderGoogleButton attempt:', attempt);
    if (isGoogleScriptLoaded()) {
      console.log('[GoogleAuth] Google script is loaded. Initializing and rendering button.');
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
          }
          console.log('[GoogleAuth] Google sign-in button rendered successfully in notification.');
        } else if (attempt < 20) {
          console.log('[GoogleAuth] Google button not rendered yet, retrying...');
          setTimeout(() => tryRenderGoogleButton(attempt + 1), 500);
        } else {
          console.warn('[GoogleAuth] Impossible de rendre le bouton Google après plusieurs tentatives.');
        }
      }, 200);
    } else if (attempt < 20) {
      console.log('[GoogleAuth] Google script not loaded yet, retrying renderButton...');
      setTimeout(() => tryRenderGoogleButton(attempt + 1), 500);
    } else {
      console.warn('[GoogleAuth] Script Google non chargé après plusieurs tentatives. Cannot render button.');
    }
  }
  tryRenderGoogleButton();
}

function waitForPreloaderAndGoogleScript() {
  console.log('[GoogleAuth] waitForPreloaderAndGoogleScript called.');
  let preloaderDone = false;
  let maxWait = 15000; // 15s timeout
  let start = Date.now();

  function checkReady() {
    if (preloaderDone && isGoogleScriptLoaded()) {
      console.log('[GoogleAuth] Preloader done and Google script loaded. Showing login notification.');
      showGoogleLoginNotification();
    } else if (Date.now() - start < maxWait && !googleLoginNotificationShown) {
      // console.log('[GoogleAuth] checkReady: Waiting for conditions to be met.');
      setTimeout(checkReady, 200);
    } else if (!googleLoginNotificationShown) {
      console.warn('[GoogleAuth] Timeout waiting for preloader or Google script.');
      // Affiche quand même la notif si Google script trop lent
      if (preloaderDone) {
        console.log('[GoogleAuth] Preloader done, but Google script might be slow. Showing notification anyway.');
        showGoogleLoginNotification();
      }
      else console.warn('[GoogleAuth] Preloader non terminé après 15s.');
    }
  }

  // Attendre la fin du preloader
  if (document.getElementById('ftco-loader')) {
    console.log('[GoogleAuth] Waiting for preloader:done event.');
    window.addEventListener('preloader:done', function handler() {
      preloaderDone = true;
      console.log('[GoogleAuth] preloader:done event received.');
      window.removeEventListener('preloader:done', handler);
    });
  } else {
    preloaderDone = true;
    console.log('[GoogleAuth] No preloader found, considering preloader as done.');
  }

  // Attendre que le script Google soit chargé
  function pollGoogleScript() {
    if (isGoogleScriptLoaded()) {
      console.log('[GoogleAuth] Google script is now loaded (polled).');
      // nothing
    } else if (Date.now() - start < maxWait) {
      // console.log('[GoogleAuth] Polling for Google script...');
      setTimeout(pollGoogleScript, 200);
    } else {
      console.warn('[GoogleAuth] Google script polling timed out.');
    }
  }
  pollGoogleScript();
  checkReady();
}

function showAuthNotification(message, type = 'success') {
  console.log(`[GoogleAuth] showAuthNotification: Type: ${type}, Message: ${message}`);
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
  notif.querySelector('button').onclick = () => {
    console.log('[GoogleAuth] Auth toast notification closed by user.');
    notif.remove();
  };
  document.body.appendChild(notif);
  setTimeout(() => {
    if (document.body.contains(notif)) {
      console.log('[GoogleAuth] Auth toast notification timed out and removed.');
      notif.remove();
    }
  }, 5000);
}

window.addEventListener('DOMContentLoaded', function() {
  console.log('[GoogleAuth] DOMContentLoaded event.');
  // Si déjà connecté, tente reconnexion WebSocket
  const userRaw = localStorage.getItem('googleUser');
  if(userRaw) {
    console.log('[GoogleAuth] User data found in localStorage:', userRaw);
    try {
      const u = JSON.parse(userRaw);
      // Ensure the structure matches what onGoogleSignIn saves: { token, user: { _id, name, email, ... } }
      if(u.token && u.user && u.user._id) {
        // console.log('[GoogleAuth] Attempting WebSocket reconnect for user:', u.user._id);
        connectWebSocket(u.token, u.user._id);
      } else if (u.token && u._id) { // Fallback for older structure
        // console.log('[GoogleAuth] Attempting WebSocket reconnect for user (fallback structure):', u._id);
        connectWebSocket(u.token, u._id);
      }
      else {
        console.log('[GoogleAuth] User data in localStorage is incomplete for WebSocket connection.');
      }
    } catch (e) {
      console.error('[GoogleAuth] Error parsing user data from localStorage on DOMContentLoaded:', e);
      localStorage.removeItem('googleUser'); // Clear corrupted data
      waitForPreloaderAndGoogleScript(); // Show login prompt
    }
    return; // Don't show login notification if user data exists (even if connection fails, it will retry)
  }
  if(localStorage.getItem('googleUser')) {
    // console.log('[GoogleAuth] User already logged in (second check), skipping login notification.');
    return;
  }
  // console.log('[GoogleAuth] No user data in localStorage, waiting for preloader/Google script to show login notification.');
  waitForPreloaderAndGoogleScript();
});

window.onGoogleSignIn = async function(response) {
  // console.log('[GoogleAuth] onGoogleSignIn callback triggered. Credential received:', !!response.credential);
  try {
    // Envoie le token Google au backend pour authentification
    // console.log('[GoogleAuth] Sending Google credential to backend for verification.');
    const res = await fetch('http://localhost:5000/auth/api/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    if(!res.ok) {
      const errorText = await res.text();
      // console.error('[GoogleAuth] Google sign-in backend error. Status:', res.status, 'Response:', errorText);
      throw new Error('Erreur serveur: ' + res.status + ' - ' + errorText);
    }
    const data = await res.json();
    // console.log('[GoogleAuth] Google sign-in successful. Backend response:', data);
    localStorage.setItem('googleUser', JSON.stringify(data)); // data should be { token, user: { _id, name, email, ... } }
    if(data.token && data.user && data.user._id) {
      if (typeof io !== 'undefined') {
        // console.log('[GoogleAuth] Connecting WebSocket post-login for user:', data.user._id);
        connectWebSocket(data.token, data.user._id);
      } else {
        console.error('[GoogleAuth] Socket.IO client (io) is not loaded!');
      }
    } else {
      console.error('[GoogleAuth] Backend response missing token or user._id after Google sign-in.', data);
    }
    showAuthNotification('Bienvenue, ' + (data.user.name || data.user.email) + ' !', 'success');
    const notif = document.getElementById('google-login-notif');
    if(notif) {
      // console.log('[GoogleAuth] Removing Google login notification.');
      notif.remove();
    }
    setTimeout(() => {
      console.log('[GoogleAuth] Reloading page after successful login.');
      location.reload();
    }, 1200);
  } catch(e) {
    console.error('[GoogleAuth] Error during Google sign-in process:', e);
    showAuthNotification('Erreur de connexion Google: ' + (e.message || e), 'error');
  }
};

window.getGoogleUser = function() {
  try {
    const userRaw = localStorage.getItem('googleUser');
    if (!userRaw) return null;
    const user = JSON.parse(userRaw);
    return user ? { token: user.token, user: user.user, _id: user.user?._id, ws, wsConnected } : null;
  } catch (e) {
    console.error('[GoogleAuth] Error parsing user from localStorage in getGoogleUser:', e);
    return null;
  }
};

window.googleLogout = function() {
  // console.log('[GoogleAuth] googleLogout called.');
  // Déconnexion côté serveur (optionnel)
  const user = window.getGoogleUser();
  if(user && user.token) {
    // console.log('[GoogleAuth] Sending logout request to backend.');
    fetch('http://localhost:5000/auth/api/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + user.token }
    }).then(res => {
      console.log('[GoogleAuth] Backend logout response status:', res.status);
    }).catch(err => {
      console.error('[GoogleAuth] Error during backend logout request:', err);
    });
  }
  localStorage.removeItem('googleUser');
  console.log('[GoogleAuth] Removed googleUser from localStorage.');
  if(ws) {
    // console.log('[GoogleAuth] Closing WebSocket connection on logout.');
    ws.close();
  }
  showAuthNotification('Déconnexion réussie.', 'success');
  setTimeout(() => {
    console.log('[GoogleAuth] Reloading page after logout.');
    location.reload();
  }, 1200);
};
