<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🏆 Trophy Shop</title>
<style>
:root {
  --bg:#0f0f17; 
  --card:rgba(20,20,30,0.85); 
  --accent:#facc15;
  --accent2:#60a5fa; 
  --accent3:#f87171; 
  --muted:#d1d5db;
  --shadow:0 0 30px rgba(250,204,21,0.6); 
  --radius:16px; 
  --transition:all 0.35s cubic-bezier(.4,0,.2,1);
}

* {
  box-sizing:border-box;
  margin:0;
  padding:0;
}

body {
  font-family:Poppins,system-ui,sans-serif;
  background:linear-gradient(135deg,#000,#111827);
  color:#fff;
  overflow-x:hidden;
  line-height:1.5;
}

/* Header */
header {
  position:sticky;
  top:0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:16px 20px;
  background:rgba(17,17,17,0.85);
  backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(250,204,21,0.3);
  z-index:1000;
}

.header-center {
  flex:1;
  text-align:center;
  font-weight:900;
  font-size:clamp(18px,5vw,28px);
  background:linear-gradient(90deg,var(--accent),var(--accent3),var(--accent2));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:gradientMove 8s infinite alternate;
}

@keyframes gradientMove{
  from{background-position:left;}
  to{background-position:right;}
}

/* Buttons */
.btn {
  border:none;
  border-radius:999px;
  cursor:pointer;
  font-weight:700;
  position:relative;
  overflow:hidden;
  transition:var(--transition);
  padding:8px 16px;
  font-size:14px;
}

.btn::after {
  content:"";
  position:absolute;
  top:0; left:-100%;
  width:200%; height:100%;
  background:rgba(255,255,255,0.2);
  transform:skewX(-20deg);
  transition:0.5s;
}

.btn:hover::after{ left:100%; }

.btn-home{ background:#333; color:#fff; }
.btn-cart{ background:linear-gradient(90deg,var(--accent),#ffe066); color:#000; }
.btn-add{ background:#2563eb; color:#fff; }
.btn-buy{ background:#10b981; color:#fff; }

/* Controls */
.controls {
  display:flex;
  gap:12px;
  margin:16px 0;
  flex-wrap:wrap;
}

.controls input,
.controls select {
  padding:10px;
  border-radius:8px;
  border:none;
  background:#1e1e2f;
  color:#fff;
  flex:1 1 150px;
  outline:none;
  font-size:14px;
}

/* Product Grid */
.grid {
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  gap:16px;
}

.card {
  background:var(--card);
  border-radius:var(--radius);
  overflow:hidden;
  padding:10px;
  transition:var(--transition);
  font-size:14px;
  text-align:center;
  box-shadow:0 0 12px rgba(0,0,0,0.6);
}

.card:hover { transform:translateY(-4px); }

.thumbnail {
  width:100%;
  max-height:160px;
  object-fit:cover;
  border-radius:10px;
}

.price-row {
  display:flex;
  justify-content:center;
  gap:8px;
  align-items:center;
  margin:6px 0;
}

.old {
  text-decoration:line-through;
  color:var(--muted);
  font-size:12px;
}

.muted {
  font-size:12px;
  color:var(--muted);
  margin:4px 0;
}

.card-actions {
  display:flex;
  justify-content:space-between;
  margin-top:8px;
  gap:4px;
  flex-wrap:wrap;
}

/* Modals */
.modal {
  position:fixed;
  inset:0;
  display:none;
  align-items:center;
  justify-content:center;
  background:rgba(0,0,0,0.85);
  z-index:2000;
  padding:10px;
}

.modal .box {
  background:var(--card);
  border-radius:var(--radius);
  padding:24px;
  max-width:600px;
  width:100%;
  max-height:90vh;
  overflow-y:auto;
  box-shadow:var(--shadow);
}

/* Forms */
#orderForm, #paymentForm {
  display:grid;
  gap:12px;
}

#orderForm input,
#orderForm select,
#orderForm textarea,
#paymentForm input,
#paymentForm select {
  width:100%;
  padding:10px;
  border-radius:8px;
  border:none;
  background:#1e1e2f;
  color:#fff;
  outline:none;
  font-size:14px;
}

#orderForm button,
#paymentForm button {
  padding:12px;
  font-weight:700;
  background:linear-gradient(90deg,var(--accent),#ffe066);
  color:#000;
  border:none;
  border-radius:999px;
  cursor:pointer;
}

#thanksMsg {
  text-align:center;
  background:#10b981;
  padding:12px;
  margin:12px auto;
  border-radius:12px;
  max-width:400px;
  display:none;
  color:#fff;
  font-weight:bold;
}

/* Responsive Media Queries */
@media (max-width:768px) {
  .header-center { font-size:clamp(16px,6vw,24px); }
  .controls { flex-direction:column; }
  .card { font-size:13px; }
  .thumbnail { max-height:140px; }
  .modal .box { max-width:90%; padding:16px; }
}

@media (max-width:480px) {
  .header-center { font-size:clamp(14px,7vw,20px); }
  .controls input, .controls select { font-size:13px; padding:8px; }
  .btn { font-size:13px; padding:6px 12px; }
  .card { font-size:12px; }
  .thumbnail { max-height:120px; }
}

</style>
</head>
<body>

<header>
  <div></div>
  <div class="header-center">🏆 Trophy Shop</div>
  <div>
    <button class="btn btn-home" onclick="goHome()">Home</button>
    <button class="btn btn-cart" id="openCartBtn">🛒 Cart <span id="cartCount">0</span></button>
  </div>
</header>

<main class="container">
  <div class="controls">
    <input id="search" placeholder="Search trophies...">
    <select id="sort">
      <option value="popular">Sort: Popular</option>
      <option value="price-asc">Price: Low → High</option>
      <option value="price-desc">Price: High → Low</option>
    </select>
  </div>
  <div id="products" class="grid"></div>
</main>

<!-- Cart Modal -->
<div id="cartModal" class="modal">
  <div class="box">
    <button class="close btn" onclick="closeCart()">Close</button>
    <h2>Your Cart</h2>
    <div id="cartItemsWrap"></div>
    <div id="cartFooter"></div>
  </div>
</div>

<!-- Order Modal -->
<div id="orderModal" class="modal">
  <div class="box">
    <button class="close btn" onclick="closeOrder()">Close</button>
    <h2>Place Order</h2>
    <form id="orderForm" onsubmit="handleOrderSubmit(event)">
      <input type="text" id="name" placeholder="Full Name" required>
      <input type="text" id="phone" placeholder="Phone Number" required>
      <input type="text" id="pincode" placeholder="Pincode" required>
      <select id="state" required>
        <option value="">Select State</option>
      </select>
      <select id="district" required>
        <option value="">Select District</option>
      </select>
      <div id="stateMsg" style="color:#f87171;font-size:13px;display:none;">Currently only delivery in Assam</div>
      <button type="submit">Continue to Payment</button>
    </form>
  </div>
</div>

<!-- Payment Modal -->
<div id="paymentModal" class="modal">
  <div class="box">
    <button class="close btn" onclick="closePayment()">Close</button>
    <h2>Payment</h2>
    <form id="paymentForm" onsubmit="event.preventDefault(); confirmPayment();">
      <select id="paymentMethod" required>
        <option value="">Select Payment Method</option>
        <option value="upi">UPI</option>
        <option value="card">Credit/Debit Card</option>
        <option value="netbanking">Net Banking</option>
        <option value="cod">Cash on Delivery</option>
      </select>
      <div id="paymentLinks"></div>
      <button type="submit">Confirm Payment</button>
    </form>
  </div>
</div>

<div id="thanksMsg">✅ Thank you! Your order will be shipped within 7 days.</div>
<script>

// =======================
// Trophy Shop JS
// =======================

// Products
const PRODUCTS = [
  {id:1, name:'Gold Winner Cup', price:2499, discount:20, img:'https://via.placeholder.com/600x400?text=Gold+Cup'},
  {id:2, name:'Silver Shield', price:1999, discount:15, img:'https://via.placeholder.com/600x400?text=Silver+Shield'},
  {id:3, name:'Bronze Medal', price:149, discount:0, img:'https://via.placeholder.com/600x400?text=Bronze+Medal'},
  {id:4, name:'Crystal Star', price:5499, discount:25, img:'https://via.placeholder.com/600x400?text=Crystal+Star'},
  {id:5, name:'Wooden Plaque', price:1299, discount:10, img:'https://via.placeholder.com/600x400?text=Wooden+Plaque'},
  {id:6, name:'Champion Cup (Small)', price:899, discount:5, img:'https://via.placeholder.com/600x400?text=Champion+Small'},
  {id:7, name:'Grand Gold', price:2999, discount:10, img:'https://via.placeholder.com/600x400?text=Grand+Gold'},
  {id:8, name:'Silver Cup', price:1799, discount:8, img:'https://via.placeholder.com/600x400?text=Silver+Cup'},
  {id:9, name:'Diamond Trophy', price:7999, discount:30, img:'https://via.placeholder.com/600x400?text=Diamond+Trophy'},
  {id:10, name:'Sports Shield', price:1599, discount:12, img:'https://via.placeholder.com/600x400?text=Sports+Shield'}
];

// =======================
// State
// =======================
let cart = JSON.parse(localStorage.getItem('ts_cart') || '[]');
let currentOrder = { items: [], amount: 0, shipping: {} };

const assamDistricts = ["Kamrup","Guwahati","Dibrugarh","Jorhat","Tezpur","Silchar","Tinsukia"];
const statesIndia = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry"];

// DOM Elements
const stateSelect = document.getElementById('state');
const districtSelect = document.getElementById('district');
const cartCountEl = document.getElementById('cartCount');
const cartWrap = document.getElementById('cartItemsWrap');
const cartFooter = document.getElementById('cartFooter');
const paymentLinks = document.getElementById('paymentLinks');

// =======================
// Initialization
// =======================
function init() {
  populateStates();
  renderProducts();
  updateCartCount();
  document.getElementById('openCartBtn').addEventListener('click', openCart);
  stateSelect.addEventListener('change', handleStateChange);
  document.getElementById('paymentMethod').addEventListener('change', handlePaymentChange);
}

// =======================
// Render Products
// =======================
function renderProducts() {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = PRODUCTS.map(p => `
    <div class="card">
      <img class="thumbnail" src="${p.img}" alt="${p.name}">
      <div class="title">${p.name}</div>
      <div class="price-row">
        ${p.discount > 0 ? `<div class="old">₹${p.price}</div> <div>₹${Math.round(p.price * (1 - p.discount/100))}</div>` : `<div>₹${p.price}</div>`}
      </div>
      <div class="card-actions">
        <button class="btn btn-add" onclick="addToCart(${p.id})">Add</button>
        <button class="btn btn-buy" onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    </div>
  `).join('');
}

// =======================
// Cart Operations
// =======================
const saveCart = () => {
  localStorage.setItem('ts_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
};

const updateCartCount = () => {
  cartCountEl.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
};

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({id, qty:1});
  saveCart();
}

function buyNow(id) {
  cart = [{id, qty:1}];
  saveCart();
  openOrder();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

// =======================
// Render Cart
// =======================
function renderCart() {
  if(cart.length === 0) {
    cartWrap.innerHTML = '<p>Your cart is empty.</p>';
    cartFooter.innerHTML = '';
    return;
  }

  let total = 0;
  cartWrap.innerHTML = '';
  
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    const subtotal = product.price * item.qty;
    total += subtotal;
    
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.marginBottom = '8px';
    div.innerHTML = `
      <div>${product.name} (x${item.qty})</div>
      <div>₹${subtotal} <button style="margin-left:8px;padding:2px 6px;border:none;border-radius:6px;background:#f87171;color:#fff;cursor:pointer;" onclick="removeFromCart(${item.id})">Remove</button></div>
    `;
    cartWrap.appendChild(div);
  });

  cartFooter.innerHTML = `
    <hr>
    <p style="text-align:right;font-weight:bold;">Total: ₹${total}</p>
    <button class="btn btn-buy" onclick="openOrder()">Place Order</button>
  `;
}

// =======================
// Orders & Payment
// =======================
function handleOrderSubmit(e) {
  e.preventDefault();
  if(stateSelect.value !== "Assam") return alert('Currently only delivery in Assam');

  currentOrder.items = [...cart];
  currentOrder.amount = cart.reduce((sum, i) => sum + i.qty * PRODUCTS.find(p => p.id === i.id).price, 0);
  currentOrder.shipping = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    pincode: document.getElementById('pincode').value,
    state: stateSelect.value,
    district: districtSelect.value
  };
  closeOrder();
  openPayment();
}

function handlePaymentChange() {
  const method = document.getElementById('paymentMethod').value;
  paymentLinks.innerHTML = '';
  if(method === "upi") {
    paymentLinks.innerHTML = `<p>Pay using UPI apps:</p>
      <a href="upi://pay?pa=example@upi&pn=TrophyShop" target="_blank">Google Pay</a> |
      <a href="upi://pay?pa=example@upi&pn=TrophyShop" target="_blank">PhonePe</a>`;
  } else if(method === "card") {
    paymentLinks.innerHTML = '<p>Enter card details (mock)</p>';
  } else if(method === "netbanking") {
    paymentLinks.innerHTML = '<p>Netbanking selected (mock)</p>';
  }
}

function confirmPayment() {
  const method = document.getElementById('paymentMethod').value;
  if(method === "cod" || method) {
    cart = [];
    saveCart();
    closePayment();
    document.getElementById('thanksMsg').style.display = 'block';
    setTimeout(() => { document.getElementById('thanksMsg').style.display = 'none'; }, 10000);
  }
}

// =======================
// State / District
// =======================
function populateStates() {
  stateSelect.innerHTML = `<option value="">Select State</option>` + 
    statesIndia.map(s => `<option value="${s}">${s}</option>`).join('');
}

function handleStateChange() {
  const state = stateSelect.value;
  districtSelect.innerHTML = `<option value="">Select District</option>`;
  if(state === "Assam") {
    document.getElementById('stateMsg').style.display = 'none';
    districtSelect.innerHTML += assamDistricts.map(d => `<option value="${d}">${d}</option>`).join('');
  } else if(state !== "") {
    document.getElementById('stateMsg').style.display = 'block';
    districtSelect.innerHTML = `<option value="">N/A</option>`;
  } else {
    document.getElementById('stateMsg').style.display = 'none';
  }
}

// =======================
// Modals
// =======================
const openCart = () => { renderCart(); document.getElementById('cartModal').style.display='flex'; }
const closeCart = () => document.getElementById('cartModal').style.display='none';
const openOrder = () => document.getElementById('orderModal').style.display='flex';
const closeOrder = () => document.getElementById('orderModal').style.display='none';
const openPayment = () => document.getElementById('paymentModal').style.display='flex';
const closePayment = () => document.getElementById('paymentModal').style.display='none';
const goHome = () => window.scrollTo({top:0, behavior:'smooth'});

// =======================
// Initialize App
// =======================
init();


</script>

</body>
</html>



#length

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Poster Frame Designer</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200">

  <div class="bg-white p-8 rounded-xl shadow-md w-[400px] text-center">
    <h1 class="text-xl font-bold mb-5">Poster Frame Designer</h1>
    
    <label for="height" class="block mt-3 text-left font-semibold">Height (cm):</label>
    <input type="number" id="height" placeholder="Enter height" 
           class="w-full mt-2 p-2 border border-gray-300 rounded-md">

    <label for="width" class="block mt-3 text-left font-semibold">Width (cm):</label>
    <input type="number" id="width" placeholder="Enter width" 
           class="w-full mt-2 p-2 border border-gray-300 rounded-md">
    
    <label for="pageSize" class="block mt-3 text-left font-semibold">Page Size:</label>
    <select id="pageSize" onchange="setPageSize()" 
            class="w-full mt-2 p-2 border border-gray-300 rounded-md">
      <option value="">-- Select Page Size --</option>
      <option value="21x29.7">A4 (21 × 29.7 cm)</option>
      <option value="29.7x42">A3 (29.7 × 42 cm)</option>
      <option value="42x59.4">A2 (42 × 59.4 cm)</option>
      <option value="59.4x84.1">A1 (59.4 × 84.1 cm)</option>
      <option value="84.1x118.9">A0 (84.1 × 118.9 cm)</option>
      <option value="custom">Custom</option>
    </select>

    <label for="photo" class="block mt-3 text-left font-semibold">Upload Poster Photo:</label>
    <input type="file" id="photo" accept="image/*" 
           class="w-full mt-2 p-2 border border-gray-300 rounded-md">

    <button onclick="generatePreview()" 
            class="mt-5 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
      Generate Preview
    </button>
    
    <div id="preview" class="mt-6 p-4 rounded-xl bg-gray-100 shadow-inner">
      <p>No poster preview yet.</p>
    </div>
  </div>

  <script>
    let uploadedImage = null;

    function setPageSize() {
      let pageSize = document.getElementById("pageSize").value;
      if(pageSize !== "" && pageSize !== "custom") {
        let [w, h] = pageSize.split("x");
        document.getElementById("width").value = w;
        document.getElementById("height").value = h;
      }
    }

    document.getElementById("photo").addEventListener("change", function(event) {
      let file = event.target.files[0];
      if(file) {
        let reader = new FileReader();
        reader.onload = function(e) {
          uploadedImage = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });

    function generatePreview() {
      let h = document.getElementById("height").value;
      let w = document.getElementById("width").value;

      if(h === "" || w === "") {
        alert("Please enter height and width");
        return;
      }

      let scaledW = Math.min(w * 3, 250);
      let scaledH = Math.min(h * 3, 300);

      let previewBox = document.getElementById("preview");
      previewBox.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Poster Preview</h3>
        <p><strong>Size:</strong> ${w} cm × ${h} cm</p>
        <div class="relative flex justify-center items-center mt-4 mx-auto border-4 border-blue-500 rounded-md shadow-lg overflow-hidden bg-gray-50"
             style="width:${scaledW}px; height:${scaledH}px;">
          ${uploadedImage 
            ? `<img src="${uploadedImage}" alt="Poster" class="max-w-full max-h-full object-cover">`
            : `<span class="font-bold text-gray-600">${w} × ${h} cm</span>`}
          <span class="absolute top-1 left-1 text-[10px] bg-white/70 px-2 py-[2px] rounded text-gray-600">Poster Preview</span>
        </div>
      `;
    }
  </script>

</body>
</html>
