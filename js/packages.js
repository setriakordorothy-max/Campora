/* ============================================================
   CAMPORA — Back-to-School Builder
   ============================================================ */

const campBuilder = {
  level: null,      // "jhs" | "shs"
  program: null,    // key into CAMPORA_PACKAGES.shs.programs
  items: []         // [{ name, price, included }]
};

const CAMP_LEVEL_META = {
  jhs: { label: "JHS", full: "Junior High School", desc: "Form 1 to Form 3 essentials" },
  shs: { label: "SHS", full: "Senior High School", desc: "Programme-specific package" }
};

const CAMP_PROGRAM_ICONS = {
  science: `<path d="M9 3h6M10 3v5l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.5L14 8V3"/><path d="M8 15h8"/>`,
  business: `<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>`,
  general_arts: `<path d="M12 3v18M4 8h4M4 16h4M16 8h4M16 16h4"/>`,
  visual_arts: `<circle cx="12" cy="12" r="9"/><path d="M12 3a4 4 0 0 0 0 8 4 4 0 0 1 0 8 9 9 0 1 1 0-16Z"/>`,
  home_economics: `<path d="M4 21V9l8-6 8 6v12"/><path d="M9 21v-7h6v7"/>`,
  hygiene_supplies: `<path d="M3 3h18v18H3V3Z"/><path d="M7 7h10v10H7V7Z"/>`
};

function campStepTrackHTML() {
  const steps = campBuilder.level === "jhs"
    ? [{ n: 1, label: "Level" }, { n: 3, label: "Package" }]
    : [{ n: 1, label: "Level" }, { n: 2, label: "Programme" }, { n: 3, label: "Package" }];

  return steps.map((s, i) => {
    let cls = "step-dot";
    if (s.n === campCurrentStep()) cls += " active";
    else if (s.n < campCurrentStep()) cls += " done";
    const sep = i < steps.length - 1 ? `<div class="step-sep"></div>` : "";
    return `<div class="${cls}">${s.n < campCurrentStep() ? CAMP_CHECK_SVG : `<span>${i + 1}</span>`} ${s.label}</div>${sep}`;
  }).join("");
}

function campCurrentStep() {
  if (!campBuilder.level) return 1;
  if (campBuilder.level === "shs" && !campBuilder.program) return 2;
  return 3;
}

function campRenderBuilder() {
  document.getElementById("step-track").innerHTML = campStepTrackHTML();
  const step = campCurrentStep();
  const content = document.getElementById("builder-content");

  if (step === 1) {
    content.innerHTML = `
      <div class="choice-grid">
        ${Object.entries(CAMP_LEVEL_META).map(([key, m]) => `
          <button class="choice-card level-choice" data-level="${key}">
            <div class="choice-icon">${campSvg(key === "jhs" ? "supplies" : "textbooks")}</div>
            <h4>${m.label} — ${m.full}</h4>
            <span>${m.desc}</span>
          </button>`).join("")}
      </div>`;
    content.querySelectorAll(".level-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        campBuilder.level = btn.dataset.level;
        campBuilder.program = null;
        if (campBuilder.level === "jhs") campBuildPackageItems();
        campRenderBuilder();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    return;
  }

  if (step === 2) {
    const programs = CAMPORA_PACKAGES.shs.programs;
    content.innerHTML = `
      <div class="choice-grid">
        ${Object.entries(programs).map(([key, p]) => `
          <button class="choice-card program-choice" data-program="${key}">
            <div class="choice-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${CAMP_PROGRAM_ICONS[key]}</svg></div>
            <h4>${p.label}</h4>
            <span>${p.items.length} recommended items</span>
          </button>`).join("")}
      </div>
      <button class="btn btn-ghost btn-sm" id="back-to-level" style="margin-top:24px;">Back to level</button>`;
    content.querySelectorAll(".program-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        campBuilder.program = btn.dataset.program;
        campBuildPackageItems();
        campRenderBuilder();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    content.querySelector("#back-to-level").addEventListener("click", () => {
      campBuilder.level = null;
      campRenderBuilder();
    });
    return;
  }

  // step 3 — package review
  const label = campBuilder.level === "jhs"
    ? CAMPORA_PACKAGES.jhs.label
    : `SHS — ${CAMPORA_PACKAGES.shs.programs[campBuilder.program].label}`;

  const included = campBuilder.items.filter(i => i.included);
  const total = included.reduce((s, i) => s + i.price, 0);

  content.innerHTML = `
    <div class="builder-layout">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div>
            <span class="eyebrow-sm">Recommended package</span>
            <h3 style="font-family:var(--font-display); font-size:1.3rem; color:var(--brown-ink);">${label}</h3>
          </div>
          <button class="btn btn-ghost btn-sm" id="back-step">Change selection</button>
        </div>
        <div id="pkg-list"></div>
      </div>
      <div class="summary-card">
        <h4>Package summary</h4>
        <div class="summary-row"><span>Items included</span><span>${included.length} of ${campBuilder.items.length}</span></div>
        <div class="summary-row"><span>Level</span><span>${label}</span></div>
        <div class="summary-total"><span>Total</span><span>${campFormatGHS(total)}</span></div>
        <button class="btn btn-primary btn-block" id="add-package-cart" style="margin-top:20px;">Add package to cart</button>
        <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:10px; border-color:rgba(255,255,244,0.4); color:var(--cream);">Go to cart</a>
      </div>
    </div>`;

  campRenderPkgList();

  content.querySelector("#back-step").addEventListener("click", () => {
    if (campBuilder.level === "jhs") { campBuilder.level = null; }
    else { campBuilder.program = null; }
    campRenderBuilder();
  });

  content.querySelector("#add-package-cart").addEventListener("click", () => {
    const cart = campGetCart();
    campBuilder.items.filter(i => i.included).forEach(item => {
      const cartId = "PKG-" + item.name.replace(/\s+/g, "-").slice(0, 24);
      const existing = cart.find(c => c.id === cartId);
      if (existing) existing.qty += 1;
      else cart.push({ id: cartId, name: item.name, price: item.price, category: "package item", type: "package", qty: 1 });
    });
    campSaveCart(cart);
    campToast(`${included.length} items added to your cart`);
  });
}

function campRenderPkgList() {
  const list = document.getElementById("pkg-list");
  list.innerHTML = campBuilder.items.map((item, idx) => `
    <div class="pkg-item-row">
      <div class="pkg-item-info">
        <div class="icon-btn" style="cursor:pointer;" data-toggle="${idx}">
          ${item.included ? CAMP_CHECK_SVG : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`}
        </div>
        <div>
          <div class="pkg-item-name" style="${item.included ? "" : "opacity:.45; text-decoration:line-through;"}">${item.name}</div>
          <div class="pkg-item-price">${campFormatGHS(item.price)}</div>
        </div>
      </div>
      <span class="chip">${item.included ? "Included" : "Removed"}</span>
    </div>`).join("");

  list.querySelectorAll("[data-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.toggle);
      campBuilder.items[idx].included = !campBuilder.items[idx].included;
      campRenderBuilder();
    });
  });
}

function campBuildPackageItems() {
  const source = campBuilder.level === "jhs"
    ? CAMPORA_PACKAGES.jhs.items
    : CAMPORA_PACKAGES.shs.programs[campBuilder.program].items;
  campBuilder.items = source.map(i => ({ ...i, included: true }));
}

document.addEventListener("DOMContentLoaded", campRenderBuilder);
