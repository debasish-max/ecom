// =================== CART FUNCTIONS =================== //
function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price: Number(price), qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.innerText = cart.reduce((s, it) => s + it.qty, 0);

  const cartItemsDiv = document.getElementById("cart-items");
  if (!cartItemsDiv) return;
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("total").innerText = "Total: ₹0";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span><b>${escapeHtml(item.name)}</b> - ₹${item.price.toFixed(2)}</span>
      <div class="qty-controls">
        <button onclick="changeQty('${escapeJs(item.name)}', -1)">-</button>
        <span>Qty: ${item.qty}</span>
        <button onclick="changeQty('${escapeJs(item.name)}', 1)">+</button>
        <button class="remove-btn" onclick="removeItem('${escapeJs(item.name)}')">Remove</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  document.getElementById("total").innerText = `Total: ₹${total.toFixed(2)}`;
}

function changeQty(name, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }
}

function removeItem(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(i => i.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function clearCart() {
  if (!confirm("Clear your cart?")) return;
  localStorage.removeItem("cart");
  updateCart();
}

// =================== ESCAPERS =================== //
function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeJs(s) {
  return String(s).replace(/'/g, "\\'");
}

// =================== PAYMENT MODAL =================== //
function openPaymentModal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!document.getElementById("payment-modal")) {
    document.body.insertAdjacentHTML("beforeend", getPaymentModalHTML());
    attachPaymentModalEvents();
  }

  document.getElementById("payment-modal").classList.remove("hidden");
  hideAllPaymentHelpers();
  document.querySelectorAll("input[name='paymentMethod']").forEach(r => {
    r.checked = r.value === "UPI";
  });
  onPaymentMethodChange();
}

function closePaymentModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) modal.classList.add("hidden");
}

// Build modal dynamically
function getPaymentModalHTML() {
  return `
  <div id="payment-modal" class="modal hidden">
    <div class="modal-content">
      <button class="close-btn" id="modal-close">&times;</button>
      <h3>Payment & Delivery Details</h3>
      <form id="payment-form" onsubmit="handlePayment(event)" novalidate>
        
        <div class="form-row"><label>Full name</label>
        <input id="fullname" required /></div>

        <div class="form-row"><label>Phone number</label>
        <input id="phone" type="tel" maxlength="10" required /></div>

        <div class="form-row"><label>Address</label>
        <textarea id="address" rows="2" required></textarea></div>

        <div class="form-row inline">
          <div><label>Pincode</label>
          <input id="pincode" maxlength="6" required /></div>
          <div><label>State</label>
          <select id="state" required>
            <option value="">Select state</option>
          </select></div>
        </div>

        <div class="form-row"><label>District</label>
        <select id="district" required>
          <option value="">Select district</option>
        </select></div>

        <fieldset class="form-row payment-methods">
          <legend>Payment method</legend>
          <label><input type="radio" name="paymentMethod" value="UPI" checked /> UPI</label>
          <label><input type="radio" name="paymentMethod" value="NetBanking" /> Net Banking</label>
          <label><input type="radio" name="paymentMethod" value="Card" /> Card</label>
          <label><input type="radio" name="paymentMethod" value="COD" /> Cash on Delivery</label>
        </fieldset>

        <div id="upi-details" class="form-row hidden">
          <input id="upi-id" type="text" placeholder="example@upi" />
        </div>

        <div id="netbanking-details" class="form-row hidden">
          <input id="bank-name" type="text" placeholder="Bank name" />
        </div>

        <div id="card-details" class="form-row hidden">
          <input id="card-number" type="text" placeholder="XXXX XXXX XXXX XXXX"/>
          <div class="small-inline">
            <input id="card-exp" type="text" placeholder="MM/YY"/>
            <input id="card-cvv" type="text" placeholder="CVV"/>
          </div>
        </div>

        <p id="form-error" class="error hidden"></p>
        <div class="form-actions">
          <button type="submit" class="primary">Pay / Place Order</button>
          <button type="button" id="cancel-btn" class="secondary">Cancel</button>
        </div>
      </form>
    </div>
  </div>`;
}

