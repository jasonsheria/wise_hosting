// Chatbot logic for all pages
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', chatbotInit);
} else {
  chatbotInit();
}

function chatbotInit() {
  console.log('[Chatbot] chatbotInit started');
  let animating = false;
  let welcomeShown = false;
  const widgetHtml = `<!-- Chatbot Component Start -->\
<div id="chatbot-widget" style="position:fixed;bottom:24px;right:24px;z-index:9999;max-width:100vw;">\
  <button id="chatbot-toggle" aria-label="Ouvrir le chatbot" style="background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);\
    border: none;\
    border-radius: 50%;\
    width: 60px;\
    height: 60px;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    cursor: pointer;\
    box-shadow: 0 8px 24px rgba(24,90,157,0.25), 0 2px 6px rgba(67,206,162,0.15);">\
    <span style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;">\
      <span class=\"icon-chat\" style=\"font-size:2rem;color:#fff;\"></span>\
    </span>\
  </button>\
  <div id=\"chatbot-window\" class=\"cbt-closed\" style=\"display:none;flex-direction:column;width:380px;max-width:98vw;height:550px;max-height:90vh;background:linear-gradient(160deg,#f0f4f8 0%,#e0e8f0 100%);border-radius:20px !important;box-shadow:0 12px 40px rgba(0,0,0,0.12);overflow:hidden;transition:width 0.2s, height 0.2s;\">\
    <div style=\"background:linear-gradient(135deg,#43cea2,#185a9d);color:#fff;padding:20px 24px;font-weight:600;display:flex;align-items:center;justify-content:space-between;letter-spacing:0.5px;border-bottom: 1px solid rgba(255,255,255,0.1);\">\
      <span style=\"display:flex;align-items:center;gap:10px;\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"4\" y=\"7\" width=\"24\" height=\"16\" rx=\"8\" fill=\"url(#chatbot-bubble-gradient)\"/><ellipse cx=\"12\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/><ellipse cx=\"16\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/><ellipse cx=\"20\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/></svg> WiseBot</span>\
      <button id=\"chatbot-close\" aria-label=\"Fermer\" style=\"background:none;border:none;color:rgba(255,255,255,0.8);font-size:2.2rem;cursor:pointer;transition:color 0.2s;line-height:1;\">&times;</button>\
    </div>\
    <div id=\"chatbot-tabs\" style=\"display:flex;flex-direction:row;justify-content:space-around;align-items:center;background:#e9eff5;padding:4px;border-bottom:1px solid #d8e0e8;\">\
      <button class=\"cbt-tab-btn active\" data-tab=\"quick\" style=\"flex:1;padding:12px 0;border:none;background:transparent;font-weight:600;color:#185a9d;font-size:0.95rem;cursor:pointer;transition:all 0.25s ease;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:10px;\"><span class=\"flaticon-zap\" style=\"font-size:1.1rem;\"></span>Rapide</button>\
      <button class=\"cbt-tab-btn\" data-tab=\"chat\" style=\"flex:1;padding:12px 0;border:none;background:transparent;font-weight:600;color:#185a9d;font-size:0.95rem;cursor:pointer;transition:all 0.25s ease;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:10px;\"><span class=\"flaticon-message-square\" style=\"font-size:1.1rem;\"></span>Chat</button>\
      <button class=\"cbt-tab-btn\" data-tab=\"profile\" style=\"flex:1;padding:12px 0;border:none;background:transparent;font-weight:600;color:#185a9d;font-size:0.95rem;cursor:pointer;transition:all 0.25s ease;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:10px;\"><span class=\"flaticon-user\" style=\"font-size:1.1rem;\"></span>Profil</button>\
    </div>\
    <div id=\"chatbot-tab-content\" style=\"flex:1;display:flex;flex-direction:column;\">\
      <div id=\"chatbot-quick\" class=\"cbt-tab-panel\" style=\"display:block;flex:1;padding:20px;overflow-y:auto;\">\
        <div style=\"display:flex;flex-direction:column;gap:12px;\">\
          <button class=\"cbt-quick-btn\" style=\"background:#fff;color:#333;border:1px solid #d8e0e8;border-radius:10px;padding:12px 18px;cursor:pointer;font-weight:500;box-shadow:0 2px 5px rgba(0,0,0,0.05);text-align:left;transition:all 0.2s ease;display:flex;align-items:center;gap:10px;\"><span class=\"flaticon-help-circle\" style=\"font-size:1.2rem;color:#43cea2;\"></span>Quels sont vos tarifs ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:#fff;color:#333;border:1px solid #d8e0e8;border-radius:10px;padding:12px 18px;cursor:pointer;font-weight:500;box-shadow:0 2px 5px rgba(0,0,0,0.05);text-align:left;transition:all 0.2s ease;display:flex;align-items:center;gap:10px;\"><span class=\"flaticon-help-circle\" style=\"font-size:1.2rem;color:#43cea2;\"></span>Comment contacter le support ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:#fff;color:#333;border:1px solid #d8e0e8;border-radius:10px;padding:12px 18px;cursor:pointer;font-weight:500;box-shadow:0 2px 5px rgba(0,0,0,0.05);text-align:left;transition:all 0.2s ease;display:flex;align-items:center;gap:10px;\"><span class=\"flaticon-help-circle\" style=\"font-size:1.2rem;color:#43cea2;\"></span>Proposez-vous un essai gratuit ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:#fff;color:#333;border:1px solid #d8e0e8;border-radius:10px;padding:12px 18px;cursor:pointer;font-weight:500;box-shadow:0 2px 5px rgba(0,0,0,0.05);text-align:left;transition:all 0.2s ease;display:flex;align-items:center;gap:10px;\"><span class=\"flaticon-help-circle\" style=\"font-size:1.2rem;color:#43cea2;\"></span>Quels sont vos horaires ?</button>\
        </div>\
      </div>\
      <div id=\"chatbot-chat\" class=\"cbt-tab-panel\" style=\"display:none;flex:1;flex-direction:column;background:transparent;\">\
        <div id=\"chatbot-messages\" style=\"flex: 1;\n  padding: 15px 10px;\n  background: none;\n  scroll-behavior: smooth;\n  overflow-x: hidden;\n  overflow-y: auto;\n  max-height: calc(463px - 160px);\"></div>\
        <form id=\"chatbot-form\" style=\"display:flex;padding:12px;border-top:1px solid #d8e0e8;gap:10px;background:#e9eff5;\">\
          <input id=\"chatbot-input\" type=\"text\" placeholder=\"Votre message...\" autocomplete=\"off\" style=\"flex:1;padding:12px 16px;border-radius:10px;border:1px solid #cdd7e0;outline:none;font-size:1rem;transition:border 0.2s, box-shadow 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.04);background:#fff;\" required />\
          <button type=\"submit\" style=\"background:linear-gradient(135deg,#43cea2,#185a9d);color:#fff;border:none;border-radius:10px;padding:12px 22px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(24,90,157,0.15);transition:background 0.2s;display:flex;align-items:center;gap:8px;\"><span class=\"flaticon-send\" style=\"font-size:1.1rem;\"></span>Envoyer</button>\
        </form>\
      </div>\
      <div id=\"chatbot-profile\" class=\"cbt-tab-panel\" style=\"display:none;flex:1;padding:25px;justify-content:center;align-items:center;background:transparent;\">\
        <div style=\"display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;gap:20px;\">\
          <img src=\"https://ui-avatars.com/api/?name=User&background=43cea2&color=fff&size=90&font-size=0.45&bold=true\" alt=\"Avatar\" style=\"width:90px;height:90px;border-radius:50%;box-shadow:0 4px 15px rgba(67,206,162,0.25);border:3px solid #fff;\" />\
          <div style=\"font-size:1.2rem;font-weight:600;color:#185a9d;word-break:break-word;\">Utilisateur invité</div>\
          <div style=\"font-size:1rem;color:#555;text-align:center;word-break:break-word;max-width:280px;\">Connectez-vous pour une expérience personnalisée et accéder à votre historique.</div>\
          <button style=\"background:linear-gradient(135deg,#43cea2,#185a9d);color:#fff;border:none;border-radius:10px;padding:12px 28px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(24,90,157,0.15);transition:background 0.2s;display:flex;align-items:center;gap:8px;font-size:1rem;\"><span class=\"flaticon-log-in\" style=\"font-size:1.1rem;\"></span>Se connecter</button>\
        </div>\
      </div>\
    </div>\
  </div>\
</div>\
<!-- Chatbot Component End -->\
<style>\
#chatbot-widget { max-width: 100vw; font-family: 'Poppins', 'Roboto', sans-serif; }\
#chatbot-window { box-sizing: border-box; }\
#chatbot-tab-content { box-sizing: border-box; }\
#chatbot-messages { box-sizing: border-box; }\
#chatbot-window::-webkit-scrollbar,\n#chatbot-tab-content::-webkit-scrollbar,\n#chatbot-messages::-webkit-scrollbar { width: 6px !important; }\
#chatbot-window::-webkit-scrollbar-thumb,\n#chatbot-tab-content::-webkit-scrollbar-thumb,\n#chatbot-messages::-webkit-scrollbar-thumb { background: #bdcddb !important; border-radius: 3px !important; }\
#chatbot-window, #chatbot-tab-content, #chatbot-messages { scrollbar-width: thin !important; scrollbar-color: #bdcddb #f0f4f8 !important; }\
#chatbot-close:hover { color: #fff !important; transform: scale(1.1); }\
.cbt-quick-btn:hover { background: #f0f8ff !important; border-color: #43cea2 !important; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.08) !important; }\
#chatbot-input:focus { border-color: #43cea2 !important; box-shadow: 0 0 0 3px rgba(67,206,162,0.2) !important; }\
#chatbot-form button[type="submit"]:hover { background: linear-gradient(135deg,#3dbb93,#15508c) !important; box-shadow: 0 4px 12px rgba(24,90,157,0.25) !important; }\
@media (max-width: 600px) {\
  #chatbot-window {\
    width: 95vw !important;\
    height: 75vh !important;\
    max-height: calc(100vh - 70px) !important;\
    border-radius: 15px !important;\
    bottom: 60px !important; /* Adjusted to make space for toggle */ \
    left: 50% !important;\
    transform: translateX(-50%) !important;\
    margin: 0 !important;\
    box-shadow: 0 5px 25px rgba(0,0,0,0.1) !important;\
  }\
  #chatbot-messages { max-height: calc(75vh - 150px) !important; padding: 10px 8px !important; }\
  #chatbot-profile, #chatbot-quick, #chatbot-chat { padding: 10px !important; }\
  #chatbot-widget {\
    /* Widget container itself doesn't need fixed positioning if window is centered */ \
  }\
  #chatbot-toggle {\
    right: 15px !important;\
    bottom: 15px !important;\
    width: 52px !important;\
    height: 52px !important;\
    position: fixed !important;\
  }\
  #chatbot-toggle span {\
    width: 30px !important;\
    height: 30px !important;\
  }\
  .cbt-tab-btn {\
    font-size: 0.9rem !important;\
    padding: 10px 0 !important;\
    gap: 4px !important;\
  }\
  .cbt-tab-btn span { font-size: 1rem !important; }\
  .cbt-quick-btn {\
    font-size: 0.9rem !important;\
    padding: 10px 12px !important;\
    border-radius: 8px !important;\
    gap: 8px !important;\
  }\
  #chatbot-form {\
    padding: 8px !important;\
    gap: 8px !important;\
  }\
  #chatbot-input {\
    font-size: 0.95rem !important;\
    padding: 10px 12px !important;\
    border-radius: 8px !important;\
  }\
  #chatbot-form button[type="submit"] {\
    padding: 10px 15px !important;\
    font-size: 0.95rem !important;\
    border-radius: 8px !important;\
  }\
  #chatbot-profile img {\
    width: 70px !important;\
    height: 70px !important;\
  }\
  .cbt-msg-bubble {\
    max-width: 85% !important;\
    font-size: 0.95rem !important;\
    padding: 10px 14px !important;\
    border-radius: 14px !important;\
  }\
  .cbt-msg-bubble div[style*="font-size:0.92em"] { font-size: 0.8em !important; }\
}\n.cbt-tab-btn.active { background: #fff !important; color:#185a9d !important; box-shadow: 0 2px 5px rgba(0,0,0,0.08); }\n.cbt-tab-btn:not(.active):hover { background: #dde6ed !important; color: #185a9d !important; }\n</style>`;
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
    animateScript.onload = () => { 
      window.animate = true; 
      console.log('[Chatbot] anime.js loaded');
    };
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
      return '<span title="Envoyé" style="color:rgba(255,255,255,0.7);font-size:1em;vertical-align:middle;margin-left:5px;">✓</span>';
    } else if (status === 'received') {
      return '<span title="Reçu" style="color:rgba(255,255,255,0.7);font-size:1em;vertical-align:middle;margin-left:5px;">✓✓</span>';
    } else if (status === 'read') {
      return '<span title="Lu" style="color:#43cea2;font-size:1em;vertical-align:middle;margin-left:5px;">✓✓</span>';
    }
    return '';
  }

  // Append a message with timestamp and status
  function appendMessage(text, from, animated = true, status = null, time = null) {
    const msg = document.createElement('div');
    msg.style.margin = '8px 0'; // Consistent margin
    msg.style.display = 'flex';
    msg.style.justifyContent = from === 'user' ? 'flex-end' : 'flex-start';
    msg.style.padding = '0 5px'; // Padding for the row
    const msgTime = time || getTimeString();
    let msgStatus = '';
    if (from === 'user') {
      msgStatus = getStatusIcon(status || 'sent');
    }
    // Bot messages don't typically show status icons like 'sent' or 'read' from its perspective
    
    const padding = window.innerWidth <= 600 ? '10px 14px' : '12px 18px';
    const borderRadius = '18px'; // Unified border radius
    const maxWidth = '80%'; // Max width for bubbles
    const fontSize = window.innerWidth <= 600 ? '0.95rem' : '0.98rem';

    const userBubbleStyle = `background:linear-gradient(135deg,#43cea2,#185a9d);color:#fff;border-radius:${borderRadius} ${borderRadius} ${from === 'user' ? '4px' : borderRadius} ${from === 'user' ? borderRadius : '4px'};`;
    const botBubbleStyle = `background:#fff;color:#333;border:1px solid #e0e8f0;border-radius:${borderRadius} ${borderRadius} ${from === 'bot' ? '4px' : borderRadius} ${from === 'bot' ? borderRadius : '4px'};`;

    msg.innerHTML = `<div class="cbt-msg-bubble" style="${from === 'user' ? userBubbleStyle : botBubbleStyle}padding:${padding};max-width:${maxWidth};display:inline-block;box-shadow:0 3px 8px rgba(0,0,0,0.08);font-size:${fontSize};line-height:1.55;position:relative;${animated?'animation:cbt-msg-in 0.4s cubic-bezier(.25,.8,.5,1);':''}">
      <span>${text}</span>
      <div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:5px;font-size:0.88em;opacity:0.8;color:${from === 'user' ? 'rgba(255,255,255,0.8)' : '#777'};">
        <span>${msgTime}</span>${msgStatus}
      </div>
    </div>`;
    
    if(animated) {
      msg.style.opacity = '0';
      msg.style.transform = from === 'user' ? 'translateX(20px)' : 'translateX(-20px)';
      setTimeout(() => {
        msg.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        msg.style.opacity = '1';
        msg.style.transform = 'translateX(0)';
      }, 10);
    }
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // Ajout d'une animation typing pour le bot
  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'cbt-typing';
    // Consistent styling with bot messages
    typing.innerHTML = `<div style="background:#fff;color:#333;border:1px solid #e0e8f0;padding:12px 18px;border-radius:18px 18px 18px 4px;max-width:80%;display:inline-block;box-shadow:0 3px 8px rgba(0,0,0,0.08);font-size:0.98rem;line-height:1.55;">
      <span class='cbt-typing-dot'></span><span class='cbt-typing-dot'></span><span class='cbt-typing-dot'></span>
    </div>`;
    typing.style.margin = '8px 0';
    typing.style.display = 'flex';
    typing.style.justifyContent = 'flex-start';
    typing.style.padding = '0 5px';
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
      console.log('[Chatbot] getUserInfo: raw googleUser from localStorage:', raw);
      if (!raw) {
        console.log('[Chatbot] getUserInfo: No user data in localStorage.');
        return null;
      }
      const googleUser = JSON.parse(raw);
      // Correction : le vrai user est dans googleUser.user
      if (googleUser && googleUser.user && googleUser.user.username && googleUser.user.email) {
        console.log('[Chatbot] User info found in googleUser.user:', googleUser.user.username, googleUser.user.email);
        welcomeShown = true; // Marque que l'utilisateur est connecté
        return {
          name: googleUser.user.username,
          email: googleUser.user.email,
          picture: googleUser.user.profileUrl || '',
          // Ajoute d'autres champs si besoin
        };
      } else {
        console.log('[Chatbot] getUserInfo: Parsed googleUser data does not contain expected user details.', googleUser);
      }
    } catch (e) { 
      console.error('[Chatbot] Erreur parsing googleUser:', e); 
    }
    return null;
  }

  function updateProfileTab() {
    console.log('[Chatbot] updateProfileTab called');
    const user = getUserInfo();
    const profilePanel = document.getElementById('chatbot-profile');
    if (!profilePanel) {
      console.error('[Chatbot] updateProfileTab: profilePanel not found');
      return;
    }
    if (user) {
      console.log('[Chatbot] updateProfileTab: User found', user);
      profilePanel.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:20px;text-align:center;">
          <img src="${user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=43cea2&color=fff&size=90&font-size=0.45&bold=true'}" alt="Avatar" style="width:90px;height:90px;border-radius:50%;box-shadow:0 4px 15px rgba(67,206,162,0.25);border:3px solid #fff;" />
          <div style="font-size:1.2rem;font-weight:600;color:#185a9d;">${user.name}</div>
          <div style="font-size:1rem;color:#555;">${user.email}</div>
          <button id="cbt-logout-btn" style="background:linear-gradient(135deg,#ff7e5f,#feb47b);color:#fff;border:none;border-radius:10px;padding:12px 28px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(255,126,95,0.2);transition:all 0.2s ease;font-size:1rem;display:flex;align-items:center;gap:8px;"><span class="flaticon-log-out" style="font-size:1.1rem;"></span>Se déconnecter</button>
        </div>
      `;
      // Add hover effect for logout button
      const logoutBtn = document.getElementById('cbt-logout-btn');
      if(logoutBtn) {
        logoutBtn.onmouseover = () => logoutBtn.style.background = 'linear-gradient(135deg,#f86a4a,#fea468)';
        logoutBtn.onmouseout = () => logoutBtn.style.background = 'linear-gradient(135deg,#ff7e5f,#feb47b)';
      }
      setTimeout(() => {
        const currentLogoutBtn = document.getElementById('cbt-logout-btn'); // re-fetch to ensure it's the current one
        if (currentLogoutBtn) {
          currentLogoutBtn.onclick = function () {
            console.log('[Chatbot] Logout button clicked');
            localStorage.removeItem('googleUser');
            updateProfileTab(); // Refresh profile tab
            // Mise à jour du message de bienvenue et du blocage chat après déconnexion
            welcomeShown = false; // Reset welcome message state
            // if (document.querySelector('.cbt-tab-btn.active')?.dataset.tab === 'profile') updateProfileTab(); // Already called above
            // Clear messages or show a "logged out" message if on chat tab
            messages.innerHTML = ''; // Clear previous chat messages
            appendMessage("Vous avez été déconnecté. Veuillez vous reconnecter pour discuter.", 'bot');
            console.log('[Chatbot] User logged out, profile tab updated, welcomeShown reset.');
          };
        }
      }, 50);
    } else {
      console.log('[Chatbot] updateProfileTab: No user found (guest)');
      profilePanel.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:20px;text-align:center;">
          <img src="https://ui-avatars.com/api/?name=User&background=43cea2&color=fff&size=90&font-size=0.45&bold=true" alt="Avatar" style="width:90px;height:90px;border-radius:50%;box-shadow:0 4px 15px rgba(67,206,162,0.25);border:3px solid #fff;" />
          <div style="font-size:1.2rem;font-weight:600;color:#185a9d;">Utilisateur invité</div>
          <div style="font-size:1rem;color:#555;max-width:280px;">Connectez-vous pour une expérience personnalisée et accéder à votre historique.</div>
          <button id="cbt-login-btn" style="background:linear-gradient(135deg,#43cea2,#185a9d);color:#fff;border:none;border-radius:10px;padding:12px 28px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(24,90,157,0.15);transition:all 0.2s ease;font-size:1rem;display:flex;align-items:center;gap:8px;"><span class="flaticon-log-in" style="font-size:1.1rem;"></span>Se connecter</button>
        </div>
      `;
      // Add hover effect for login button
      const loginBtn = document.getElementById('cbt-login-btn');
      if(loginBtn) {
        loginBtn.onmouseover = () => loginBtn.style.background = 'linear-gradient(135deg,#3dbb93,#15508c)';
        loginBtn.onmouseout = () => loginBtn.style.background = 'linear-gradient(135deg,#43cea2,#185a9d)';
      }
      setTimeout(() => {
        const currentLoginBtn = document.getElementById('cbt-login-btn'); // re-fetch
        if (currentLoginBtn) {
          currentLoginBtn.onclick = function () {
            console.log('[Chatbot] Login button clicked');
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
        console.log('[Chatbot] Tab button clicked:', btn.dataset.tab);
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
        console.log('[Chatbot] Quick question button clicked:', btn.textContent);
        // Vérifie la connexion avant d'autoriser le chat
        if (!getUserInfo()) {
          console.log('[Chatbot] Quick question: User not logged in, showing login prompt.');
          tabBtns[1].click(); // Switch to chat tab
          messages.innerHTML = ''; // Clear previous messages
          appendMessage("Veuillez vous connecter pour discuter avec WiseBot.", 'bot');
          if (window.showGoogleLoginNotification) window.showGoogleLoginNotification();
          return;
        }
        tabBtns[1].click(); // Switch to chat tab
        input.value = btn.textContent; // Populate input
        form.dispatchEvent(new Event('submit', { bubbles: true })); // Submit form
        console.log('[Chatbot] Quick question: User logged in, submitting question.');
      };
    });
    updateProfileTab();
  }, 100);

  function showBot() {
    console.log('[Chatbot] showBot called');
    if (animating) return;
    windowEl.classList.add('cbt-open');
    windowEl.classList.remove('cbt-closed', 'animate__fadeOutDown', 'animate__animated');
    windowEl.style.display = 'flex';
    windowEl.style.opacity = '0';
    windowEl.style.transform = 'translateY(50px) scale(0.9)'; // Adjusted for smoother entry
    setTimeout(() => {
      if (window.anime) {
        anime({
          targets: windowEl,
          opacity: [0, 1],
          translateY: [50, 0], // Adjusted
          scale: [0.9, 1],    // Adjusted
          duration: 700,      // Slightly faster
          easing: 'easeOutExpo', // Smoother easing
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
        if (user && user.username && user.email) {
          console.log('[Chatbot] showBot: Appending welcome back message for user:', user.name);
          appendMessage(`Bonjour ${user.username || user.email } ! Ravi de vous revoir. Comment puis-je vous aider ? 😊`, 'bot', true);
        } else {
          console.log('[Chatbot] showBot: Appending generic welcome message.');
          appendMessage(getWelcomeMessage(), 'bot', true);
        }
        welcomeShown = true;
      } else if (user && user.username && messages.childElementCount === 0) {
        console.log('[Chatbot] showBot: User logged in and no messages, appending welcome back message for user:', user.name);
        // Si l'utilisateur vient de se connecter et qu'il n'y a pas de message, personnalise
        appendMessage(`Bonjour ${user.name} ! Ravi de vous revoir. Comment puis-je vous aider ? 😊`, 'bot', true);
      } else {
        console.log('[Chatbot] showBot: Welcome message already shown or no specific condition met for new welcome.');
      }
    }, 500);
  }
  function hideBot() {
    console.log('[Chatbot] hideBot called');
    if (animating) return;
    animating = true;
    windowEl.classList.remove('cbt-open'); // Remove open class
    if (window.anime) {
      anime({
        targets: windowEl,
        opacity: [1, 0],
        translateY: [0, 50], // Adjusted
        scale: [1, 0.9],    // Adjusted
        duration: 500,      // Slightly faster
        easing: 'easeInExpo', // Smoother easing
        complete: () => {
          windowEl.style.display = 'none';
          animating = false;
        }
      });
    } else {
      windowEl.style.opacity = '0';
      windowEl.style.transform = 'translateY(50px) scale(0.9)';
      setTimeout(() => {
        windowEl.style.display = 'none';
        animating = false;
      }, 500);
    }
  }
  toggleBtn.onclick = () => {
    if (windowEl.classList.contains('cbt-open')) {
      console.log('[Chatbot] toggleBtn: Closing bot');
      hideBot();
    } else {
      console.log('[Chatbot] toggleBtn: Opening bot');
      showBot();
    }
  };
  closeBtn.onclick = () => {
    console.log('[Chatbot] closeBtn clicked');
    hideBot();
  };
  
  // This form.onsubmit is for the old non-socket logic, will be overridden later by socket logic if socket connects.
  // Keep it for fallback or if socket connection fails.
  const initialFormSubmitHandler = e => {
    e.preventDefault();
    console.log('[Chatbot] Initial form.onsubmit (non-socket) triggered.');
    const val = input.value.trim();
    if (!val) return;
    // This should ideally check if socket is connected and use sendChatbotMessage
    // For now, it might call botReply or be overridden.
    // The assignment below to form.onsubmit will replace this.
    // For clarity, we can leave this and let the socket logic override it.
    // If socket is intended to be the ONLY way, then this should be removed or adapted.
    // The current structure has form.onsubmit reassigned later.
    
    // If we want to ensure this uses the socket logic if available:
    const currentUser = getChatbotUser();
    if (currentUser && currentUser.token && socket && isSocketConnected) {
        console.log('[Chatbot] Initial form.onsubmit: Socket available, using sendChatbotMessage.');
        sendChatbotMessage(val);
    } else {
        console.log('[Chatbot] Initial form.onsubmit: Socket not available, using local botReply.');
        appendMessage(val, 'user', true, 'sent');
        botReply(val); // Fallback to old bot logic if no socket
    }
    input.value = '';
  };
  form.onsubmit = initialFormSubmitHandler;


  // --- SOCKET.IO CHATBOT INTEGRATION ---
  let socket = null;
  let isSocketConnected = false;
  let chatbotUser = null;

  function getChatbotUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('googleUser'));
    if (!raw) return null;
    // Si backend renvoie {token, user: {...}}, aplatir
    if (raw.user && (raw.user._id || raw.user.id) && raw.token) {
      return { ...raw.user, token: raw.token, _id: raw.user._id };
    }
    // Sinon, structure déjà à plat
    return raw;
  } catch { return null; }
}

  function connectChatbotSocket() {
    chatbotUser = getChatbotUser(); // Ensure chatbotUser is fresh
    console.log('[Chatbot] [SOCKET] Début de la demande de connexion WebSocket. Utilisateur:', chatbotUser);
    if (isSocketConnected) {
      console.log('[Chatbot] [SOCKET] Déjà connecté, annulation de la nouvelle demande.');
      return;
    }
    if (!chatbotUser || !chatbotUser.token) {
      console.log('[Chatbot] [SOCKET] Aucun token utilisateur, connexion annulée.');
      return;
    }
    if (typeof io === 'undefined') {
      console.error('[Chatbot] [SOCKET] ERREUR: Socket.IO client (io) n\'est pas chargé ! Ajoutez <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script> avant ce script.');
      return;
    }
    if (socket) {
      console.log('[Chatbot] [SOCKET] Déconnexion de l\'ancien socket avant nouvelle connexion.');
      socket.disconnect();
    }
    console.log('[Chatbot] [SOCKET] Tentative de connexion à WebSocket avec token:', chatbotUser.token ? 'présent' : 'absent');
    socket = io('http://localhost:5000', {
      auth: { token: chatbotUser.token },
      transports: ['websocket']
    });

    socket.on('connect', () => {
      isSocketConnected = true;
      console.log('[Chatbot] [SOCKET] Connexion WebSocket établie. Socket ID:', socket.id);
      if (chatbotUser._id) {
        console.log('[Chatbot] [SOCKET] Emission de "identify" pour userId:', chatbotUser._id);
        socket.emit('identify', { userId: chatbotUser._id });
      }
      // Demande l'historique à la connexion
      console.log('[Chatbot] [SOCKET] Emission de "getMessageHistory" pour userId:', chatbotUser._id);
      socket.emit('getMessageHistory', { userId: chatbotUser._id });
    });

    socket.on('disconnect', (reason) => { 
      isSocketConnected = false; 
      console.log('[Chatbot] [SOCKET] Déconnecté du WebSocket. Raison:', reason);
    });

    socket.on('connect_error', (err) => { 
      isSocketConnected = false; 
      console.error('[Chatbot] [SOCKET] Erreur de connexion WebSocket.', err.message, err.data || '');
      showNotif('Erreur WebSocket: ' + err.message, 'error'); 
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log('[Chatbot] [SOCKET] Tentative de reconnexion WebSocket, tentative n°', attempt);
    });

    socket.on('reconnect', (attempt) => {
      console.log('[Chatbot] [SOCKET] Reconnexion WebSocket réussie après', attempt, 'tentatives');
    });

    socket.on('reconnect_error', (err) => {
      console.error('[Chatbot] [SOCKET] Erreur lors de la reconnexion WebSocket:', err);
    });

    socket.on('reconnect_failed', () => {
      console.error('[Chatbot] [SOCKET] Toutes les tentatives de reconnexion WebSocket ont échoué.');
    });

    // Réception des messages
    socket.on('newMessage', (msg) => {
      console.log('[Chatbot] [SOCKET] Événement "newMessage" reçu.', msg);
      appendChatbotMessage(msg, msg.sender === chatbotUser._id ? 'user' : 'bot');
    });
    socket.on('receiveMessage', (msg) => {
      console.log('[Chatbot] [SOCKET] Événement "receiveMessage" reçu.', msg);
      appendChatbotMessage(msg, msg.sender === chatbotUser._id ? 'user' : 'bot');
    });
    socket.on('messageHistory', (history) => {
      console.log('[Chatbot] [SOCKET] Événement "messageHistory" reçu.', history);
      messages.innerHTML = '';
      if(Array.isArray(history)) {
        history.forEach(msg => appendChatbotMessage(msg, msg.sender === chatbotUser._id ? 'user' : 'bot', false));
        scrollChatbotToBottom();
        console.log('[Chatbot] [SOCKET] Historique des messages traité.');
      } else {
        console.log('[Chatbot] [SOCKET] Historique des messages non conforme (pas un tableau).', history);
      }
    });
  }

  function sendChatbotMessage(text) {
    console.log('[Chatbot] sendChatbotMessage: Attempting to send message:', text);
    chatbotUser = getChatbotUser(); // Refresh user info
    if (!chatbotUser || !chatbotUser.token || !chatbotUser._id) {
      console.warn('[Chatbot] sendChatbotMessage: User not logged in or missing ID/token. Message not sent.');
      showNotif('Vous devez être connecté pour envoyer un message.', 'error');
      // Optionally, trigger login prompt or switch to profile tab
      // tabBtns.find(btn => btn.dataset.tab === 'profile').click();
      return;
    }
    if (!socket || !isSocketConnected) {
      console.warn('[Chatbot] sendChatbotMessage: Socket not connected. Message not sent.');
      showNotif('Non connecté au chat. Tentative de reconnexion...', 'error');
      connectChatbotSocket(); // Attempt to reconnect
      return;
    }
    const msg = {
      userId: chatbotUser._id, // Should be the recipient if it's a 1-to-1, or a general ID if group/bot
      senderId: chatbotUser._id, // The actual sender
      text: text,
      date: new Date().toISOString()
    };
    console.log('[Chatbot] sendChatbotMessage: Emitting "newMessage" via socket.', msg);
    socket.emit('newMessage', msg);
    // Append user's own message to their UI immediately
    // The server might echo it back or send a confirmation, handle duplicates if necessary
    // For now, let's assume the 'newMessage' or 'receiveMessage' from server will handle display for bot's reply
    // and user's own message should be displayed locally first.
    appendChatbotMessage({ ...msg, content: msg.text }, 'user'); // Use 'content' if appendChatbotMessage expects that
  }

  function appendChatbotMessage(msg, from, scroll = true) {
    console.log('[Chatbot] appendChatbotMessage: Appending message.', { msg, from });
    const messagesDiv = document.getElementById('chatbot-messages'); 
    if (!messagesDiv) {
      console.error('[Chatbot] appendChatbotMessage: messagesDiv element not found.');
      return;
    }
    
    const bubbleContainer = document.createElement('div');
    bubbleContainer.style.display = 'flex';
    bubbleContainer.style.justifyContent = from === 'user' ? 'flex-end' : 'flex-start';
    bubbleContainer.style.margin = '8px 0';
    bubbleContainer.style.padding = '0 5px';


    const bubble = document.createElement('div');
    bubble.className = 'cbt-msg-bubble'; // Keep class for potential global styling
    const borderRadius = '18px';
    const userBubbleStyle = `background:linear-gradient(135deg,#43cea2,#185a9d);color:#fff;border-radius:${borderRadius} ${borderRadius} 4px ${borderRadius};`;
    const botBubbleStyle = `background:#fff;color:#333;border:1px solid #e0e8f0;border-radius:${borderRadius} ${borderRadius} ${borderRadius} 4px;`;
    
    bubble.style = `${from === 'user' ? userBubbleStyle : botBubbleStyle}padding:10px 16px;max-width:80%;word-break:break-word;box-shadow:0 3px 8px rgba(0,0,0,0.08);font-size:0.98rem;line-height:1.55;position:relative;animation:cbt-msg-in 0.4s cubic-bezier(.25,.8,.5,1);`;
    
    // Sanitize message content before inserting as HTML
    const textSpan = document.createElement('span');
    textSpan.textContent = msg.text || msg.content || '';
    
    const timeDiv = document.createElement('div');
    timeDiv.style = `font-size:0.88em;color:${from === 'user' ? 'rgba(255,255,255,0.8)' : '#777'};margin-top:5px;text-align:right;`;
    timeDiv.textContent = formatTime(new Date(msg.date || Date.now()));

    bubble.appendChild(textSpan);
    bubble.appendChild(timeDiv);
    
    bubbleContainer.appendChild(bubble);
    messagesDiv.appendChild(bubbleContainer);

    // Animation for new messages
    bubble.style.opacity = '0';
    bubble.style.transform = from === 'user' ? 'translateX(20px)' : 'translateX(-20px)';
    setTimeout(() => {
      bubble.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateX(0)';
    }, 10);

    console.log('[Chatbot] appendChatbotMessage: Message appended to UI.');
    if(scroll) scrollChatbotToBottom();
  }

  function scrollChatbotToBottom() {
    const messagesDiv = document.getElementById('chatbot-messages');
    if(messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      console.log('[Chatbot] scrollChatbotToBottom: Scrolled.');
    } else {
      console.warn('[Chatbot] scrollChatbotToBottom: messagesDiv element not found.');
    }
  }

  // --- INITIALISATION SOCKET AU DEMARRAGE SI CONNECTE ---
  setTimeout(() => {
    console.log('[Chatbot] Initializing socket connection check on startup.');
    chatbotUser = getChatbotUser();
    if (chatbotUser && chatbotUser.token) {
      console.log('[Chatbot] User has token, attempting to connect WebSocket.');
      connectChatbotSocket();
    } else {
      console.log('[Chatbot] No user token found on startup, WebSocket not connected.');
    }
  }, 100);

  // --- AJOUTER NOTIF UTILITAIRE ---
  function showNotif(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = 'auth-toast-notif';
    notif.style = `position:fixed;top:24px;left:50%;transform:translateX(-50%);min-width:280px;max-width:90vw;background:${type === 'success' ? '#e6f9ec' : '#ffeaea'};color:${type === 'success' ? '#1a7f37' : '#b91c1c'};border:1.5px solid ${type === 'success' ? '#34d399' : '#f87171'};border-radius:12px;box-shadow:0 4px 24px #0002;padding:16px 32px;z-index:99999;display:flex;align-items:center;gap:14px;font-size:1.08rem;animation:fadeIn 0.5s;pointer-events:auto;font-weight:500;`;
    notif.innerHTML = `<span style="font-size:1.3em;">${type === 'success' ? '✅' : '❌'}</span><span>${message}</span><button style="margin-left:12px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:inherit;">&times;</button><style>@keyframes fadeIn {from{opacity:0;transform:translateY(-30px);}to{opacity:1;transform:translateY(0);}}</style>`;
    notif.querySelector('button').onclick = () => notif.remove();
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 5000);
  }
  // --- MODIFIER LE FORMULAIRE POUR ENVOYER VIA SOCKET ---
  form.onsubmit = e => {
    e.preventDefault();
    console.log('[Chatbot] Socket-aware form.onsubmit triggered.');
    const val = input.value.trim();
    if (!val) {
      console.log('[Chatbot] form.onsubmit: Empty input, nothing to send.');
      return;
    }
    sendChatbotMessage(val);
    input.value = '';
    console.log('[Chatbot] form.onsubmit: Message sent via sendChatbotMessage, input cleared.');
  };

  // Ajout du style pour l'animation typing
  if (!document.getElementById('cbt-typing-style')) {
    const style = document.createElement('style');
    style.id = 'cbt-typing-style';
    style.innerHTML = `
      .cbt-typing-dot {
        display: inline-block;
        width: 7px; /* Slightly smaller */
        height: 7px; /* Slightly smaller */
        margin: 0 2.5px; /* Adjusted margin */
        background: #185a9d; /* Theme color */
        border-radius: 50%;
        opacity: 0.6;
        animation: cbt-typing-bounce 1.3s infinite ease-in-out; /* Smoother animation */
      }
      .cbt-typing-dot:nth-child(2) { animation-delay: 0.15s; } /* Adjusted delay */
      .cbt-typing-dot:nth-child(3) { animation-delay: 0.3s; }  /* Adjusted delay */
      @keyframes cbt-typing-bounce {
        0%, 60%, 100% { transform: translateY(0) scale(0.9); opacity: 0.6; }
        30% { transform: translateY(-3px) scale(1.1); opacity: 1; } /* More pronounced bounce */
      }
      /* Keyframe for message bubble entry */
      @keyframes cbt-msg-in {
        from { opacity: 0; transform: scale(0.85) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}
