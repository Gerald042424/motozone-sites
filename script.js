// Sample product data
const products = [
  {
    id: 1,
    title: "Carbon Fiber Helmet",
    category: "Helmets",
    price: 299.99,
    originalPrice: 349.99,
    stock: 15,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDfW_SDY7f9mtRooadeFaUdj7n0nL1F-g5-g&s",
    badge: "New",
    description: "Lightweight carbon fiber helmet with advanced protection.",
  },
  {
    id: 2,
    title: "Performance Exhaust",
    category: "Exhausts",
    price: 449.99,
    originalPrice: 449.99,
    stock: 8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTagi7bkz10cd2wb3Op2DJZJA_2_p4Fo7pWgA&s",
    badge: "Hot",
    description: "High-performance exhaust system for increased power.",
  },
  {
    id: 3,
    title: "LED Headlight Kit",
    category: "Lights",
    price: 99.99,
    originalPrice: 129.99,
    stock: 20,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRD5jbayPj8u8mPu-IxH2luwX9aDn9yK418g&s",
    badge: "Sale",
    description: "Ultra-bright LED headlight kit with multiple color options.",
  },
  {
    id: 4,
    title: "Carbon Mirror Set",
    category: "Mirrors",
    price: 89.99,
    originalPrice: 89.99,
    stock: 12,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq11BEBzjXLNvAOHfSU6Afp7q3eNvRp3STwg&s",
    description: "Sleek carbon fiber mirror set with improved visibility.",
  },
  {
    id: 5,
    title: "Racing Helmet",
    category: "Helmets",
    price: 299.99,
    originalPrice: 349.99,
    stock: 5,
    image:
     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8EoFHAjlP3jtcJ9rXBShVygSVgDzj3rDrA&s",
    description: "Professional racing helmet with aerodynamic design.",
  },
  {
    id: 6,
    title: "Chrome Exhaust Tips",
    category: "Exhausts",
    price: 59.99,
    originalPrice: 79.99,
    stock: 18,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWcifKqnjusu5E9qlAcjAjOE6Kbd0SPNSDsw&s",
    badge: "Sale",
    description: "Chrome-plated exhaust tips for a custom look.",
  },
  {
    id: 7,
    title: "LED Strip Lights",
    category: "Lights",
    price: 39.99,
    originalPrice: 49.99,
    stock: 25,
    image:
     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbf0_xv_bFN1MEaS_4KlxBCCXa5jt2VFmVmQ&s",
    badge: "Sale",
    description: "Flexible LED strip lights with remote control.",
  },
  {
    id: 8,
    title: "Billet Aluminum Mirrors",
    category: "Mirrors",
    price: 119.99,
    originalPrice: 119.99,
    stock: 10,
    image:
     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqrdQoXklGnwcJWVvc7TD4SiLOr_Hrs68AhQ&s",
    description: "Billet aluminum mirrors with adjustable stems.",
  },
];

// Save products to localStorage to persist stock changes
if (!localStorage.getItem("productStock")) {
  localStorage.setItem(
    "productStock",
    JSON.stringify(products.map((p) => ({ id: p.id, stock: p.stock }))),
  );
} else {
  // Update products with saved stock values
  const savedStock = JSON.parse(localStorage.getItem("productStock"));
  products.forEach((product) => {
    const savedProduct = savedStock.find((p) => p.id === product.id);
    if (savedProduct) {
      product.stock = savedProduct.stock;
    }
  });
}

// Cart functionality
let cart = [];
let cartOpen = false;

// DOM elements
const featuredProductsGrid = document.getElementById("featured-products-grid");
const cartDrawer = document.getElementById("cart-drawer");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const overlay = document.getElementById("overlay");
const cartCountElement = document.querySelector(".cart-count");

