// webhost-gh-pages/js/recentBlogPosts.js
// Ce script récupère les 3 derniers posts du serveur et les affiche dans la section Blog récent

// Configuration : URL de l'API des posts
const API_URL = 'http://localhost:5000'; // À adapter si besoin

// Sélecteur du conteneur Blog récent (doit correspondre à la section dans index.html)
const blogSection = document.getElementById('recent-blog-list');
if (!blogSection) {
    console.error('[recentBlogPosts.js] Section #recent-blog-list introuvable dans le DOM');
    // Affiche un message visible si la section n'existe pas
    const fallback = document.createElement('div');
    fallback.className = 'col-12 text-center text-danger';
    fallback.innerText = 'Section Blog récent introuvable (#recent-blog-list)';
    // Essaie de l'ajouter à la fin du body
    document.body.appendChild(fallback);
}

// Fonction utilitaire pour tronquer le texte
function truncateWords(text, maxWords = 20) {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
}

// Fonction pour générer le HTML d'un post
function createBlogPostHTML(post) {
    return `
    <div class="col-md-4 ftco-animate">
      <div class="blog-entry">
        <a href="blog-single.html?id=${post.id || post._id}" class="block-20" style="background-image: url('${(post.imageUrls && post.imageUrls[0]) || 'images/image_1.jpg'}');">
        </a>
        <div class="text d-flex py-4">
          <div class="meta mb-3">
            <div><a href="#">${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</a></div>
            <div><a href="#">${post.user.username || 'Admin'}</a></div>
            <div><a href="#" class="meta-chat"><span class="icon-chat"></span> ${post.commentsCount || 0}</a></div>
          </div>
          <div class="desc pl-3">
            <h3 class="heading"><a href="blog-single.html?id=${post.id || post._id}">${post.title || 'Sans titre'}</a></h3>
            <p>${truncateWords(post.content, 20)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Ajout dynamique du style pour améliorer l'apparence générale des posts et des catégories
(function injectBlogCardStyles() {
    if (document.getElementById('blog-card-style')) return;
    const style = document.createElement('style');
    style.id = 'blog-card-style';
    style.innerHTML = `
    .blog-entry {
      transition: box-shadow 0.25s, transform 0.18s;
  margin-bottom: 24px;
  border: 1px solid #f0f4fa;
  position: relative;
  opacity: 0;
  transform: translateY(24px);
  animation: card-fade-in 0.8s cubic-bezier(.4,1.4,.6,1) forwards;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0px;
    }
    .blog-entry:hover {
      box-shadow: 0 8px 32px #0003, 0 2px 1px #b6d0f7;
      transform: translateY(-2px) scale(1.012);
    }
    .blog-entry .block-20, .blog-entry img {
      border-radius: 18px 18px 0 0;
      min-height: 180px;
      max-height: 240px;
      object-fit: cover;
      width: 100%;
      display: block;
      background: #e3eaf3;
    }
    .blog-entry .category {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .category-pill {
      background: linear-gradient(90deg, #22e8fd 0%, #ffb7c6 100%);
  padding: 2px 7px;
  font-size: 0.5em;
  font-weight: 500;
  color: #fff;
  margin: 0 2px 2px 0;
  display: inline-block;
  opacity: 0;
  transform: translateY(10px);
  animation: pill-fade-in 0.7s cubic-bezier(.4,1.4,.6,1) forwards;
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  user-select: none;
    }
    .category-pill:hover {
      background: linear-gradient(90deg, #d0e6ff 0%, #eaf3fa 100%);
      box-shadow: 0 4px 16px #0002, 0 2px 1px #b6d0f7;
      color: #1a2330;
    }
    @keyframes card-fade-in {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes pill-fade-in {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .blog-entry .meta {
      font-size: 0.97em;
      color: #7a8ca3;
      margin-bottom: 0.5rem;
    }
    .blog-entry .meta a {
      color: #7a8ca3;
      text-decoration: none;
      transition: color 0.2s;
    }
    .blog-entry .meta a:hover {
      color: #2d3a4a;
    }
    .blog-entry .desc {
      padding-left: 1rem;
      flex: 1 1 0%;
    }
    .blog-entry .heading a {
      color: #1a2330;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .blog-entry .heading a:hover {
      color: #3a7bd5;
    }
    .blog-entry .meta-chat {
      color: #3a7bd5;
      font-weight: 500;
      margin-left: 4px;
    }
  `;
    document.head.appendChild(style);
})();

// Fonction principale
async function loadRecentBlogPosts() {
    try {
        // Conformément à Blog.js, on utilise POST avec body JSON pour search-body
        const criterias = [
            { siteName: 'demo-1', userEmail: 'jasongachaba1@gmail.com' },
            { siteName: 'demo-2', userEmail: 'raisgachaba@gmail.com' },
            { siteName: 'demo-3', userEmail: 'smvldng@gmail.com' },
            { siteName: 'demo-4', userEmail: 'mushagalusamurhulaines@gmail.com' }
        ];
        const res = await fetch(`${API_URL}/posts/search-body`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ criterias })
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération des articles');
        const posts = await res.json();
        if (!Array.isArray(posts)) return;
        const recentPosts = posts.slice(0, 3);
        const html = recentPosts.map(post => {
            let imageUrl = 'images/image_1.jpg';
            let imageHtml = '';
            if (post.media && Array.isArray(post.media) && post.media[0]) {
                const media = post.media[0];
                if (media.type && media.type.startsWith('image') && media.url) {
                    imageUrl = media.url;
                    imageHtml = `<img src="http://localhost:5000${imageUrl}" alt="image du post" class="img-fluid" style="width:100%;height:220px;object-fit:cover;border-radius:0.25rem 0.25rem 0 0;" />`;
                }
            }
            if (!imageHtml) {
                // fallback: background-image style
                imageHtml = `<div class="block-20" style="background-image: url('${imageUrl}');height:220px;"></div>`;
            }
            const username = (post.user && post.user.username) || 'Admin';
            const title = post.title || 'Sans titre';
            const content = truncateWords(post.content, 20);
            const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '';
            const commentsCount = post.commentsCount || 0;
            const id = post.id || post._id || '';
            return `
        <div class="col-md-4 ftco-animate">
          <div class="blog-entry">
            <a href="blog-single.html?id=${id}">
              ${imageHtml}
            </a>
            <ul class="category" style="display:flex;flex-wrap:wrap;gap:6px 6px;margin:6px 5px 0px 5px;padding:0;list-style:none; align-items:center">
              ${post.categories && post.categories.map(cat => `<li class=\"category-pill\"><a href=\"#\" style=\"color:inherit;text-decoration:none;\">${cat.name}</a></li>`).join('')}     
            </ul>
            <div class="text d-flex py-4">
            
              <div class="meta mb-3">
                <div><a href="#">${createdAt}</a></div>
                <div> Par : <a href="#">${username}</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> ${commentsCount}</a></div>
              </div>
              <div class="desc pl-3">
                <h3 class="heading"><a href="blog-single.html?id=${id}">${title}</a></h3>
                <p>${content}</p>
              </div>
            </div>
          </div>
        </div>
      `;
        }).join('');
        // Remplacement du contenu
        if (blogSection) {
            blogSection.innerHTML = html;
            // Relance les animations sur les nouveaux éléments dynamiques
            setTimeout(function () {
                if (typeof contentWayPoint === 'function') contentWayPoint();
                if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') AOS.refresh();
            }, 100);
        }
    } catch (err) {
        if (blogSection) {
            blogSection.innerHTML = '<div class="col-12 text-center text-danger">Impossible de charger les articles du blog.</div>';
        }
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', loadRecentBlogPosts);
