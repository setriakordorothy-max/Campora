/* ============================================================
   CAMPORA — marketplace page logic
   ============================================================ */

const campParams = new URLSearchParams(window.location.search);
let campActiveCategories = campParams.get("category") ? [campParams.get("category")] : [];

function campMarketCardHTML(p){
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-visual ${p.category}">
      ${p.verified ? `<span class="verified-badge">${CAMP_CHECK_SVG}Verified</span>` : ""}
      <span class="cond-badge cond-${p.condition}">${p.condition}</span>
      ${campSvg(p.category)}
      ${p.image ? `<img class="product-photo" src="images/products/${p.image}" alt="${p.name}" loading="lazy" onerror="this.remove()">` : ""}
    </div>
    <div class="product-body">
      <span class="product-cat">${p.category}</span>
      <span class="product-name">${p.name}</span>
      <span class="product-meta">${CAMP_PIN_SVG}${p.location}</span>
      <div class="product-foot">
        <span class="product-price">${campFormatGHS(p.price)}</span>
        <button class="btn btn-primary btn-sm add-cart-btn" data-id="${p.id}">Add</button>
      </div>
    </div>
  </div>`;
}

function campRenderCategoryFilters(){
  const wrap = document.getElementById("filter-categories");
  wrap.innerHTML = CAMP_CATS.map(c => `
    <label class="filter-option">
      <input type="checkbox" name="category" value="${c.key}" ${campActiveCategories.includes(c.key) ? "checked" : ""}>
      ${c.label}
    </label>`).join("");
}

function campReadFilters(){
  const categories = [...document.querySelectorAll('input[name="category"]:checked')].map(i => i.value);
  const conditions = [...document.querySelectorAll('input[name="condition"]:checked')].map(i => i.value);
  const maxPrice = document.getElementById("max-price").value;
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const sort = document.getElementById("sort-select").value;
  return { categories, conditions, maxPrice: maxPrice ? Number(maxPrice) : null, query, sort };
}

function campRenderMarket(){
  const { categories, conditions, maxPrice, query, sort } = campReadFilters();
  let items = campGetProducts().filter(p => p.status === "approved");

  if (categories.length) items = items.filter(p => categories.includes(p.category));
  if (conditions.length) items = items.filter(p => conditions.includes(p.condition));
  if (maxPrice !== null && !isNaN(maxPrice)) items = items.filter(p => p.price <= maxPrice);
  if (query) items = items.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.location.toLowerCase().includes(query)
  );

  if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
  else items.sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));

  const grid = document.getElementById("market-grid");
  const empty = document.getElementById("empty-state");
  const count = document.getElementById("result-count");

  count.textContent = `${items.length} item${items.length === 1 ? "" : "s"} found`;

  if (!items.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    grid.innerHTML = items.map(campMarketCardHTML).join("");
  }
}

function campInitLocationSelect(){
  const sel = document.getElementById("s-location");
  sel.innerHTML = CAMPORA_LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  campRenderCategoryFilters();
  campInitLocationSelect();
  campRenderMarket();

  document.querySelectorAll('input[name="category"], input[name="condition"]').forEach(el =>
    el.addEventListener("change", campRenderMarket)
  );
  document.getElementById("max-price").addEventListener("input", campRenderMarket);
  document.getElementById("search-input").addEventListener("input", campRenderMarket);
  document.getElementById("sort-select").addEventListener("change", campRenderMarket);

  document.getElementById("clear-filters").addEventListener("click", () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    document.getElementById("max-price").value = "";
    document.getElementById("search-input").value = "";
    document.getElementById("sort-select").value = "newest";
    campRenderMarket();
  });

  // add to cart (event delegation)
  document.getElementById("market-grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-cart-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    const product = campGetProducts().find(p => p.id === id);
    if (!product) return;
    campAddToCart({ id: product.id, name: product.name, price: product.price, category: product.category, type: "product" });
    campToast(`${product.name} added to cart`);
  });

  // sell modal
  const modal = document.getElementById("sell-modal");
  document.getElementById("open-sell").addEventListener("click", () => { modal.style.display = "flex"; });
  document.getElementById("close-sell").addEventListener("click", () => { modal.style.display = "none"; });
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  const uploadBox = document.getElementById("upload-box");
  const thumbRow = document.getElementById("thumb-row");
  let thumbCount = 0;
  uploadBox.addEventListener("click", () => {
    if (thumbCount >= 4) { campToast("Up to 4 photos in this demo"); return; }
    thumbCount++;
    const t = document.createElement("div");
    t.className = "thumb";
    t.textContent = "IMG " + thumbCount;
    thumbRow.appendChild(t);
  });

  document.getElementById("sell-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const products = campGetProducts();
    const newId = "CMP" + String(2000 + products.length);
    const newProduct = {
      id: newId,
      name: document.getElementById("s-name").value.trim(),
      category: document.getElementById("s-category").value,
      price: Number(document.getElementById("s-price").value),
      condition: document.getElementById("s-condition").value,
      description: document.getElementById("s-desc").value.trim(),
      location: document.getElementById("s-location").value,
      seller: "You",
      status: "pending",
      verified: false,
      dateSubmitted: new Date().toISOString()
    };
    products.unshift(newProduct);
    campSaveProducts(products);
    modal.style.display = "none";
    e.target.reset();
    thumbRow.innerHTML = "";
    thumbCount = 0;
    campToast("Submitted. Your item is pending admin review.");
  });
});
