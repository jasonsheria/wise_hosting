// Chatbot logic for all pages
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', chatbotInit);
} else {
  chatbotInit();
}

function chatbotInit() {
  let animating = false;
  let welcomeShown = false;
  const widgetHtml = `<!-- Chatbot Component Start -->\
<div id="chatbot-widget" style="position:fixed;bottom:24px;right:24px;z-index:9999;max-width:100vw;">\
  <button id="chatbot-toggle" aria-label="Ouvrir le chatbot" style="background: linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%);\
    border: none;\
    border-radius: 50%;\
    width: 60px;\
    height: 60px;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    cursor: pointer;\
    box-shadow: 0 8px 32px rgba(54,209,196,0.18), 0 1.5px 8px rgba(91,134,229,0.10);">\
    <span style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;">\
      <span class=\"flaticon-chat\" style=\"font-size:2.1rem;color:#fff;\"></span>\
    </span>\
  </button>\
  <div id=\"chatbot-window\" class=\"cbt-closed\" style=\"display:none;flex-direction:column;width:370px;max-width:98vw;height:520px;max-height:90vh;background:linear-gradient(135deg,#e0f7fa 60%,#e3e6ff 100%);border-radius:25px !important;box-shadow:0 8px 32px rgba(54,209,196,0.22);overflow:hidden;transition:width 0.2s, height 0.2s;\">\
    <div style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;padding:18px 24px;font-weight:600;display:flex;align-items:center;justify-content:space-between;letter-spacing:0.5px;\">\
      <span style=\"display:flex;align-items:center;gap:8px;\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"4\" y=\"7\" width=\"24\" height=\"16\" rx=\"8\" fill=\"url(#chatbot-bubble-gradient)\"/><ellipse cx=\"12\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/><ellipse cx=\"16\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/><ellipse cx=\"20\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/></svg> WiseBot</span>\
      <button id=\"chatbot-close\" aria-label=\"Fermer\" style=\"background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;transition:color 0.2s;">&times;</button>\
    </div>\
    <div id=\"chatbot-tabs\" style=\"display:flex;flex-direction:row;justify-content:space-between;align-items:center;background:#e3e6ff;padding:0;\">\
      <button class=\"cbt-tab-btn active\" data-tab=\"quick\" style=\"flex:1;padding:12px 0;border:none;background:none;font-weight:600;color:#36d1c4;font-size:1rem;cursor:pointer;transition:background 0.2s;">Questions rapides</button>\
      <button class=\"cbt-tab-btn\" data-tab=\"chat\" style=\"flex:1;padding:12px 0;border:none;background:none;font-weight:600;color:#36d1c4;font-size:1rem;cursor:pointer;transition:background 0.2s;">Discussions</button>\
      <button class=\"cbt-tab-btn\" data-tab=\"profile\" style=\"flex:1;padding:12px 0;border:none;background:none;font-weight:600;color:#36d1c4;font-size:1rem;cursor:pointer;transition:background 0.2s;">Profil</button>\
    </div>\
    <div id=\"chatbot-tab-content\" style=\"flex:1;display:flex;flex-direction:column;\">\
      <div id=\"chatbot-quick\" class=\"cbt-tab-panel\" style=\"display:block;flex:1;padding:18px;\">\
        <div style=\"display:flex;flex-wrap:wrap;gap:10px;justify-content:center;\">\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Quels sont vos tarifs ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Comment contacter le support ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Proposez-vous un essai gratuit ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Quels sont vos horaires ?</button>\
        </div>\
      </div>\
      <div id=\"chatbot-chat\" class=\"cbt-tab-panel\" style=\"display:none;flex:1;flex-direction:column;\">\
        <div id=\"chatbot-messages\" style=\"flex: 1;
  padding: 0 7px 7px 7px;
  background: none;
  scroll-behavior: smooth;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 45vh;\"></div>\
        <form id=\"chatbot-form\" style=\"display:flex;padding:14px 12px 14px 12px;border-top:1px solid #e3e6ff;gap:10px;background:#e0f7fa;\">\
          <input id=\"chatbot-input\" type=\"text\" placeholder=\"Écrivez votre message...\" autocomplete=\"off\" style=\"flex:1;padding:10px 14px;border-radius:12px;border:1px solid #36d1c4;outline:none;font-size:1rem;transition:border 0.2s;box-shadow:0 1px 4px rgba(54,209,196,0.08);background:#fff;\" required />\
          <button type=\"submit\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 20px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(54,209,196,0.08);transition:background 0.2s;">Envoyer</button>\
        </form>\
      </div>\
      <div id=\"chatbot-profile\" class=\"cbt-tab-panel\" style=\"display:none;flex:1;padding:18px;justify-content:center;align-items:center;\">\
        <div style=\"display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;gap:18px;\">\
          <img src=\"https://ui-avatars.com/api/?name=User&background=36d1c4&color=fff&size=80\" alt=\"Avatar\" style=\"width:80px;height:80px;border-radius:50%;box-shadow:0 2px 8px #36d1c422;object-fit:cover;\" />\
          <div style=\"font-size:1.1rem;font-weight:600;color:#36d1c4;word-break:break-word;\">Utilisateur invité</div>\
          <div style=\"font-size:0.98rem;color:#555;text-align:center;word-break:break-word;\">Connectez-vous pour profiter de toutes les fonctionnalités du chatbot.</div>\
          <button style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 24px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(54,209,196,0.08);transition:background 0.2s;\">Se connecter</button>\
        </div>\
      </div>\
    </div>\
  </div>\
</div>\
<!-- Chatbot Component End -->\
<style>\
#chatbot-widget { max-width: 100vw; }\
#chatbot-window { box-sizing: border-box; }\
#chatbot-tab-content { box-sizing: border-box; }\
#chatbot-messages { box-sizing: border-box; }\
#chatbot-window::-webkit-scrollbar,\n#chatbot-tab-content::-webkit-scrollbar,\n#chatbot-messages::-webkit-scrollbar { display: none !important; width: 0 !important; background: transparent !important; }\
#chatbot-window, #chatbot-tab-content, #chatbot-messages { scrollbar-width: none !important; }\
@media (max-width: 600px) {\
  #chatbot-window {\
    width: 88vw !important;\
    height: 62vh !important;\
    min-width: 0 !important;\
    max-width: 100vw !important;\
    border-radius:25px !important;\
    left: 0 !important;\
    margin-left: 5px !important;\
    right: 0 !important;\
    top: 0 !important;\
    bottom: 0 !important;\
    margin-bottom: 68px !important;\
    box-shadow: none !important;\
  }\
  #chatbot-tab-content, #chatbot-messages { padding: 0 !important; }\
  #chatbot-profile, #chatbot-quick, #chatbot-chat { padding: 4px !important; }\
  #chatbot-widget {\
    right: 0 !important;\
    bottom: 0 !important;\
    left: 0 !important;\
    margin: 0 !important;\
    max-width: 100vw !important;\
  }\
  #chatbot-toggle {\
    right: 12px !important;\
    bottom: 12px !important;\
    width: 48px !important;\
    height: 48px !important;\
    position: fixed !important;\
  }\
  #chatbot-toggle span {\
    width: 28px !important;\
    height: 28px !important;\
  }\
  .cbt-tab-btn {\
    font-size: 0.93rem !important;\
    padding: 8px 0 !important;\
  }\
  .cbt-quick-btn {\
    font-size: 0.93rem !important;\
    padding: 7px 8px !important;\
    border-radius: 8px !important;\
    margin-bottom: 5px !important;\
  }\
  #chatbot-form {\
    padding: 6px 4px 6px 4px !important;\
    gap: 4px !important;\
  }\
  #chatbot-input {\
    font-size: 0.95rem !important;\
    padding: 7px 8px !important;\
    border-radius: 8px !important;\
  }\
  #chatbot-form button[type="submit"] {\
    padding: 7px 10px !important;\
    font-size: 0.95rem !important;\
    border-radius: 8px !important;\
  }\
  #chatbot-profile img {\
    width: 48px !important;\
    height: 48px !important;\
  }\
  .cbt-msg-bubble {\
    max-width: 98vw !important;\
    font-size: 0.97rem !important;\
    padding: 8px 10px 6px 10px !important;\
    border-radius: 12px !important;\
  }\
}\n.cbt-tab-btn.active { background:linear-gradient(135deg,#36d1c4,#5b86e5); color:#fff!important; border-radius:0 0 0 0; }\n.cbt-tab-btn { border-bottom:2px solid transparent; }\n.cbt-tab-btn:not(.active):hover { background:#e0f7fa; }\n</style>`;
  if (!document.getElementById('chatbot-widget')) {
    document.body.insertAdjacentHTML('beforeend', widgetHtml);
  }
  const toggleBtn = document.getElementById('chatbot-toggle');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');

  // Ajout dynamique d'animate.js si besoin
  if (!window.animate) {
    const animateScript = document.createElement('script');
    animateScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    animateScript.onload = () => { window.animate = true; };
    document.head.appendChild(animateScript);
  }

  function getWelcomeMessage() {
    const h = new Date().getHours();
    if (h < 6) return "Bonsoir ! Je suis WiseBot, prêt à vous aider même la nuit 🌙";
    if (h < 12) return "Bonjour ! Je suis WiseBot, comment puis-je vous aider ce matin ? ☀️";
    if (h < 18) return "Bonjour ! Je suis WiseBot, besoin d'aide cet après-midi ? 😊";
    return "Bonsoir ! Je suis WiseBot, que puis-je faire pour vous ce soir ? 🌆";
  }

  // Helper to format time as HH:mm
  function formatTime(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getTimeString() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getStatusIcon(status) {
    // status: 'sent', 'received', 'read'
    if (status === 'sent') {
      return '<span title="Envoyé" style="color:#36d1c4;font-size:1.1em;vertical-align:middle;margin-left:6px;">&#10003;</span>';
    } else if (status === 'received') {
      return '<span title="Reçu" style="color:#5b86e5;font-size:1.1em;vertical-align:middle;margin-left:6px;">&#10003;&#10003;</span>';
    } else if (status === 'read') {
      return '<span title="Lu" style="color:#36d1c4;font-size:1.1em;vertical-align:middle;margin-left:6px;">&#10003;&#10003;</span>';
    }
    return '';
  }

  // Append a message with timestamp and status
  function appendMessage(text, from, animated = true, status = null, time = null) {
    const msg = document.createElement('div');
    msg.style.margin = window.innerWidth <= 600 ? '4px 0' : '10px 0';
    msg.style.display = 'flex';
    msg.style.justifyContent = from === 'user' ? 'flex-end' : 'flex-start';
    const msgTime = time || getTimeString();
    let msgStatus = '';
    if (from === 'user') {
      msgStatus = getStatusIcon(status || 'sent');
    } else if (from === 'bot') {
      msgStatus = getStatusIcon(status || 'received');
    }
    const padding = window.innerWidth <= 600 ? '8px 10px 6px 10px' : '12px 20px 10px 20px';
    const borderRadius = window.innerWidth <= 600 ? '12px' : '20px';
    const maxWidth = window.innerWidth <= 600 ? '98vw' : '80%';
    const fontSize = window.innerWidth <= 600 ? '0.97rem' : '1rem';
    msg.innerHTML = `<span class="cbt-msg-bubble" style="background:${from==='user'?'linear-gradient(135deg,#007bff,#00c6ff)':'rgba(255,255,255,0.85)'};color:${from==='user'?'#fff':'#222'};padding:${padding};border-radius:${borderRadius};max-width:${maxWidth};display:inline-block;box-shadow:0 4px 18px rgba(0,0,0,0.10);font-size:${fontSize};line-height:1.5;backdrop-filter:${from==='user'?'':'blur(2px)'};border:1px solid #e3f0ff;position:relative;${animated?'animation:cbt-msg-in 0.5s cubic-bezier(.4,2,.6,1);':''}">
      <span>${text}</span>
      <div style="display:flex;align-items:center;gap:6px;margin-top:6px;font-size:0.92em;opacity:0.7;">
        <span style="font-size:0.92em;">${msgTime}</span>${msgStatus}
      </div>
    </span>`;
    if(animated) {
      msg.style.opacity = '0';
      msg.style.transform = 'scale(0.92)';
      setTimeout(() => {
        msg.style.transition = 'opacity 0.35s, transform 0.35s';
        msg.style.opacity = '1';
        msg.style.transform = 'scale(1)';
      }, 10);
    }
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // Ajout d'une animation typing pour le bot
  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'cbt-typing';
    typing.innerHTML = `<span style="background:rgba(255,255,255,0.85);color:#222;padding:12px 20px;border-radius:20px;max-width:80%;display:inline-block;box-shadow:0 4px 18px rgba(0,0,0,0.10);font-size:1rem;line-height:1.5;border:1px solid #e3f0ff;">
      <span class='cbt-typing-dot'></span><span class='cbt-typing-dot'></span><span class='cbt-typing-dot'></span>
    </span>`;
    typing.style.margin = '10px 0';
    typing.style.display = 'flex';
    typing.style.justifyContent = 'flex-start';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    return typing;
  }
  function removeTyping(typing) {
    if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
  }

  function botReply(userText) {
    const lower = userText.toLowerCase();
    let response = "Je suis WiseBot, comment puis-je vous aider ?";
    const random = arr => arr[Math.floor(Math.random() * arr.length)];
    let typing = showTyping();
    setTimeout(() => {
      removeTyping(typing);
      if (/bonjour|salut|hello/.test(lower)) response = random([
        "Bonjour ! Comment puis-je vous assister aujourd'hui ? 😊",
        "Salut ! Besoin d'aide ? Je suis là pour vous.",
        "Hello ! Que puis-je faire pour vous ? 👋"
      ]);
      else if (/prix|tarif/.test(lower)) response = random([
        "Nos plans commencent à 0€ pour l'offre gratuite. Plus de détails ?",
        "Nous proposons plusieurs tarifs adaptés à vos besoins. Voulez-vous une brochure ? 💡",
        "Les prix varient selon l'offre. Je peux vous guider si besoin !"
      ]);
      else if (/hébergement|hosting/.test(lower)) response = random([
        "Nous proposons un hébergement rapide, sécurisé et évolutif. Souhaitez-vous une démo ? 🚀",
        "Notre hébergement est optimisé pour la performance. Voulez-vous en savoir plus ?",
        "Hébergement web fiable et support 24/7, ça vous intéresse ?"
      ]);
      else if (/contact/.test(lower)) response = random([
        "Vous pouvez nous contacter via le formulaire de la page Contact ou ici même.",
        "Notre équipe est joignable à tout moment via la page Contact.",
        "Besoin d'un contact direct ? Je peux vous donner l'email du support."
      ]);
      else if (/merci|thanks/.test(lower)) response = random([
        "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊",
        "Je vous en prie ! Je reste à votre disposition.",
        "Merci à vous ! Je suis là si besoin."
      ]);
      else if (/aide|support/.test(lower)) response = random([
        "Je peux vous aider sur nos offres, la facturation ou l'assistance technique.",
        "Dites-m'en plus sur votre besoin, je vous guide !",
        "Support technique ou commercial, je transmets votre demande si besoin."
      ]);
      else if (/au revoir|bye|quit/.test(lower)) response = random([
        "Au revoir ! Passez une excellente journée ! 👋",
        "À bientôt sur notre site !",
        "Merci de votre visite, à la prochaine !"
      ]);
      appendMessage(response, 'bot', true, 'read');
    }, 900 + Math.random() * 600);
  }

  // --- USER AUTH LOGIC ---
  function getUserInfo() {
    try {
      const raw = localStorage.getItem('googleUser');
      console.log('[Chatbot] googleUser localStorage:', raw);
      const googleUser = JSON.parse(raw);
      // Correction : le vrai user est dans googleUser.user
      if (googleUser && googleUser.user && googleUser.user.username && googleUser.user.email) {
        return {
          name: googleUser.user.username,
          email: googleUser.user.email,
          picture: googleUser.user.profileUrl || '',
          // Ajoute d'autres champs si besoin
        };
      }
    } catch (e) { console.error('[Chatbot] Erreur parsing googleUser:', e); }
    return null;
  }

  function updateProfileTab() {
    const user = getUserInfo();
    const profilePanel = document.getElementById('chatbot-profile');
    if (!profilePanel) return;
    if (user) {
      profilePanel.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:18px;">
          <img src="${user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=36d1c4&color=fff&size=80'}" alt="Avatar" style="width:80px;height:80px;border-radius:50%;box-shadow:0 2px 8px #36d1c422;" />
          <div style="font-size:1.1rem;font-weight:600;color:#36d1c4;">${user.name}</div>
          <div style="font-size:0.98rem;color:#555;text-align:center;">${user.email}</div>
          <button id="cbt-logout-btn" style="background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 24px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(54,209,196,0.08);transition:background 0.2s;">Se déconnecter</button>
        </div>
      `;
      setTimeout(() => {
        const logoutBtn = document.getElementById('cbt-logout-btn');
        if (logoutBtn) {
          logoutBtn.onclick = function () {
            localStorage.removeItem('googleUser');
            updateProfileTab();
            // Mise à jour du message de bienvenue et du blocage chat après déconnexion
            welcomeShown = false;
            if (document.querySelector('.cbt-tab-btn.active')?.dataset.tab === 'profile') updateProfileTab();
          };
        }
      }, 50);
    } else {
      profilePanel.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:18px;">
          <img src="https://ui-avatars.com/api/?name=User&background=36d1c4&color=fff&size=80" alt="Avatar" style="width:80px;height:80px;border-radius:50%;box-shadow:0 2px 8px #36d1c422;" />
          <div style="font-size:1.1rem;font-weight:600;color:#36d1c4;">Utilisateur invité</div>
          <div style="font-size:0.98rem;color:#555;text-align:center;">Connectez-vous pour profiter de toutes les fonctionnalités du chatbot.</div>
          <button id="cbt-login-btn" style="background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 24px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(54,209,196,0.08);transition:background 0.2s;">Se connecter</button>
        </div>
      `;
      setTimeout(() => {
        const loginBtn = document.getElementById('cbt-login-btn');
        if (loginBtn) {
          loginBtn.onclick = function () {
            if (window.showGoogleLoginNotification) window.showGoogleLoginNotification();
          };
        }
      }, 50);
    }
  }

  // --- TABS LOGIC ---
  const tabBtns = [];
  const tabPanels = {
    quick: null,
    chat: null,
    profile: null
  };
  setTimeout(() => {
    document.querySelectorAll('.cbt-tab-btn').forEach(btn => {
      tabBtns.push(btn);
      btn.onclick = function () {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.keys(tabPanels).forEach(k => {
          if (document.getElementById('chatbot-' + k))
            document.getElementById('chatbot-' + k).style.display = (btn.dataset.tab === k) ? (k === 'chat' ? 'flex' : 'block') : 'none';
        });
        // Met à jour le profil à chaque fois qu'on ouvre l'onglet profil
        if (btn.dataset.tab === 'profile') updateProfileTab();
      };
    });
    tabPanels.quick = document.getElementById('chatbot-quick');
    tabPanels.chat = document.getElementById('chatbot-chat');
    tabPanels.profile = document.getElementById('chatbot-profile');
    tabBtns[0].click();
    // Quick question buttons
    tabPanels.quick.querySelectorAll('.cbt-quick-btn').forEach(btn => {
      btn.onclick = function () {
        // Vérifie la connexion avant d'autoriser le chat
        if (!getUserInfo()) {
          tabBtns[1].click();
          appendMessage("Veuillez vous connecter pour discuter avec WiseBot.", 'bot');
          if (window.showGoogleLoginNotification) window.showGoogleLoginNotification();
          return;
        }
        tabBtns[1].click();
        input.value = btn.textContent;
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      };
    });
    updateProfileTab();
  }, 100);

  function showBot() {
    if (animating) return;
    windowEl.classList.add('cbt-open');
    windowEl.classList.remove('cbt-closed', 'animate__fadeOutDown', 'animate__animated');
    windowEl.style.display = 'flex';
    windowEl.style.opacity = '0';
    windowEl.style.transform = 'translateY(80px) scale(0.7)';
    setTimeout(() => {
      if (window.anime) {
        anime({
          targets: windowEl,
          opacity: [0, 1],
          translateY: [80, 0],
          scale: [0.7, 1],
          duration: 900,
          easing: 'easeOutElastic(1, .7)',
          complete: () => { animating = false; }
        });
      } else {
        windowEl.style.opacity = '1';
        windowEl.style.transform = 'translateY(0) scale(1)';
        animating = false;
      }
    }, 10);
    setTimeout(() => {
      if (document.querySelector('.cbt-tab-btn.active')?.dataset.tab === 'chat') input.focus();
    }, 400);
    animating = true;
    // Toujours personnaliser le message de bienvenue selon l'état actuel
    setTimeout(() => {
      const user = getUserInfo();
      if (!welcomeShown) {
        if (user && user.name) {
          appendMessage(`Bonjour ${user.name} ! Ravi de vous revoir. Comment puis-je vous aider ? 😊`, 'bot', true);
        } else {
          appendMessage(getWelcomeMessage(), 'bot', true);
        }
        welcomeShown = true;
      } else if (user && user.name && messages.childElementCount === 0) {
        // Si l'utilisateur vient de se connecter et qu'il n'y a pas de message, personnalise
        appendMessage(`Bonjour ${user.name} ! Ravi de vous revoir. Comment puis-je vous aider ? 😊`, 'bot', true);
      }
    }, 500);
  }
  function hideBot() {
    if (animating) return;
    animating = true;
    windowEl.classList.remove('cbt-open'); // Remove open class
    if (window.anime) {
      anime({
        targets: windowEl,
        opacity: [1, 0],
        translateY: [0, 80],
        scale: [1, 0.7],
        duration: 600,
        easing: 'easeInCubic',
        complete: () => {
          windowEl.style.display = 'none';
          animating = false;
        }
      });
    } else {
      windowEl.style.opacity = '0';
      windowEl.style.transform = 'translateY(80px) scale(0.7)';
      setTimeout(() => {
        windowEl.style.display = 'none';
        animating = false;
      }, 600);
    }
  }
  toggleBtn.onclick = () => {
    if (windowEl.classList.contains('cbt-open')) {
      hideBot();
    } else {
      showBot();
    }
  };
  closeBtn.onclick = hideBot;
  form.onsubmit = e => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    const user = getUserInfo();
    if (!user) {
      appendMessage("Veuillez vous connecter pour discuter avec WiseBot.", 'bot', true, 'received');
      if (window.showGoogleLoginNotification) window.showGoogleLoginNotification();
      return;
    }
    appendMessage(val, 'user', true, 'sent');
    input.value = '';
    botReply(val);
  };

  // Ajout du style pour l'animation typing
  if (!document.getElementById('cbt-typing-style')) {
    const style = document.createElement('style');
    style.id = 'cbt-typing-style';
    style.innerHTML = `
      .cbt-typing-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0 2px;
        background: #36d1c4;
        border-radius: 50%;
        opacity: 0.7;
        animation: cbt-typing-bounce 1.2s infinite both;
      }
      .cbt-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .cbt-typing-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes cbt-typing-bounce {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.7; }
        40% { transform: scale(1.2); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}
