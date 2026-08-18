/* ============================================================
   CAMPORA — admin dashboard logic
   Demo-only auth: fixed credentials, session flag in sessionStorage.
   ============================================================ */

const CAMP_ADMIN_USER = "admin";
const CAMP_ADMIN_PASS = "campora2026";
const CAMP_ADMIN_SESSION_KEY = "campora_admin_session";

function campShowDashboard(){
  document.getElementById("login-shell").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
  campRenderOverview();
  campRenderPending();
  campRenderListings();
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem(CAMP_ADMIN_SESSION_KEY) === "1") {
    campShowDashboard();
  }

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("admin-user").value.trim();
    const pass = document.getElementById("admin-pass").value;
    if (user === CAMP_ADMIN_USER && pass === CAMP_ADMIN_PASS) {
      sessionStorage.setItem(CAMP_ADMIN_SESSION_KEY, "1");
      campShowDashboard();
    } else {
      campToast("Incorrect username or password");
    }
  });

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    sessionStorage.removeItem(CAMP_ADMIN_SESSION_KEY);
    location.reload();
  });

  document.getElementById("admin-nav").addEventListener("click", (e) => {
    const link = e.target.closest("a[data-tab]");
    if (!link) return;
    e.preventDefault();
    document.querySelectorAll("#admin-nav a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");
    ["overview", "pending", "listings"].forEach(tab => {
      document.getElementById("tab-" + tab).style.display = tab === link.dataset.tab ? "block" : "none";
    });
    document.getElementById("admin-page-title").textContent =
      link.dataset.tab === "overview" ? "Overview" : link.dataset.tab === "pending" ? "Pending review" : "All listings";
  });

  document.getElementById("listings-filter")?.addEventListener("change", campRenderListings);
});

function campRenderOverview(){
  const products = campGetProducts();
  const approved = products.filter(p => p.status === "approved");
  const pending = products.filter(p => p.status === "pending");
  const orders = JSON.parse(localStorage.getItem(CAMPORA_KEYS.orders) || "[]");
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { lbl: "Total listings", val: products.length, delta: `${approved.length} live` },
    { lbl: "Pending review", val: pending.length, delta: pending.length ? "Needs attention" : "All clear" },
    { lbl: "Verified items", val: approved.filter(p => p.verified).length, delta: "Carrying the badge" },
    { lbl: "Orders placed", val: orders.length, delta: campFormatGHS(revenue) + " total" }
  ];

  document.getElementById("stat-grid").innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="lbl">${s.lbl}</div>
      <div class="val">${s.val}</div>
      <div class="delta">${s.delta}</div>
    </div>`).join("");

  const maxCount = Math.max(...CAMP_CATS.map(c => approved.filter(p => p.category === c.key).length), 1);
  document.getElementById("category-bars").innerHTML = CAMP_CATS.map(c => {
    const count = approved.filter(p => p.category === c.key).length;
    const pct = Math.round((count / maxCount) * 100);
    return `
    <div class="bar-row">
      <span class="bar-label">${c.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="bar-val">${count}</span>
    </div>`;
  }).join("");

  const ordersBody = document.getElementById("orders-body");
  if (!orders.length) {
    ordersBody.innerHTML = `<tr><td colspan="5" class="muted">No orders placed yet.</td></tr>`;
  } else {
    ordersBody.innerHTML = orders.slice().reverse().slice(0, 8).map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${o.items}</td>
        <td>${o.momo}</td>
        <td>${o.location.split(",")[0]}</td>
        <td>${campFormatGHS(o.total)}</td>
      </tr>`).join("");
  }
}

function campRenderPending(){
  const pending = campGetProducts().filter(p => p.status === "pending");
  const body = document.getElementById("pending-body");
  if (!pending.length) {
    body.innerHTML = `<tr><td colspan="7" class="muted" style="padding:26px 18px;">No items waiting for review right now.</td></tr>`;
    return;
  }
  body.innerHTML = pending.map(p => `
    <tr data-id="${p.id}">
      <td>${p.name}</td>
      <td style="text-transform:capitalize;">${p.category}</td>
      <td>${campFormatGHS(p.price)}</td>
      <td>${p.condition}</td>
      <td>${p.seller}</td>
      <td>${p.location.split(",")[0]}</td>
      <td class="row-actions">
        <button class="btn btn-primary btn-sm" data-approve="${p.id}">Approve</button>
        <button class="btn btn-ghost btn-sm" data-reject="${p.id}">Reject</button>
      </td>
    </tr>`).join("");

  body.querySelectorAll("[data-approve]").forEach(btn => btn.addEventListener("click", () => campSetStatus(btn.dataset.approve, "approved")));
  body.querySelectorAll("[data-reject]").forEach(btn => btn.addEventListener("click", () => campSetStatus(btn.dataset.reject, "rejected")));
}

function campSetStatus(id, status){
  const products = campGetProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;
  product.status = status;
  product.verified = status === "approved";
  campSaveProducts(products);
  campToast(status === "approved" ? `${product.name} approved and verified` : `${product.name} rejected`);
  campRenderOverview();
  campRenderPending();
  campRenderListings();
}

function campRenderListings(){
  const filter = document.getElementById("listings-filter")?.value || "all";
  let products = campGetProducts();
  if (filter !== "all") products = products.filter(p => p.status === filter);
  products = products.slice().sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));

  document.getElementById("listings-count").textContent = `${products.length} listing${products.length === 1 ? "" : "s"}`;
  document.getElementById("listings-body").innerHTML = products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td style="text-transform:capitalize;">${p.category}</td>
      <td>${campFormatGHS(p.price)}</td>
      <td>${p.condition}</td>
      <td><span class="status-pill status-${p.status}">${p.status}</span></td>
      <td>${p.location.split(",")[0]}</td>
    </tr>`).join("");
}