// Load featured products
function loadFeaturedProducts(productsToShow = products) {
  featuredProductsGrid.innerHTML = "";

  if (productsToShow.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.innerHTML = `
      <h3>No products found</h3>
      <p>Try a different search term or browse our categories.</p>
    `;
    featuredProductsGrid.appendChild(noResults);
    return;
  }

  productsToShow.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    let badgeHTML = "";
    if (product.badge) {
      badgeHTML = `<div class="product-badge">${product.badge}</div>`;
    }

    // Check if product is in favorites
    let isFavorite = false;
    if (isLoggedIn && currentUser && favorites[currentUser.email]) {
      isFavorite = favorites[currentUser.email].includes(product.id);
    }

    const favoriteIcon = isFavorite ? "❤️" : "🤍";

    // Format price display based on whether it's on sale
    let priceDisplay = "";
    if (product.originalPrice > product.price) {
      priceDisplay = `
        <div class="product-price">
          <span class="original-price">${product.originalPrice.toFixed(2)}</span>
          <span class="sale-price">${product.price.toFixed(2)}</span>
        </div>
      `;
    } else {
      priceDisplay = `<div class="product-price">${product.price.toFixed(2)}</div>`;
    }

    // Stock display
    const stockClass =
      product.stock > 0
        ? product.stock < 5
          ? "low-stock"
          : "in-stock"
        : "out-of-stock";
    const stockText =
      product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock";

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
        ${badgeHTML}
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        ${priceDisplay}
        <div class="product-stock ${stockClass}">${stockText}</div>
        <div class="product-actions">
          <button class="add-to-cart" data-id="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>Add to Cart</button>
          <button class="favorite-btn" data-id="${product.id}">${favoriteIcon}</button>
          <button class="compare-btn">⚖️</button>
        </div>
      </div>
    `;

    featuredProductsGrid.appendChild(productCard);
  });

  // Add event listeners to Add to Cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      if (this.disabled) return;

      const productId = parseInt(this.getAttribute("data-id"));
      addToCart(productId);
    });
  });

  // Add event listeners to Favorite buttons
  document.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));

      if (!isLoggedIn) {
        alert("Please login to add favorites");
        showAuthModal("login");
        return;
      }

      // Check if already in favorites
      const isFavorite =
        favorites[currentUser.email] &&
        favorites[currentUser.email].includes(productId);

      if (isFavorite) {
        // Remove from favorites
        removeFromFavorites(productId);
        this.innerHTML = "🤍";
      } else {
        // Add to favorites
        addToFavorites(productId);
        this.innerHTML = "❤️";
      }
    });
  });
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product) return;

  // Check if product is in stock
  if (product.stock <= 0) {
    showCustomAlert("Sorry, this product is out of stock.");
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  // Check if adding more would exceed available stock
  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      showCustomAlert(`Sorry, only ${product.stock} units available in stock.`);
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
  openCart();
}

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty</p>';
    cartTotalPrice.textContent = "$0.00";
    cartCountElement.textContent = "0";
    return;
  }

  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  cartCountElement.textContent = itemCount.toString();

  // Add event listeners to quantity buttons
  document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      decreaseQuantity(productId);
    });
  });

  document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      increaseQuantity(productId);
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      removeFromCart(productId);
    });
  });
}

// Increase item quantity
function increaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId);
  const product = products.find((p) => p.id === productId);

  if (item && product) {
    // Check if increasing would exceed available stock
    if (item.quantity >= product.stock) {
      showCustomAlert(`Sorry, only ${product.stock} units available in stock.`);
      return;
    }
    item.quantity += 1;
    updateCart();
  }
}

// Decrease item quantity
function decreaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Open cart drawer
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("active");
  cartOpen = true;
}

// Close cart drawer
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("active");
  cartOpen = false;
}

// Authentication functionality
let isLoggedIn = false;
let currentUser = null;
let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || {};
let favorites = JSON.parse(localStorage.getItem("favorites")) || {};

// Check for saved login session on page load
const savedSession = JSON.parse(localStorage.getItem("userSession"));
if (savedSession) {
  isLoggedIn = true;
  currentUser = savedSession;
}

// Login function
function login(email, password) {
  // Check if user exists in registered users
  const user = registeredUsers.find(
    (user) => user.email === email && user.password === password,
  );
  if (user) {
    isLoggedIn = true;
    currentUser = { email, name: user.name };

    // Save login session to localStorage
    localStorage.setItem("userSession", JSON.stringify(currentUser));

    updateAuthUI();
    return true;
  }
  return false;
}

// Register function
function register(name, email, password, confirmPassword) {
  // Check if email already exists
  const existingUser = registeredUsers.find((user) => user.email === email);
  if (existingUser) {
    alert("Email already registered. Please login instead.");
    return false;
  }

  // Create new user
  if (name && email && password && password === confirmPassword) {
    const newUser = { name, email, password };
    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    // Initialize empty order history and favorites for this user
    if (!orderHistory[email]) {
      orderHistory[email] = [];
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    }

    if (!favorites[email]) {
      favorites[email] = [];
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    isLoggedIn = true;
    currentUser = { email, name };

    // Save login session to localStorage
    localStorage.setItem("userSession", JSON.stringify(currentUser));

    updateAuthUI();
    return true;
  }
  return false;
}

// Logout function
function logout() {
  isLoggedIn = false;
  currentUser = null;

  // Remove login session from localStorage
  localStorage.removeItem("userSession");

  updateAuthUI();
}

// Update UI based on auth state
function updateAuthUI() {
  const accountBtn = document.querySelector(".account-btn");
  if (isLoggedIn && accountBtn) {
    accountBtn.innerHTML = `<span class="user-initial">${currentUser.name.charAt(0).toUpperCase()}</span>`;
    accountBtn.title = `Logged in as ${currentUser.name}`;

    // Update user menu to show orders and favorites
    updateUserMenu();
  } else if (accountBtn) {
    accountBtn.innerHTML = '<i class="icon-user">👤</i>';
    accountBtn.title = "Login or Sign Up";
  }
}

// Update user menu with orders and favorites
function updateUserMenu() {
  const userMenu = document.getElementById("user-menu");
  if (userMenu && currentUser) {
    const userOrders = document.getElementById("user-orders");
    const userFavorites = document.getElementById("user-favorites");

    if (userOrders) {
      userOrders.addEventListener("click", function (e) {
        e.preventDefault();
        showOrderHistory();
      });
    }

    if (userFavorites) {
      userFavorites.addEventListener("click", function (e) {
        e.preventDefault();
        showFavorites();
      });
    }
  }
}




// Show order history modal
function showOrderHistory() {
  const modal = document.getElementById("order-history-modal");
  const ordersList = document.getElementById("orders-list");

  if (modal && ordersList && currentUser) {
    // Clear previous orders
    ordersList.innerHTML = "";

    const userOrders = orderHistory[currentUser.email] || [];

    if (userOrders.length === 0) {
      ordersList.innerHTML = "<p>You haven't placed any orders yet.</p>";
    } else {
      userOrders.forEach((order) => {
        const orderElement = document.createElement("div");
        orderElement.className = "order-history-item";

        const formattedDate = new Date(order.date).toLocaleDateString();
        const paymentMethodText = order.paymentMethod
          ? `<p>Payment Method: ${formatPaymentMethod(order.paymentMethod)}</p>`
          : "";
        const paymentAmountText = order.paymentAmount
          ? `<p>Payment Amount: ${order.paymentAmount}</p>`
          : "";

        orderElement.innerHTML = `
          <div class="order-header">
            <div>
              <h4>Order #${order.id}</h4>
              <p>Date: ${formattedDate}</p>
              ${paymentMethodText}
              ${paymentAmountText}
            </div>
            <div class="order-total">${order.total.toFixed(2)}</div>
          </div>
          <div class="order-items-list">
            ${order.items
              .map(
                (item) => `
              <div class="order-product">
                <img src="${item.image}" alt="${item.title}">
                <div>
                  <p>${item.title} x ${item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
          <button class="resend-receipt-btn" data-order-id="${order.id}">Resend Receipt</button>
        `;

        ordersList.appendChild(orderElement);
      });

      // Add event listeners to resend receipt buttons
      ordersList.querySelectorAll(".resend-receipt-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const orderId = parseInt(this.getAttribute("data-order-id"));
          const order = userOrders.find((o) => o.id === orderId);
          if (order) {
            sendEmailReceipt(order, currentUser.email);
            alert("Receipt has been resent to your email.");
          }
        });
      });
    }

    modal.style.display = "flex";
    overlay.classList.add("active");
  }
}

