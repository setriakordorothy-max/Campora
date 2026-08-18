/* ============================================================
   CAMPORA — shared behaviour across all pages
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  campUpdateCartBadge();

  // mobile nav toggle
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      const isOpen = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  }

  // scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }
});

/* ---------- shared render helpers ---------- */
const CAMP_CATS = [
  { key: "textbooks", label: "Textbooks", desc: "JHS & SHS course texts" },
  { key: "calculators", label: "Calculators", desc: "WAEC-approved scientific" },
  { key: "bags", label: "Bags", desc: "Backpacks & satchels" },
  { key: "supplies", label: "Supplies", desc: "Sets, uniforms & more" },
  { key: "clothing", label: "Clothing", desc: "Uniforms & casual wear" },
  { key: "electronics", label: "Electronics", desc: "Devices & accessories" },
  { key: "stationery", label: "Stationery", desc: "Pens, pencils & more" }
];

const CAMP_CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>`;
const CAMP_PIN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

function campProductCardHTML(p) {
  return `
  <a href="marketplace.html?category=${p.category}" class="product-card" data-id="${p.id}">
    <div class="product-visual ${p.category}">
      ${p.verified ? `<span class="verified-badge">${CAMP_CHECK_SVG}Verified</span>` : ""}
      <span class="cond-badge cond-${p.condition}">${p.condition}</span>
      ${campSvg(p.category)}
      ${p.image ? `<img class="product-photo" src="images/products/${p.image}" alt="${p.name}" loading="lazy" onerror="this.remove()">` : ""}
    </div>
    <div class="product-body">
      <span class="product-cat">${p.category}</span>
      <span class="product-name">${p.name}</span>
      <span class="product-meta">${CAMP_PIN_SVG}${p.location.split(",")[0]}</span>
      <div class="product-foot">
        <span class="product-price">${campFormatGHS(p.price)}</span>
      </div>
    </div>
  </a>`;
}

function campToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}
