// Dynamically include nav.html and footer.html into all pages
function includeHTML(selector, url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    });
}

document.addEventListener("DOMContentLoaded", function() {
  // Insert containers if not present
  if (!document.querySelector("#nav-include")) {
    const navDiv = document.createElement("div");
    navDiv.id = "nav-include";
    document.body.insertBefore(navDiv, document.body.firstChild);
  }
  if (!document.querySelector("#footer-include")) {
    const footerDiv = document.createElement("div");
    footerDiv.id = "footer-include";
    document.body.appendChild(footerDiv);
  }
  includeHTML("#nav-include", "nav.html");
  includeHTML("#footer-include", "footer.html");
});