// Show favorites modal
function showFavorites() {
  const modal = document.getElementById("favorites-modal");
  const favoritesList = document.getElementById("favorites-list");

  if (modal && favoritesList && currentUser) {
    // Clear previous favorites
    favoritesList.innerHTML = "";

    const userFavorites = favorites[currentUser.email] || [];

    if (userFavorites.length === 0) {
      favoritesList.innerHTML = "<p>You haven't added any favorites yet.</p>";
    } else {
      userFavorites.forEach((productId) => {
        const product = products.find((p) => p.id === productId);
        if (product) {
          const favoriteItem = document.createElement("div");
          favoriteItem.className = "favorite-item";
          favoriteItem.innerHTML = `
            <div class="favorite-image">
              <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="favorite-details">
              <h4>${product.title}</h4>
              <p>${product.price.toFixed(2)}</p>
              <div class="favorite-actions">
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="remove-favorite" data-id="${product.id}">Remove</button>
              </div>
            </div>
          `;

          favoritesList.appendChild(favoriteItem);
        }
      });

      // Add event listeners to the new buttons
      favoritesList.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-id"));
          addToCart(productId);
        });
      });

      favoritesList.querySelectorAll(".remove-favorite").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-id"));
          removeFromFavorites(productId);
          // Remove the item from the display
          this.closest(".favorite-item").remove();

          // If no favorites left, show message
          if (favorites[currentUser.email].length === 0) {
            favoritesList.innerHTML =
              "<p>You haven't added any favorites yet.</p>";
          }
        });
      });
    }

    modal.style.display = "flex";
    overlay.classList.add("active");
  }
}

