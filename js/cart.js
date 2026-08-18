/* ============================================================
   CAMPORA — cart & checkout logic
   ============================================================ */

let campSelectedMomo = "MTN MoMo";

if (typeof window.PAYSTACK_PUBLIC_KEY === "undefined") {
  throw new Error('PAYSTACK_PUBLIC_KEY is not defined. Run "powershell -File build-config.ps1" to generate js/config.js from .env');
}
const PAYSTACK_PUBLIC_KEY = window.PAYSTACK_PUBLIC_KEY;

function campCartThumb(category) {
  const bg = { textbooks: "linear-gradient(150deg,#fdece0,#e6b291)", calculators: "linear-gradient(150deg,#f3e3da,#67534F)", bags: "linear-gradient(150deg,#ffe3cc,#FF954F)", supplies: "linear-gradient(150deg,#f0e6df,#532418)" };
  const fg = { textbooks: "#532418", calculators: "#fff", bags: "#fff", supplies: "#FFFFF4" };
  const key = ["textbooks", "calculators", "bags", "supplies"].includes(category) ? category : "supplies";
  return `<div class="cart-thumb" style="background:${bg[key]}; color:${fg[key]};">${campSvg(key)}</div>`;
}

function campRenderCart() {
  const cart = campGetCart();
  const wrap = document.getElementById("cart-wrap");
  const heading = document.getElementById("cart-heading");

  if (!cart.length) {
    heading.textContent = "Your cart is empty";
    wrap.innerHTML = `
      <div class="empty-state" style="padding:80px 20px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21.5 8H6.1"/></svg>
        <p>Nothing here yet. Browse the marketplace or build a Back-to-School package to get started.</p>
        <div style="display:flex; gap:12px; justify-content:center; margin-top:20px; flex-wrap:wrap;">
          <a href="marketplace.html" class="btn btn-primary">Browse marketplace</a>
          <a href="packages.html" class="btn btn-outline">Build a package</a>
        </div>
      </div>`;
    return;
  }

  heading.textContent = "Your cart";
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = 10;
  const total = subtotal + deliveryFee;

  wrap.innerHTML = `
    <div class="cart-layout">
      <div class="card" id="cart-items"></div>
      <div class="card" id="checkout-panel">
        <span class="eyebrow-sm">Checkout</span>
        <h3 style="font-family:var(--font-display); font-size:1.3rem; color:var(--brown-ink); margin-bottom:18px;">Delivery & payment</h3>
        <form id="checkout-form">
         <div class="field">
           <label for="co-name">Full name</label>
           <input type="text" id="co-name" placeholder="e.g. Ama Serwaa" required>
         </div>
         <div class="field">
           <label for="co-email">Email address</label>
            <input type="email" id="co-email" placeholder="e.g. ama@email.com" required>
         </div>
          <div class="field">
            <label for="co-phone">Phone number</label>
            <input type="tel" id="co-phone" placeholder="0XX XXX XXXX" pattern="[0-9 ]{9,15}" required>
          </div>
          <div class="field">
            <label for="co-location">Delivery location</label>
            <select id="co-location" required></select>
          </div>
          <div class="field">
            <label>Pay with Mobile Money</label>
            <div class="momo-options" id="momo-options">
              <div class="momo-opt selected" data-momo="MTN MoMo">MTN MoMo</div>
              <div class="momo-opt" data-momo="Vodafone Cash">Vodafone Cash</div>
              <div class="momo-opt" data-momo="AirtelTigo Money">AirtelTigo Money</div>
            </div>
          </div>
          <div class="field">
            <label for="co-momo-number">Mobile Money number</label>
            <input type="tel" id="co-momo-number" placeholder="0XX XXX XXXX" pattern="[0-9 ]{9,15}" required>
          </div>
          <div class="summary-row"><span>Subtotal</span><span>${campFormatGHS(subtotal)}</span></div>
          <div class="summary-row"><span>Delivery fee</span><span>${campFormatGHS(deliveryFee)}</span></div>
          <div class="summary-total" style="color:var(--brown-ink); border-top-color:var(--line);"><span>Total</span><span>${campFormatGHS(total)}</span></div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-top:20px;">Pay ${campFormatGHS(total)}</button>
        </form>
      </div>
    </div>`;

  document.getElementById("cart-items").innerHTML = cart.map(item => `
    <div class="cart-row" data-id="${item.id}">
      ${campCartThumb(item.category)}
      <div>
        <div class="cart-name">${item.name}</div>
        <div class="cart-cat">${item.category}</div>
        <button class="remove-link" data-remove="${item.id}">Remove</button>
      </div>
      <div class="cart-qty">
        <button class="icon-btn" data-dec="${item.id}" aria-label="Decrease quantity">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>
        </button>
        <span>${item.qty}</span>
        <button class="icon-btn" data-inc="${item.id}" aria-label="Increase quantity">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <span class="product-price">${campFormatGHS(item.price * item.qty)}</span>
    </div>`).join("");

  document.getElementById("co-location").innerHTML = CAMPORA_LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join("");

  document.getElementById("cart-items").addEventListener("click", campHandleCartClick);

  document.querySelectorAll(".momo-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".momo-opt").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      campSelectedMomo = opt.dataset.momo;
    });
  });

  document.getElementById("checkout-form").addEventListener("submit", campHandleCheckout);
}

