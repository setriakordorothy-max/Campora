/* ============================================================
   CAMPORA — seed data & storage layer
   All data lives in localStorage so the whole MVP works
   without a backend. This file seeds it on first load.
   ============================================================ */

const CAMPORA_KEYS = {
  products: "campora_products",
  cart: "campora_cart",
  orders: "campora_orders",
  seeded: "campora_seeded_v3"
};

/* ---------- Category icon paths (inline SVG, stroke-based) ---------- */
const CAMPORA_ICONS = {
  textbooks: `<path d="M4 5.5C4 4.67 4.67 4 5.5 4H16v18H5.5A1.5 1.5 0 0 1 4 20.5v-15Z"/><path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5v15a1.5 1.5 0 0 1-1.5 1.5H16"/><path d="M7 9h6M7 13h6"/>`,
  calculators: `<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M8.5 7h7"/><circle cx="8.7" cy="11.2" r=".9"/><circle cx="12" cy="11.2" r=".9"/><circle cx="15.3" cy="11.2" r=".9"/><circle cx="8.7" cy="14.6" r=".9"/><circle cx="12" cy="14.6" r=".9"/><circle cx="15.3" cy="14.6" r=".9"/><path d="M8.3 18h7.4"/>`,
  bags: `<path d="M8 8V6a4 4 0 0 1 8 0v2"/><rect x="4.5" y="8" width="15" height="13" rx="2.5"/><path d="M4.5 13h15"/>`,
  supplies: `<path d="M12 3 4 7v3c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V7l-8-4Z"/><path d="M9 12.3l2 2 4-4.3"/>`,
  clothing: `<path d="M12 3c-1.5 0-2.7.8-3.4 2H6a2 2 0 0 0-2 2v3c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V7a2 2 0 0 0-2-2h-2.6c-.7-1.2-1.9-2-3.4-2Z"/><path d="M12 3v7"/>`,
  electronics: `<path d="M4 7h16v10H4z"/><path d="M8 21h8"/><path d="M12 17v4"/>`,
  stationery: `<path d="M4 21h16"/><path d="M4 4h16v17H4z"/><path d="M8 4v17"/><path d="M12 4v17"/><path d="M16 4v17"/>`
};