// Add product to favorites
function addToFavorites(productId) {
  if (!isLoggedIn) {
    alert("Please login to add favorites");
    showAuthModal("login");
    return;
  }

  if (!favorites[currentUser.email]) {
    favorites[currentUser.email] = [];
  }

  // Check if already in favorites
  if (!favorites[currentUser.email].includes(productId)) {
    favorites[currentUser.email].push(productId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Product added to favorites!");
  } else {
    alert("This product is already in your favorites!");
  }
}

// Remove product from favorites
function removeFromFavorites(productId) {
  if (isLoggedIn && favorites[currentUser.email]) {
    favorites[currentUser.email] = favorites[currentUser.email].filter(
      (id) => id !== productId,
    );
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Show auth modal
function showAuthModal(mode = "login") {
  const modal = document.getElementById("auth-modal");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (modal) {
    modal.style.display = "flex";
    overlay.classList.add("active");

    // Show the appropriate form
    if (mode === "login") {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      document.getElementById("login-tab").classList.add("active");
      document.getElementById("register-tab").classList.remove("active");
    } else {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      document.getElementById("login-tab").classList.remove("active");
      document.getElementById("register-tab").classList.add("active");
    }
  }
}

// Close auth modal
function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.style.display = "none";
    overlay.classList.remove("active");
  }
}

// Checkout functionality
function processCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!isLoggedIn) {
    alert("Please login to checkout");
    showAuthModal("login");
    return;
  }

  // Show checkout modal
  const checkoutModal = document.getElementById("checkout-modal");
  if (checkoutModal) {
    checkoutModal.style.display = "flex";
    overlay.classList.add("active");

    // Update order summary
    const orderItems = document.getElementById("order-items");
    const orderTotal = document.getElementById("order-total");

    if (orderItems && orderTotal) {
      orderItems.innerHTML = "";
      let total = 0;

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const orderItem = document.createElement("div");
        orderItem.className = "order-item";
        orderItem.innerHTML = `
          <span>${item.title} x ${item.quantity}</span>
          <span>${itemTotal.toFixed(2)}</span>
        `;

        orderItems.appendChild(orderItem);
      });

      // Add shipping and tax
      const shipping = 10.0;
      const tax = total * 0.08;
      const grandTotal = total + shipping + tax;

      const shippingItem = document.createElement("div");
      shippingItem.className = "order-item";
      shippingItem.innerHTML = `
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      `;

      const taxItem = document.createElement("div");
      taxItem.className = "order-item";
      taxItem.innerHTML = `
        <span>Tax (8%)</span>
        <span>${tax.toFixed(2)}</span>
      `;

      orderItems.appendChild(document.createElement("hr"));
      orderItems.appendChild(shippingItem);
      orderItems.appendChild(taxItem);

      orderTotal.textContent = `${grandTotal.toFixed(2)}`;
    }
  }
}

