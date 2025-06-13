// spa-router.js
// Simple SPA router for static hosting

const routes = {
  '/': 'home.html',
  '/index.html': 'home.html',
  '/about.html': 'about.html',
  '/contact.html': 'contact.html',
  '/domain.html': 'domain.html',
  '/hosting.html': 'hosting.html',
  '/blog.html': 'blog.html',
  '/blog-single.html': 'blog-single.html',
};

function loadContent(path, addToHistory = true) {
  const route = routes[path] || 'home.html';
  fetch(route)
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.text();
    })
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      // Recharge les scripts nécessaires pour les nouveaux contenus
      if (window.jQuery && window.$ && window.$.fn && window.$.fn.owlCarousel) {
        $('.home-slider.owl-carousel').owlCarousel({
          items: 1,
          loop: true,
          autoplay: true,
          nav: false,
          dots: true
        });
      }
      if (addToHistory) history.pushState({ path }, '', path);
      window.scrollTo(0, 0);
    })
    .catch(() => {
      document.getElementById('main-content').innerHTML = '<h2>Page introuvable</h2>';
    });
}

function handleLinkClick(e) {
  const a = e.target.closest('a');
  if (a && a.getAttribute('href') && a.getAttribute('href').endsWith('.html')) {
    const href = a.getAttribute('href');
    if (routes[href]) {
      e.preventDefault();
      loadContent(href);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initial load
  loadContent(location.pathname, false);
  // Delegate link clicks
  document.body.addEventListener('click', handleLinkClick);
  // Handle browser navigation
  window.addEventListener('popstate', function(e) {
    const path = (e.state && e.state.path) || location.pathname;
    loadContent(path, false);
  });
});