function attachPaymentModalEvents() {
  document.getElementById("modal-close").addEventListener("click", closePaymentModal);
  document.getElementById("cancel-btn").addEventListener("click", closePaymentModal);
  document.querySelectorAll("input[name='paymentMethod']").forEach(radio => {
    radio.addEventListener("change", onPaymentMethodChange);
  });
  document.getElementById("state").addEventListener("change", onStateChange);

  // Fill states dropdown
  const stateSelect = document.getElementById("state");
  Object.keys(districtMap).forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });
}

function onPaymentMethodChange() {
  hideAllPaymentHelpers();
  const method = document.querySelector("input[name='paymentMethod']:checked").value;
  if (method === "UPI") document.getElementById("upi-details").classList.remove("hidden");
  if (method === "Card") document.getElementById("card-details").classList.remove("hidden");
  if (method === "NetBanking") document.getElementById("netbanking-details").classList.remove("hidden");
}

function hideAllPaymentHelpers() {
  document.getElementById("upi-details").classList.add("hidden");
  document.getElementById("card-details").classList.add("hidden");
  document.getElementById("netbanking-details").classList.add("hidden");
}

// =================== STATES & DISTRICTS =================== //
const districtMap = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore"],
  "Arunachal Pradesh": ["Itanagar","Tawang","Pasighat"],
  "Assam": ["Jorhat","Guwahati","Dibrugarh","Silchar"],
  "Bihar": ["Patna","Gaya","Bhagalpur"],
  "Chhattisgarh": ["Raipur","Bilaspur","Korba"],
  "Delhi": ["New Delhi","Dwarka","Rohini"],
  "Goa": ["North Goa","South Goa"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot"],
  "Haryana": ["Gurugram","Faridabad","Panipat"],
  "Himachal Pradesh": ["Shimla","Kullu","Manali"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad"],
  "Karnataka": ["Bengaluru","Mysuru","Mangaluru"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode"],
  "Madhya Pradesh": ["Bhopal","Indore","Jabalpur"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima","Dimapur"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela"],
  "Punjab": ["Amritsar","Ludhiana","Patiala"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai"],
  "Telangana": ["Hyderabad","Warangal"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Varanasi"],
  "Uttarakhand": ["Dehradun","Haridwar","Nainital"],
  "West Bengal": ["Kolkata","Darjeeling","Howrah"],
  "Andaman & Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Jammu & Kashmir": ["Srinagar","Jammu"],
  "Ladakh": ["Leh","Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Pondicherry"]
};

function onStateChange() {
  const state = document.getElementById("state").value;
  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = "<option value=''>Select district</option>";
  if (districtMap[state]) {
    districtMap[state].forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      districtSelect.appendChild(opt);
    });
  }
}

// =================== PAYMENT HANDLER =================== //
function handlePayment(event) {
  event.preventDefault();
  const fullname = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;
  const paymentMethod = document.querySelector("input[name='paymentMethod']:checked")?.value;

  if (!fullname || !phone || !address || !pincode || !state || !district || !paymentMethod) {
    showError("Please fill all required fields.");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    showError("Enter a valid 10-digit phone number.");
    return;
  }
  if (!/^\d{6}$/.test(pincode)) {
    showError("Enter a valid 6-digit pincode.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    showError("Your cart is empty.");
    return;
  }

  const order = {
    id: "ORD" + Date.now(),
    createdAt: new Date().toISOString(),
    customer: { fullname, phone, address, pincode, state, district },
    paymentMethod,
    items: cart,
    total: cart.reduce((s,i)=>s + (i.price*i.qty),0)
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart");
  updateCart();

  alert(`Order placed!\nOrder ID: ${order.id}\nTotal: ₹${order.total}`);
  closePaymentModal();
}

function showError(msg) {
  const err = document.getElementById("form-error");
  err.innerText = msg;
  err.classList.remove("hidden");
}

    var swiper = new Swiper(".mySwiper", {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

// =================== INIT =================== //
window.onload = function() {
  updateCart();
};