// Complete order
function completeOrder() {
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm && checkoutForm.checkValidity()) {
    // Check stock availability before proceeding
    for (const cartItem of cart) {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product || product.stock < cartItem.quantity) {
        showCustomAlert(
          `Sorry, ${cartItem.title} doesn't have enough stock. Available: ${product ? product.stock : 0}`,
        );
        return false;
      }
    }

    // Get payment method
    const paymentMethodSelect = document.getElementById("payment-method");
    const paymentMethod = paymentMethodSelect.value;

    // Validate payment method fields
    if (!validatePaymentFields(paymentMethod)) {
      return false;
    }

    // Get payment amount based on payment method
    let paymentAmount = "";
    switch (paymentMethod) {
      case "credit-card":
        paymentAmount = document.getElementById("credit-card-amount").value;
        break;
      case "gcash":
        paymentAmount = document.getElementById("gcash-amount").value;
        break;
      case "metrobank":
        paymentAmount = document.getElementById("metrobank-amount").value;
        break;
      case "security-bank":
        paymentAmount = document.getElementById("security-bank-amount").value;
        break;
    }

    // Save order to order history
    if (currentUser && currentUser.email) {
      const orderDate = new Date().toISOString();
      const orderItems = [...cart];
      const orderTotal = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      const shipping = 10.0;
      const tax = orderTotal * 0.08;
      const grandTotal = orderTotal + shipping + tax;

      const order = {
        id: Date.now(),
        date: orderDate,
        items: orderItems,
        shipping: shipping,
        tax: tax,
        total: grandTotal,
        paymentMethod: paymentMethod,
        paymentAmount: paymentAmount,
      };

      if (!orderHistory[currentUser.email]) {
        orderHistory[currentUser.email] = [];
      }

      // Update product stock
      orderItems.forEach((item) => {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          product.stock -= item.quantity;

          // Update stock in localStorage
          const savedStock = JSON.parse(localStorage.getItem("productStock"));
          const productIndex = savedStock.findIndex((p) => p.id === product.id);
          if (productIndex !== -1) {
            savedStock[productIndex].stock = product.stock;
            localStorage.setItem("productStock", JSON.stringify(savedStock));
          }
        }
      });

      // Reload featured products to show updated stock levels immediately
      loadFeaturedProducts();

      orderHistory[currentUser.email].push(order);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

      // Send email receipt
      const userEmail = document.getElementById("checkout-email").value;
      sendEmailReceipt(order, userEmail);

      // Show custom success alert
      showPurchaseSuccessAlert(order, userEmail);

      cart = [];
      updateCart();
      closeCheckoutModal();
      return true;
    }
  } else {
    showCustomAlert("Please fill in all required fields");
    return false;
  }
}

// Validate payment fields based on selected payment method
function validatePaymentFields(paymentMethod) {
  switch (paymentMethod) {
    case "credit-card":
      const cardNumber = document.getElementById("checkout-card").value;
      const expiry = document.getElementById("checkout-expiry").value;
      const cvv = document.getElementById("checkout-cvv").value;
      const cardAmount = document.getElementById("credit-card-amount").value;

      if (!cardNumber || !expiry || !cvv || !cardAmount) {
        alert("Please fill in all credit card details including amount");
        return false;
      }
      break;

    case "gcash":
      const gcashNumber = document.getElementById("gcash-number").value;
      const gcashAmount = document.getElementById("gcash-amount").value;
      if (!gcashNumber) {
        alert("Please enter your Phone number");
        return false;
      }
      if (!gcashAmount) {
        alert("Please enter the amount");
        return false;
      }
      break;

    case "metrobank":
      const metrobankAccount =
        document.getElementById("metrobank-account").value;
      const metrobankAmount = document.getElementById("metrobank-amount").value;
      if (!metrobankAccount) {
        alert("Please enter your Bank account number");
        return false;
      }
      if (!metrobankAmount) {
        alert("Please enter the amount");
        return false;
      }
      break;

    case "security-bank":
      const securityBankAccount = document.getElementById(
        "security-bank-account",
      ).value;
      const securityBankAmount = document.getElementById(
        "security-bank-amount",
      ).value;
      if (!securityBankAccount) {
        alert("Please enter your Bank account number");
        return false;
      }
      if (!securityBankAmount) {
        alert("Please enter the amount");
        return false;
      }
      break;

    default:
      alert("Please select a payment method");
      return false;
  }

  return true;
}