function campHandleCartClick(e){
  const cart = campGetCart();
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rem = e.target.closest("[data-remove]");

  if (inc) {
    const item = cart.find(c => c.id === inc.dataset.inc);
    if (item) item.qty += 1;
  } else if (dec) {
    const item = cart.find(c => c.id === dec.dataset.dec);
    if (item) { item.qty -= 1; if (item.qty <= 0) { campSaveCart(cart.filter(c => c.id !== item.id)); campRenderCart(); return; } }
  } else if (rem) {
    campSaveCart(cart.filter(c => c.id !== rem.dataset.remove));
    campRenderCart();
    return;
  } else {
    return;
  }
  campSaveCart(cart);
  campRenderCart();
}

function campHandleCheckout(e){
  e.preventDefault();

  const cart = campGetCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = 10;
  const total = subtotal + deliveryFee;
  const email = document.getElementById("co-email").value.trim();
  const orderId = "CO-" + Math.floor(100000 + Math.random() * 899999);

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: Math.round(total * 100), // Paystack needs the amount in pesewas (GHS x 100)
    currency: "GHS",
    ref: orderId,
    metadata: {
      custom_fields: [
        { display_name: "Customer Name", variable_name: "customer_name", value: document.getElementById("co-name").value.trim() },
        { display_name: "Delivery Location", variable_name: "delivery_location", value: document.getElementById("co-location").value }
      ]
    },
    callback: function(response){
      // Payment succeeded — response.reference confirms the transaction
      campCompleteOrder(orderId, total, response.reference);
    },
    onClose: function(){
      campToast("Payment cancelled");
    }
  });

  handler.openIframe();
}

function campCompleteOrder(orderId, total, paystackRef){
  const orders = JSON.parse(localStorage.getItem(CAMPORA_KEYS.orders) || "[]");
  orders.push({
    id: orderId,
    total,
    momo: campSelectedMomo,
    location: document.getElementById("co-location").value,
    paystackRef: paystackRef,
    date: new Date().toISOString(),
    items: campGetCart().length
  });
  localStorage.setItem(CAMPORA_KEYS.orders, JSON.stringify(orders));
  campSaveCart([]);

  const wrap = document.getElementById("cart-wrap");
  document.getElementById("cart-heading").textContent = "Order confirmed";
  wrap.innerHTML = `
    <div class="card confirm-panel">
      <div class="confirm-icon">${CAMP_CHECK_SVG}</div>
      <h2>Payment successful</h2>
      <p class="muted" style="margin-top:10px; max-width:44ch; margin-left:auto; margin-right:auto;">
        Your payment of ${campFormatGHS(total)} was confirmed by Paystack.
        We'll notify the seller once your order is processed.
      </p>
      <div class="order-id">Order ${orderId}</div>
      <div style="display:flex; gap:12px; justify-content:center; margin-top:26px; flex-wrap:wrap;">
        <a href="marketplace.html" class="btn btn-primary">Continue shopping</a>
        <a href="index.html" class="btn btn-outline">Back to home</a>
      </div>
    </div>`;
}


document.addEventListener("DOMContentLoaded", campRenderCart);
