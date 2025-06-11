// Chatbot logic for all pages
(function() {
  const widgetHtml = `<!-- Chatbot Component Start -->\
<div id="chatbot-widget" style="position:fixed;bottom:30px;right:30px;z-index:9999;">\
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
     <span class="flaticon-chat">\
       
      </span>\
    </span>\
  </button>\
  <div id=\"chatbot-window\" class=\"cbt-closed\" style=\"display:none;flex-direction:column;width:370px;height:520px;max-width:95vw;max-height:85vh;background:linear-gradient(135deg,#e0f7fa 60%,#e3e6ff 100%);border-radius:22px;box-shadow:0 8px 32px rgba(54,209,196,0.22);overflow:hidden;\">\
    <div style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;padding:18px 24px;font-weight:600;display:flex;align-items:center;justify-content:space-between;letter-spacing:0.5px;\">\
      <span style=\"display:flex;align-items:center;gap:8px;\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"4\" y=\"7\" width=\"24\" height=\"16\" rx=\"8\" fill=\"url(#chatbot-bubble-gradient)\"/><ellipse cx=\"12\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/><ellipse cx=\"16\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/><ellipse cx=\"20\" cy=\"15\" rx=\"2\" ry=\"2\" fill=\"#fff\"/></svg> WiseBot</span>\
      <button id=\"chatbot-close\" aria-label=\"Fermer\" style=\"background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;transition:color 0.2s;\">&times;</button>\
    </div>\
    <div id=\"chatbot-tabs\" style=\"display:flex;flex-direction:row;justify-content:space-between;align-items:center;background:#e3e6ff;padding:0 0 0 0;\">\
      <button class=\"cbt-tab-btn active\" data-tab=\"quick\" style=\"flex:1;padding:12px 0;border:none;background:none;font-weight:600;color:#36d1c4;font-size:1rem;cursor:pointer;transition:background 0.2s;\">Questions rapides</button>\
      <button class=\"cbt-tab-btn\" data-tab=\"chat\" style=\"flex:1;padding:12px 0;border:none;background:none;font-weight:600;color:#36d1c4;font-size:1rem;cursor:pointer;transition:background 0.2s;\">Discussions</button>\
      <button class=\"cbt-tab-btn\" data-tab=\"profile\" style=\"flex:1;padding:12px 0;border:none;background:none;font-weight:600;color:#36d1c4;font-size:1rem;cursor:pointer;transition:background 0.2s;\">Profil</button>\
    </div>\
    <div id=\"chatbot-tab-content\" style=\"flex:1;display:flex;flex-direction:column;overflow:hidden;\">\
      <div id=\"chatbot-quick\" class=\"cbt-tab-panel\" style=\"display:block;flex:1;overflow-y:auto;padding:18px;\">\
        <div style=\"display:flex;flex-wrap:wrap;gap:10px;\">\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Quels sont vos tarifs ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Comment contacter le support ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Proposez-vous un essai gratuit ?</button>\
          <button class=\"cbt-quick-btn\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 16px;cursor:pointer;font-weight:500;box-shadow:0 2px 8px rgba(54,209,196,0.08);margin-bottom:8px;\">Quels sont vos horaires ?</button>\
        </div>\
      </div>\
      <div id=\"chatbot-chat\" class=\"cbt-tab-panel\" style=\"display:none;flex:1;flex-direction:column;overflow-y:auto;\">\
        <div id=\"chatbot-messages\" style=\"flex:1;padding:0 0 0 0;overflow-y:auto;background:none;scroll-behavior:smooth;\"></div>\
        <form id=\"chatbot-form\" style=\"display:flex;padding:14px 18px;border-top:1px solid #e3e6ff;gap:10px;background:#e0f7fa;\">\
          <input id=\"chatbot-input\" type=\"text\" placeholder=\"Écrivez votre message...\" autocomplete=\"off\" style=\"flex:1;padding:10px 14px;border-radius:12px;border:1px solid #36d1c4;outline:none;font-size:1rem;transition:border 0.2s;box-shadow:0 1px 4px rgba(54,209,196,0.08);\" required />\
          <button type=\"submit\" style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 20px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(54,209,196,0.08);transition:background 0.2s;\">Envoyer</button>\
        </form>\
      </div>\
      <div id=\"chatbot-profile\" class=\"cbt-tab-panel\" style=\"display:none;flex:1;overflow-y:auto;padding:18px;\">\
        <div style=\"display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:18px;\">\
          <img src=\"https://ui-avatars.com/api/?name=User&background=36d1c4&color=fff&size=80\" alt=\"Avatar\" style=\"width:80px;height:80px;border-radius:50%;box-shadow:0 2px 8px #36d1c422;\" />\
          <div style=\"font-size:1.1rem;font-weight:600;color:#36d1c4;\">Utilisateur invité</div>\
          <div style=\"font-size:0.98rem;color:#555;text-align:center;\">Connectez-vous pour profiter de toutes les fonctionnalités du chatbot.</div>\
          <button style=\"background:linear-gradient(135deg,#36d1c4,#5b86e5);color:#fff;border:none;border-radius:12px;padding:10px 24px;cursor:pointer;font-weight:600;box-shadow:0 2px 8px rgba(54,209,196,0.08);transition:background 0.2s;\">Se connecter</button>\
        </div>\
      </div>\
    </div>\
  </div>\
</div>\
<!-- Chatbot Component End -->\
<style>\
@keyframes cbt-fadein {\
  /* Désactivé car Animate.css est utilisé */\
}\
@keyframes cbt-fadeout {\
  /* Désactivé car Animate.css est utilisé */\
}\
.cbt-open, .cbt-closed {\
  /* Désactivé, tout est géré par Animate.css */\
}\
#chatbot-widget #chatbot-toggle:hover span {\
  transform: scale(1.18) rotate(-8deg);\
  filter: drop-shadow(0 0 8px #00c6ff88);\
}\
#chatbot-widget #chatbot-toggle:active {\
  box-shadow:0 2px 8px rgba(0,198,255,0.18);\
}\
#chatbot-window::-webkit-scrollbar {\
  width: 6px;\
  background: #e3f0ff;\
}\
#chatbot-window::-webkit-scrollbar-thumb {\
  background: #b5d0f7;\
  border-radius: 6px;\
}\
#chatbot-messages > div {\
  animation: cbt-msg-in 0.4s cubic-bezier(.4,2,.6,1);\
  transition: box-shadow 0.2s;\
}\
.cbt-tab-btn.active {\
  background:linear-gradient(135deg,#36d1c4,#5b86e5);\
  color:#fff!important;\
  border-radius:0 0 0 0;\
}\
.cbt-tab-btn {\
  border-bottom:2px solid transparent;\
}\
.cbt-tab-btn:not(.active):hover {\
  background:#e0f7fa;\
}\
</style>`;
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

  function appendMessage(text, from, animated = true) {
    const msg = document.createElement('div');
    msg.style.margin = '10px 0';
    msg.style.display = 'flex';
    msg.style.justifyContent = from === 'user' ? 'flex-end' : 'flex-start';
    msg.innerHTML = `<span style="background:${from==='user'?'linear-gradient(135deg,#007bff,#00c6ff)':'rgba(255,255,255,0.85)'};color:${from==='user'?'#fff':'#222'};padding:12px 20px;border-radius:20px;max-width:80%;display:inline-block;box-shadow:0 4px 18px rgba(0,0,0,0.10);font-size:1rem;line-height:1.5;backdrop-filter:${from==='user'?'':'blur(2px)'};border:1px solid #e3f0ff;${animated?'animation:cbt-msg-in 0.5s cubic-bezier(.4,2,.6,1);':''}">${text}</span>`;
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
    const random = arr => arr[Math.floor(Math.random()*arr.length)];
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
      appendMessage(response, 'bot');
    }, 900 + Math.random()*600);
  }

  // Message de bienvenue animé à l'ouverture
  let welcomeShown = false;
  let animating = false;
  // --- TABS LOGIC ---
  const tabBtns = [];
  const tabPanels = {
    quick: null,
    chat: null,
    profile: null
  };
  setTimeout(() => {
    // Get tab buttons and panels
    document.querySelectorAll('.cbt-tab-btn').forEach(btn => {
      tabBtns.push(btn);
      btn.onclick = function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.keys(tabPanels).forEach(k => {
          if(document.getElementById('chatbot-' + k))
            document.getElementById('chatbot-' + k).style.display = (btn.dataset.tab === k) ? (k==='chat'?'flex':'block') : 'none';
        });
      };
    });
    tabPanels.quick = document.getElementById('chatbot-quick');
    tabPanels.chat = document.getElementById('chatbot-chat');
    tabPanels.profile = document.getElementById('chatbot-profile');
    // Default: show quick tab
    tabBtns[0].click();
    // Quick question buttons
    tabPanels.quick.querySelectorAll('.cbt-quick-btn').forEach(btn => {
      btn.onclick = function() {
        // Switch to chat tab and send question
        tabBtns[1].click();
        input.value = btn.textContent;
        form.dispatchEvent(new Event('submit', {bubbles:true}));
      };
    });
  }, 100);

  function showBot() {
    if(animating) return;
    windowEl.classList.remove('cbt-open', 'cbt-closed', 'animate__fadeOutDown', 'animate__animated');
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
    // Focus input only if chat tab is active
    setTimeout(()=>{
      if(document.querySelector('.cbt-tab-btn.active')?.dataset.tab==='chat') input.focus();
    }, 400);
    animating = true;
    if(!welcomeShown) {
      setTimeout(()=>appendMessage(getWelcomeMessage(), 'bot', true), 500);
      welcomeShown = true;
    }
  }
  function hideBot() {
    if(animating) return;
    animating = true;
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
      setTimeout(()=>{
        windowEl.style.display = 'none';
        animating = false;
      }, 600);
    }
  }
  toggleBtn.onclick = () => {
    if(windowEl.classList.contains('cbt-open')) {
      hideBot();
    } else {
      showBot();
    }
  };
  closeBtn.onclick = hideBot;
  form.onsubmit = e => {
    e.preventDefault();
    const val = input.value.trim();
    if(!val) return;
    appendMessage(val, 'user');
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
})();