// Send email receipt (mock function)
function sendEmailReceipt(order, email) {
  console.log(`Sending receipt to ${email} for order #${order.id}`);

  // In a real application, this would connect to an email service API
  // For now, we'll just simulate the email being sent

  // Format the receipt
  let receiptItems = order.items
    .map(
      (item) =>
        `${item.title} x ${item.quantity}: ${(item.price * item.quantity).toFixed(2)}`,
    )
    .join("\n");

  let receiptText = `
    MOTOGEAR - Order Receipt
    
    Order #${order.id}
    Date: ${new Date(order.date).toLocaleDateString()}
    
    Items:
    ${receiptItems}
    
    Subtotal: ${order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
    Shipping: ${order.shipping.toFixed(2)}
    Tax: ${order.tax.toFixed(2)}
    
    Total: ${order.total.toFixed(2)}
    
    Payment Method: ${formatPaymentMethod(order.paymentMethod)}
    Payment Amount: ${order.paymentAmount || order.total.toFixed(2)}
    
    Thank you for shopping with MOTOGEAR!
  `;

  console.log("Email Receipt Content:");
  console.log(receiptText);

  // In a real application, this would send an actual email
  // For demonstration purposes, we'll show a success message
  console.log(`✅ Receipt successfully sent to ${email}`);
}

// Format payment method for display
function formatPaymentMethod(method) {
  switch (method) {
    case "credit-card":
      return "Credit Card";
    case "gcash":
      return "GCash";
    case "metrobank":
      return "Metrobank";
    case "security-bank":
      return "Security Bank";
    default:
      return method;
  }
}

// Print receipt function
function printReceipt(order, email) {
  // Create a printable receipt
  const receiptWindow = window.open("", "_blank", "width=600,height=700");

  // Format the receipt items
  let receiptItemsHTML = order.items
    .map(
      (item) =>
        `<tr>
          <td>${item.title} x ${item.quantity}</td>
          <td>${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  // Calculate subtotal
  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Create the receipt HTML
  receiptWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MOTOGEAR - Receipt #${order.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .receipt {
          max-width: 500px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #e74c3c;
          padding-bottom: 10px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .logo span {
          color: #e74c3c;
        }
        .order-info {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f8f8f8;
        }
        .totals {
          margin-top: 20px;
          text-align: right;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .grand-total {
          font-weight: bold;
          font-size: 18px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #ddd;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">MOTO<span>GEAR</span></div>
          <div>Premium Motorcycle Accessories</div>
        </div>
        
        <div class="order-info">
          <p><strong>Receipt #:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Payment Method:</strong> ${formatPaymentMethod(order.paymentMethod)}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${receiptItemsHTML}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for shopping with MOTOGEAR!</p>
          <p>For any questions, please contact us at support@motogear.com</p>
        </div>
      </div>
      <script>
        // Auto print when the window loads
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `);

  receiptWindow.document.close();
}

// Close checkout modal
function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.style.display = "none";
    overlay.classList.remove("active");
  }
}

// Handle navigation
function navigateTo(section) {
  // In a real app, this would change the URL
  const sections = {
    home: document.querySelector(".hero"),
    helmets: document.querySelector(".categories"),
    exhausts: document.querySelector(".categories"),
    lights: document.querySelector(".categories"),
    mirrors: document.querySelector(".categories"),
    products: document.querySelector(".featured-products"),
    deals: document.querySelector(".promo-banner"),
    about: document.querySelector(".about-us"),
    contact: document.querySelector(".contact-us"),
  };

  if (sections[section]) {
    sections[section].scrollIntoView({ behavior: "smooth" });
  }
}