function campSvg(cat) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${CAMPORA_ICONS[cat] || CAMPORA_ICONS.supplies}</svg>`;
}

/* ---------- Locations ---------- */
const CAMPORA_LOCATIONS = [
  "Accra, Greater Accra", "Legon, Greater Accra", "Madina, Greater Accra",
  "Tema, Greater Accra", "Kumasi, Ashanti", "Cape Coast, Central",
  "Takoradi, Western", "Tamale, Northern", "Koforidua, Eastern",
  "Sunyani, Bono", "Ho, Volta", "Techiman, Bono East"
];

const CAMPORA_SELLERS = [
  "Abena K.", "Kwame O.", "Efua M.", "Kojo D.", "Ama S.", "Yaw B.",
  "Akosua T.", "Kwabena F.", "Adjoa N.", "Nana Y.", "Esi R.", "Kofi A."
];

/* ---------- Seed products ---------- */
const CAMPORA_SEED_PRODUCTS = [
  // ---- Textbooks ----
  { name: "Integrated Science for SHS (Elective & Core)", img: "integrated-science-for-shs-elective-and-core.jpg", cat: "textbooks", price: 45, cond: "Excellent", desc: "Complete SHS integrated science textbook, latest GES syllabus edition. No missing pages, light shelf wear." },
  { name: "Core Mathematics for Senior High Schools", img: "core-mathematics-for-senior-high-schools.jpg", cat: "textbooks", price: 45, cond: "Good", desc: "Widely used core maths text, some pencil annotations in early chapters, otherwise clean." },
  { name: "Elective Mathematics Complete Course", img: "elective-mathematics-complete-course.jpg", cat: "textbooks", price: 55, cond: "Excellent", desc: "Barely used, hardly any markings. Great for Science and Business students." },
  { name: "English for Senior High Schools (Grammar & Comp.)", img: "english-for-senior-high-schools-grammar-and-comp.jpg", cat: "textbooks", price: 32, cond: "Good", desc: "Covers comprehension, grammar and essay writing. Cover slightly worn." },
  { name: "Social Studies for Senior High Schools", img: "social-studies-for-senior-high-schools.jpg", cat: "textbooks", price: 35, cond: "Fair", desc: "Some highlighter marks throughout but fully legible and complete." },
  { name: "JHS Basic Science Learner's Book", img: "jhs-basic-science-learner-s-book.jpg", cat: "textbooks", price: 40, cond: "Excellent", desc: "For JHS 1-3, matches the common core programme. Like new." },
  { name: "JHS Mathematics Learner's Book", img: "jhs-mathematics-learner-s-book.jpg", cat: "textbooks", price: 65, cond: "Good", desc: "Complete set of exercises, front cover has minor creasing." },
  { name: "Financial Accounting for Senior High Schools", img: "financial-accounting-for-senior-high-schools.jpg", cat: "textbooks", price: 42, cond: "Good", desc: "For Business programme students, ledger examples all intact." },
  { name: "Cost Accounting Simplified for SHS", img: "cost-accounting-simplified-for-shs.jpg", cat: "textbooks", price: 40, cond: "Excellent", desc: "Almost new, used for one term only." },
  { name: "Business Management for Senior High Schools", img: "business-management-for-senior-high-schools.jpg", cat: "textbooks", price: 35, cond: "Fair", desc: "Some pages loose at the spine but all present and readable." },
  { name: "Government for Senior High Schools", img: "government-for-senior-high-schools.jpg", cat: "textbooks", price: 55, cond: "Good", desc: "For General Arts students, minor underlining in ink." },
  { name: "History of Ghana and West Africa", img: "history-of-ghana-and-west-africa.jpg", cat: "textbooks", price: 40, cond: "Excellent", desc: "Covers pre-colonial to post-independence history, unmarked." },
  { name: "Literature in English — Prose & Drama Set Texts", img: "literature-in-english-prose-and-drama-set-texts.jpg", cat: "textbooks", price: 48, cond: "Good", desc: "Includes the current WAEC set text list, light cover wear." },
  { name: "General Knowledge in Art for SHS", img: "general-knowledge-in-art-for-shs.jpg", cat: "textbooks", price: 40, cond: "Excellent", desc: "For Visual Arts students, colour plates all intact." },
  { name: "Picture Making Techniques and Theory", img: "picture-making-techniques-and-theory.jpg", cat: "textbooks", price: 35, cond: "Good", desc: "Practical guide with reference images, some pages dog-eared." },
  { name: "Foods and Nutrition for Senior High Schools", img: "foods-and-nutrition-for-senior-high-schools.jpg", cat: "textbooks", price: 40, cond: "Excellent", desc: "For Home Economics students, recipes and diagrams clean." },
  { name: "Management in Living for SHS", img: "management-in-living-for-shs.jpg", cat: "textbooks", price: 35, cond: "Fair", desc: "Water mark on back cover only, text pages are clean." },
  { name: "Physics for Senior High Schools", img: "physics-for-senior-high-schools.jpg", cat: "textbooks", price: 44, cond: "Good", desc: "Diagrams and formula sheets intact, spine slightly cracked." },
  { name: "Chemistry for Senior High Schools", img: "chemistry-for-senior-high-schools.jpg", cat: "textbooks", price: 44, cond: "Excellent", desc: "Practically unused, bought for a term that was cut short." },
  { name: "Biology for Senior High Schools", img: "biology-for-senior-high-schools.jpg", cat: "textbooks", price: 50, cond: "Good", desc: "Some highlighting on key definitions, otherwise solid copy." },

  // ---- Calculators ----
  { name: "Casio fx-991ES PLUS Scientific Calculator", img: "casio-fx-991es-plus-scientific-calculator.jpg", cat: "calculators", price: 95, cond: "Excellent", desc: "WAEC-approved, natural display, comes with slide cover. Barely used." },
  { name: "Casio fx-82MS Scientific Calculator", img: "casio-fx-82ms-scientific-calculator.jpg", cat: "calculators", price: 60, cond: "Good", desc: "Reliable everyday calculator, buttons all responsive, slight scuff on back." },
  { name: "Casio fx-991EX Classwiz Calculator", img: "casio-fx-991ex-classwiz-calculator.jpg", cat: "calculators", price: 120, cond: "Excellent", desc: "Higher-spec model with QR code result linking, like new condition." },
  { name: "Sharp EL-546 Scientific Calculator", img: "sharp-el-546-scientific-calculator.jpg", cat: "calculators", price: 70, cond: "Fair", desc: "Fully functional, casing has visible scratches from daily use." },
  { name: "Casio fx-82MS (Second Unit)", img: "casio-fx-82ms-second-unit.jpg", cat: "calculators", price: 65, cond: "Good", desc: "Same reliable model, cover included, minor fading on the keys." },
  { name: "Casio fx-991ES PLUS (Second Unit)", img: "casio-fx-991es-plus-second-unit.jpg", cat: "calculators", price: 90, cond: "Good", desc: "Works perfectly, small crack on the edge of the slide cover only." },

  // ---- Bags ----
  { name: "Adidas Classic Backpack", img: "adidas-classic-backpack.jpg", cat: "bags", price: 85, cond: "Excellent", desc: "Roomy laptop compartment, water-resistant base, used for one semester." },
  { name: "Ghana-Made Canvas School Bag", img: "ghana-made-canvas-school-bag.jpg", cat: "bags", price: 95, cond: "Good", desc: "Sturdy canvas bag with reinforced straps, light staining on the base." },
  { name: "Wenger Swiss-Style Backpack", img: "wenger-swiss-style-backpack.jpg", cat: "bags", price: 110, cond: "Excellent", desc: "Padded back panel and multiple compartments, near mint condition." },
  { name: "Puma Everyday Backpack", img: "puma-everyday-backpack.jpg", cat: "bags", price: 75, cond: "Good", desc: "Comfortable straps, small ink mark on the front pocket." },
  { name: "Leather-Look Satchel Bag", img: "leather-look-satchel-bag.jpg", cat: "bags", price: 87, cond: "Good", desc: "Popular with Visual Arts students for carrying sketch pads." },

  // ---- Supplies ----
  { name: "Plastic Chop Box", img: "plastic-chop-box.jpg", cat: "supplies", price: 200, cond: "Excellent", desc: "Nice and sturdy for keeping all provisions." },
  { name: "Cooking Utensil Set for Home Economics", img: "cooking-utensil-set-for-home-economics.jpg", cat: "supplies", price: 250, cond: "Good", desc: "Includes measuring cups, mixing bowl and knife set for practicals." },
  { name: "Black Suitcase", img: "black-suitcase.jpg", cat: "supplies", price: 400, cond: "Good", desc: "Durable suitcase, suitable for travel." },
  { name: "Metal Trunk", img: "metal-trunk.jpg", cat: "supplies", price: 250, cond: "Excellent", desc: "Lightweight and sturdy, ideal for boarding house use." },
  { name: "Set of 2 Plastic Buckets and a Pail", img: "set-of-2-plastic-buckets-and-a-pail.jpg", cat: "supplies", price: 150, cond: "Good", desc: "Perfect for washing and bathing." },
  { name: "Standard Boarding School Trunk Bag", img: "standard-boarding-school-trunk-bag.jpg", cat: "bags", price: 125, cond: "Fair", desc: "A few zip-pull replacements but fully functional, roomy for boarding house use." },
  // ---- Clothing ----
  { name: "Black Flat shoes for Ladies", img: "black-flat-shoes-for-ladies.jpg", cat: "clothing", price: 80, cond: "Good", desc: "Grown out of it after one year, polished and shiny." },
  { name: "Black School Sandals (Size 40)", img: "black-school-sandals-size-40.jpg", cat: "clothing", price: 90, cond: "Good", desc: "Worn for two terms, soles still have good grip." },
  { name: "Dark Brown School Sandals (Size 38)", img: "dark-brown-school-sandals-size-38.jpg", cat: "clothing", price: 100, cond: "Excellent", desc: "Lightly worn, very sturdy." },
  { name: "All white Nike Air Forces (Size 40)", img: "all-white-nike-air-forces-size-40.jpg", cat: "clothing", price: 200, cond: "Good", desc: "Slightly worn, very comfortable and clean." },

  // ---- Electronics ----
  { name: "Electric kettle", img: "electric-kettle.jpg", cat: "electronics", price: 200, cond: "Excellent", desc: "Fast heating, easy to clean." },
  { name: "Reading Lamp (Rechargeable, for Boarding House)", img: "reading-lamp-rechargeable-for-boarding-house.jpg", cat: "electronics", price: 150, cond: "Excellent", desc: "USB-rechargeable, three brightness settings, barely used." },

  // ---- Stationery ----
  { name: "Pencil Case (Compact)", img: "pencil-case-compact.jpg", cat: "stationery", price: 30, cond: "Excellent", desc: "Durable plastic case, fits standard pencils and pens." },
  { name: "Notebook (12 pieces, Ruled, 100 Pages)", img: "notebook-12-pieces-ruled-100-pages.jpg", cat: "stationery", price: 120, cond: "Good", desc: "Standard ruled notebook, good for taking notes." },
  { name: "Nataraj Set of Pencils (12 Pieces)", img: "nataraj-set-of-pencils-12-pieces.jpg", cat: "stationery", price: 30, cond: "Excellent", desc: "Assorted colors, smooth application." },
  { name: "Geometry Set (Complete, Boxed)", img: "geometry-set-complete-boxed.jpg", cat: "stationery", price: 40, cond: "Excellent", desc: "Compass, protractor, set squares and ruler, all pieces present." },
  { name: "HP Exercise Books (Pack of 12)", img: "hp-exercise-books-pack-of-12.jpg", cat: "stationery", price: 60, cond: "Excellent", desc: "Unused pack, standard 80-leaf exercise books." },
  { name: "Scientific Drawing Set for Visual Arts", img: "scientific-drawing-set-for-visual-arts.jpg", cat: "stationery", price: 40, cond: "Good", desc: "Includes T-square, drawing board clips and stencils." },
  { name: "Art Supplies Kit — Poster Colours & Brushes", img: "art-supplies-kit-poster-colours-and-brushes.jpg", cat: "stationery", price: 70, cond: "Fair", desc: "Colours are about 70% full, brushes in good shape." },
  { name: "Mathematical Set + Log Tables Booklet", img: "mathematical-set-log-tables-booklet.jpg", cat: "stationery", price: 25, cond: "Excellent", desc: "Complete set with the standard four-figure table booklet included." },
  { name: "Nataraj Pens (12 Pieces)", img: "nataraj-pens-12-pieces.jpg", cat: "stationery", price: 50, cond: "Good", desc: "High-quality pens, suitable for writing and drawing." }
];

function campSeedDatabase() {
  if (localStorage.getItem(CAMPORA_KEYS.seeded)) return;

  const products = CAMPORA_SEED_PRODUCTS.map((p, i) => {
    const id = "CMP" + String(1000 + i);
    const isPending = i % 9 === 0; // sprinkle a few pending submissions for the admin queue
    const isRejected = i === 4;
    const loc = CAMPORA_LOCATIONS[i % CAMPORA_LOCATIONS.length];
    const seller = CAMPORA_SELLERS[i % CAMPORA_SELLERS.length];
    const daysAgo = (i * 37) % 21;
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString();
    return {
      id,
      name: p.name,
      image: p.img,
      category: p.cat,
      price: p.price,
      condition: p.cond,
      description: p.desc,
      location: loc,
      seller,
      status: isRejected ? "rejected" : (isPending ? "pending" : "approved"),
      verified: !isPending && !isRejected,
      dateSubmitted: date
    };
  });

  localStorage.setItem(CAMPORA_KEYS.products, JSON.stringify(products));
  localStorage.setItem(CAMPORA_KEYS.orders, JSON.stringify([]));
  localStorage.setItem(CAMPORA_KEYS.seeded, "1");
}

function campGetProducts() {
  return JSON.parse(localStorage.getItem(CAMPORA_KEYS.products) || "[]");
}
function campSaveProducts(list) {
  localStorage.setItem(CAMPORA_KEYS.products, JSON.stringify(list));
}
function campGetCart() {
  return JSON.parse(localStorage.getItem(CAMPORA_KEYS.cart) || "[]");
}
function campSaveCart(cart) {
  localStorage.setItem(CAMPORA_KEYS.cart, JSON.stringify(cart));
  campUpdateCartBadge();
}
function campUpdateCartBadge() {
  const cart = campGetCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "inline-flex" : "none";
  });
}
function campAddToCart(item) {
  const cart = campGetCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  campSaveCart(cart);
}
function campFormatGHS(amount) {
  return "GH₵ " + amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- Back-to-School package definitions ---------- */
const CAMPORA_PACKAGES = {
  jhs: {
    label: "JHS (Junior High School)",
    items: [
      { name: "JHS Mathematics Learner's Book", price: 55 },
      { name: "JHS Basic Science Learner's Book", price: 50 },
      { name: "JHS English Learner's Book", price: 50 },
      { name: "JHS Social Studies Learner's Book", price: 40 },
      { name: "HP Exercise Books (Pack of 12)", price: 60 },
      { name: "Mathematical Set (Complete, Boxed)", price: 40 },
      { name: "Ghana-Made Canvas School Bag", price: 100 },
      { name: "Pencil Case", price: 30 },
      { name: "Nataraj Set of Pencils (12 Pieces)", price: 50 },
      { name: "Set of Bic Pens (12 Pieces)", price: 50 },
      { name: "Erasers and Sharpeners(5 Pieces each)", price: 30 }
    ]
  },
  shs: {
    label: "SHS (Senior High School)",
    programs: {
      science: {
        label: "General Science",
        items: [
          { name: "Core Mathematics for Senior High Schools", price: 38 },
          { name: "Elective Mathematics Complete Course", price: 55 },
          { name: "Physics for Senior High Schools", price: 44 },
          { name: "Chemistry for Senior High Schools", price: 44 },
          { name: "Biology for Senior High Schools", price: 41 },
          { name: "Casio fx-991ES PLUS Scientific Calculator", price: 95 },
          { name: "Geometry Set (Complete, Boxed)", price: 15 }
        ]
      },
      business: {
        label: "Business",
        items: [
          { name: "Core Mathematics for Senior High Schools", price: 38 },
          { name: "Financial Accounting for Senior High Schools", price: 42 },
          { name: "Cost Accounting Simplified for SHS", price: 40 },
          { name: "Business Management for Senior High Schools", price: 35 },
          { name: "Casio fx-82MS Scientific Calculator", price: 60 },
          { name: "HP Exercise Books (Pack of 12)", price: 24 }
        ]
      },
      general_arts: {
        label: "General Arts",
        items: [
          { name: "Core Mathematics for Senior High Schools", price: 38 },
          { name: "Government for Senior High Schools", price: 30 },
          { name: "History of Ghana and West Africa", price: 33 },
          { name: "Literature in English — Prose & Drama Set Texts", price: 48 },
          { name: "Social Studies for Senior High Schools", price: 28 },
          { name: "HP Exercise Books (Pack of 12)", price: 24 }
        ]
      },
      visual_arts: {
        label: "Visual Arts",
        items: [
          { name: "General Knowledge in Art for SHS", price: 26 },
          { name: "Picture Making Techniques and Theory", price: 29 },
          { name: "Scientific Drawing Set for Visual Arts", price: 40 },
          { name: "Art Supplies Kit — Poster Colours & Brushes", price: 35 },
          { name: "Leather-Look Satchel Bag", price: 58 }
        ]
      },
      home_economics: {
        label: "Home Economics",
        items: [
          { name: "Foods and Nutrition for Senior High Schools", price: 31 },
          { name: "Management in Living for SHS", price: 27 },
          { name: "Cooking Utensil Set for Home Economics", price: 38 },
          { name: "Core Mathematics for Senior High Schools", price: 38 },
          { name: "HP Exercise Books (Pack of 12)", price: 24 }
        ]
      },
      hygiene_supplies: {
        label: "Hygiene Supplies",
        items: [
          { name: "Toothbrush and Toothpaste Set", price: 15 },
          { name: "Shampoo and Soap Set", price: 50 },
          { name: "Towel (2 Pieces)", price: 100 },
          { name: "Deodorant (Pack of 2)", price: 30 },
          { name: "Sponge", price: 20 },
          { name: "Detergent (500g)", price: 25 }
        ]
      }

    }
  },
}
campSeedDatabase();