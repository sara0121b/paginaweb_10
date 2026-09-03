(() => {
  const storageKey = "meduza-cart";

  function getStoredCart() {
    try {
      const savedCart = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
      return [];
    }
  }

  let cart = getStoredCart();

  const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-CO")}`;

  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      // Ignore storage limitations in private browsing or blocked contexts.
    }
    renderCart();
  }

  function getProduct(button) {
    const card = button.closest(".product-item");
    if (!card) return null;

    const title = card.querySelector("h3")?.textContent.trim() || "Producto Meduza";
    const description = card.querySelector("p")?.textContent.trim() || "Maquillaje Meduza";
    const image = card.querySelector("img")?.getAttribute("src") || "";
    const priceText = card.querySelector(".product-info-row strong")?.textContent || "0";
    const price = Number(String(priceText).replace(/[^\d]/g, "")) || 0;

    return {
      id: `${title}-${price}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title,
      description,
      image,
      price,
    };
  }

  function addProduct(product) {
    if (!product) return;

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
  }

  function updateQuantity(id, amount) {
    const item = cart.find((product) => product.id === id);
    if (!item) return;

    item.quantity += amount;
    cart = cart.filter((product) => product.quantity > 0);
    saveCart();
  }

  function removeProduct(id) {
    cart = cart.filter((product) => product.id !== id);
    saveCart();
  }

  function createDrawer() {
    const existingDrawer = document.querySelector(".cart-drawer");
    if (existingDrawer) {
      return existingDrawer;
    }

    const drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.setAttribute("aria-label", "Carrito de compras");
    drawer.innerHTML = `
      <div class="cart-backdrop" data-action="close"></div>
      <div class="cart-panel">
        <div class="cart-header">
          <div>
            <p class="mini-tag">Meduza</p>
            <div class="cart-title">Tu carrito <span class="cart-count">0</span></div>
          </div>
          <button type="button" class="close-cart" data-action="close" aria-label="Cerrar carrito">&times;</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
          <div><span>Total</span><span class="cart-total">$0</span></div>
          <a class="checkout-btn" href="formulario.html">Finalizar compra</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
    return drawer;
  }

  function renderCart() {
    const drawer = createDrawer();
    const itemsContainer = drawer.querySelector(".cart-items");
    const totalElement = drawer.querySelector(".cart-total");
    const countElements = drawer.querySelectorAll(".cart-count");

    if (!itemsContainer || !totalElement) return;

    const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

    document.querySelectorAll(".cart-btn").forEach((button) => {
      let count = button.querySelector(".cart-count");
      if (!count) {
        count = document.createElement("span");
        count.className = "cart-count";
        button.appendChild(count);
      }
      count.textContent = totalItems;
      count.hidden = totalItems === 0;
    });

    countElements.forEach((element) => {
      element.textContent = totalItems;
      element.hidden = totalItems === 0;
    });

    totalElement.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
      itemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
      return;
    }

    itemsContainer.innerHTML = cart
      .map(
        (item) => `
          <article class="cart-item">
            <div class="cart-item-details">
              <div class="cart-product-name">${item.title}</div>
              <div class="cart-product-price">${formatPrice(item.price)}</div>
              <div class="quantity-controls">
                <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="increase" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                <button type="button" class="remove-item" data-action="remove" data-id="${item.id}">Eliminar</button>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  }

  function openCart() {
    const drawer = document.querySelector(".cart-drawer");
    if (!drawer) return;
    drawer.classList.add("is-open");
    document.body.classList.add("cart-is-open");
  }

  function closeCart() {
    const drawer = document.querySelector(".cart-drawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    document.body.classList.remove("cart-is-open");
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-btn");
    if (addButton) {
      addProduct(getProduct(addButton));
      openCart();
      return;
    }

    const cartButton = event.target.closest(".cart-btn");
    if (cartButton) {
      const drawer = document.querySelector(".cart-drawer");
      if (drawer?.classList.contains("is-open")) {
        closeCart();
      } else {
        openCart();
      }
      return;
    }

    const checkoutButton = event.target.closest(".checkout-btn");
    if (checkoutButton) {
      window.location.href = "formulario.html";
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const { action, id } = actionButton.dataset;
    if (action === "close") closeCart();
    if (action === "increase") updateQuantity(id, 1);
    if (action === "decrease") updateQuantity(id, -1);
    if (action === "remove") removeProduct(id);
  });

  createDrawer();
  renderCart();
})();