// Search functionality
function searchProducts(query) {
  if (!query || query.trim() === "") {
    return products;
  }

  query = query.toLowerCase().trim();
  return products.filter((product) => {
    return (
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });
}

// Close order history modal
function closeOrderHistoryModal() {
  const modal = document.getElementById("order-history-modal");
  if (modal) {
    modal.style.display = "none";
    overlay.classList.remove("active");
  }
}

// Close favorites modal
function closeFavoritesModal() {
  const modal = document.getElementById("favorites-modal");
  if (modal) {
    modal.style.display = "none";
    overlay.classList.remove("active");
  }
}

// Toggle payment method fields based on selection
function togglePaymentFields() {
  const paymentMethod = document.getElementById("payment-method").value;

  // Hide all payment fields first
  document
    .querySelectorAll(".payment-fields, #credit-card-fields")
    .forEach((field) => {
      field.style.display = "none";
    });

  // Show the relevant fields based on selection
  if (paymentMethod === "credit-card") {
    document.getElementById("credit-card-fields").style.display = "block";
  } else if (paymentMethod) {
    document.getElementById(`${paymentMethod}-fields`).style.display = "block";
  }
}

// Custom Alert Functions
function showCustomAlert(message, title = "Alert") {
  const alertModal = document.getElementById("custom-alert");
  const alertTitle = document.getElementById("custom-alert-title");
  const alertMessage = document.getElementById("custom-alert-message");
  const alertOkButton = document.getElementById("custom-alert-ok");

  alertTitle.textContent = title;
  alertMessage.textContent = message;

  alertModal.style.display = "flex";
  overlay.classList.add("active");

  // Set up event listener for OK button
  const okButtonHandler = function () {
    alertModal.style.display = "none";
    overlay.classList.remove("active");
    alertOkButton.removeEventListener("click", okButtonHandler);
  };

  alertOkButton.addEventListener("click", okButtonHandler);

  // Also close when clicking the X button
  document
    .querySelector(".close-custom-alert")
    .addEventListener("click", okButtonHandler);
}

function showPurchaseSuccessAlert(order, userEmail) {
  const successAlert = document.getElementById("purchase-success-alert");
  const successOkButton = document.getElementById("purchase-success-ok");

  successAlert.style.display = "flex";
  overlay.classList.add("active");

  // Set up event listener for OK button
  const okButtonHandler = function () {
    successAlert.style.display = "none";
    showReceiptConfirmation(order, userEmail);
    successOkButton.removeEventListener("click", okButtonHandler);
  };

  successOkButton.addEventListener("click", okButtonHandler);
}

function showReceiptConfirmation(order, userEmail) {
  const receiptAlert = document.getElementById("receipt-confirmation-alert");
  const yesButton = document.getElementById("print-receipt-yes");
  const noButton = document.getElementById("print-receipt-no");

  receiptAlert.style.display = "flex";
  overlay.classList.add("active");

  // Set up event listeners for Yes/No buttons
  const yesButtonHandler = function () {
    receiptAlert.style.display = "none";
    printReceipt(order, userEmail);
    showThankYouAlert();
    yesButton.removeEventListener("click", yesButtonHandler);
    noButton.removeEventListener("click", noButtonHandler);
  };

  const noButtonHandler = function () {
    receiptAlert.style.display = "none";
    showThankYouAlert();
    yesButton.removeEventListener("click", yesButtonHandler);
    noButton.removeEventListener("click", noButtonHandler);
  };

  yesButton.addEventListener("click", yesButtonHandler);
  noButton.addEventListener("click", noButtonHandler);
}

function showThankYouAlert() {
  const thankYouAlert = document.getElementById("thank-you-alert");
  const okButton = document.getElementById("thank-you-ok");

  thankYouAlert.style.display = "flex";
  overlay.classList.add("active");

  // Set up event listener for OK button
  const okButtonHandler = function () {
    thankYouAlert.style.display = "none";
    overlay.classList.remove("active");
    okButton.removeEventListener("click", okButtonHandler);
  };

  okButton.addEventListener("click", okButtonHandler);
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  loadFeaturedProducts();
  updateCart();
  updateAuthUI();

  // Search functionality
  const searchInput = document.querySelector(".search-box input");
  const searchBtn = document.querySelector(".search-btn");

  function performSearch() {
    const query = searchInput.value;
    const searchResults = searchProducts(query);

    // Update section title to show search results
    const sectionTitle = document.querySelector(
      ".featured-products .section-title",
    );
    if (query && query.trim() !== "") {
      sectionTitle.textContent = `SEARCH RESULTS FOR "${query.toUpperCase()}"`;
    } else {
      sectionTitle.textContent = "FEATURED PRODUCTS";
    }

    // Scroll to results
    document
      .querySelector(".featured-products")
      .scrollIntoView({ behavior: "smooth" });

    // Load the filtered products
    loadFeaturedProducts(searchResults);
  }

  // Search button click
  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    performSearch();
  });

  // Search on Enter key
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  // Mobile search form
  const mobileSearchForm = document.querySelector(".mobile-search-form");
  if (mobileSearchForm) {
    mobileSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const mobileQuery = document.querySelector(".mobile-search-input").value;
      searchInput.value = mobileQuery; // Sync the search values
      performSearch();
    });
  }

  // Cart button
  cartBtn.addEventListener("click", function () {
    if (cartOpen) {
      closeCart();
    } else {
      openCart();
    }
  });

  closeCartBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", function (e) {
    // Only close if clicking directly on the overlay, not on modals
    if (e.target === overlay) {
      closeCart();
      closeAuthModal();
      closeCheckoutModal();
    }
  });

  // Category cards click event
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.querySelector("h3").textContent;
      navigateTo(category.toLowerCase());
    });
  });

  // Shop now button
  document
    .querySelector(".hero .btn-primary")
    .addEventListener("click", function () {
      navigateTo("products");
    });

  // Promo banner button
  document
    .querySelector(".promo-banner .btn-accent")
    .addEventListener("click", function () {
      navigateTo("deals");
    });

  // Navigation links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.textContent.toLowerCase();
      navigateTo(section);

      // Update active state
      document
        .querySelectorAll(".nav-links a")
        .forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Footer links
  document.querySelectorAll(".footer-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.getAttribute("data-section");
      navigateTo(section);
    });
  });

  // Contact form submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("contact-name").value;
      const email = document.getElementById("contact-email").value;
      const subject = document.getElementById("contact-subject").value;
      const message = document.getElementById("contact-message").value;

      // In a real app, this would send the form data to a server
      console.log("Contact form submitted:", { name, email, subject, message });

      // Show success message
      showCustomAlert(
        "Thank you for your message! We'll get back to you soon.",
        "Message Sent",
      );

      // Reset form
      contactForm.reset();
    });
  }

  // Account button
  document.querySelector(".account-btn").addEventListener("click", function () {
    if (isLoggedIn) {
      // Show user menu
      const userMenu = document.getElementById("user-menu");
      if (userMenu) {
        userMenu.style.display =
          userMenu.style.display === "block" ? "none" : "block";
      }
    } else {
      showAuthModal("login");
    }
  });

  // Auth modal tabs
  document.getElementById("login-tab").addEventListener("click", function () {
    showAuthModal("login");
  });

  document
    .getElementById("register-tab")
    .addEventListener("click", function () {
      showAuthModal("register");
    });

  // Close auth modal button
  document
    .querySelector(".close-auth-modal")
    .addEventListener("click", closeAuthModal);

  // Login form submission
  document
    .getElementById("login-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (login(email, password)) {
        closeAuthModal();
        alert(`Welcome back, ${currentUser.name}!`);
      } else {
        alert("Invalid email or password");
      }
    });

  // Register form submission
  document
    .getElementById("register-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById(
        "register-confirm-password",
      ).value;

      if (register(name, email, password, confirmPassword)) {
        closeAuthModal();
        alert(`Welcome, ${name}! Your account has been created.`);
      } else {
        alert("Please check your information and try again");
      }
    });

  // Logout button
  document.getElementById("logout-btn").addEventListener("click", function () {
    logout();
    document.getElementById("user-menu").style.display = "none";
    alert("You have been logged out");
  });

  // Checkout button in cart
  document
    .querySelector(".checkout-btn")
    .addEventListener("click", processCheckout);

  // Close checkout modal button
  document
    .querySelector(".close-checkout-modal")
    .addEventListener("click", closeCheckoutModal);

  // Place order button
  document
    .getElementById("place-order-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      completeOrder();
    });

  // Payment method change
  const paymentMethodSelect = document.getElementById("payment-method");
  if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener("change", togglePaymentFields);
    // Initialize payment fields visibility
    togglePaymentFields();
  }

  // Close order history modal button
  document
    .querySelector(".close-order-history-modal")
    .addEventListener("click", closeOrderHistoryModal);

  // Close favorites modal button
  document
    .querySelector(".close-favorites-modal")
    .addEventListener("click", closeFavoritesModal);

  // Initialize user menu if logged in
  if (isLoggedIn) {
    updateUserMenu();
  }
});
