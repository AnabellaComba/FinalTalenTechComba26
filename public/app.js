import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const categories = ["cafeteria", "bebidas sin alcohol", "dulce", "salados"];

const state = {
  adminToken: localStorage.getItem("adminToken"),
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
  products: window.menuProducts || []
};

const firebaseApp = initializeApp(window.firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const sessionButton = document.querySelector("#sessionButton");
const loginBox = document.querySelector("#loginBox");
const loginForm = document.querySelector("#loginForm");
const authMessage = document.querySelector("#authMessage");
const googleLoginButton = document.querySelector("#googleLoginButton");
const logoutButton = document.querySelector("#logoutButton");
const menuBoard = document.querySelector("#menuBoard");
const adminTools = document.querySelector("#adminTools");
const editProductForm = document.querySelector("#editProductForm");
const cancelEditButton = document.querySelector("#cancelEditButton");

const formatPrice = (price) => `$ ${new Intl.NumberFormat("es-AR").format(price)}`;

const isAdmin = () => state.currentUser?.role === "admin" && state.adminToken;

const setMessage = (message, type = "") => {
  authMessage.textContent = message;
  authMessage.className = `message ${type}`.trim();
};

const saveSession = () => {
  if (state.adminToken) {
    localStorage.setItem("adminToken", state.adminToken);
  } else {
    localStorage.removeItem("adminToken");
  }

  if (state.currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem("currentUser");
  }
};

const updateSessionButton = () => {
  if (!state.currentUser) {
    sessionButton.textContent = "Registrarse/Login";
    adminTools.hidden = true;
    return;
  }

  if (isAdmin()) {
    sessionButton.textContent = `Admin: ${state.currentUser.name || state.currentUser.email}`;
    adminTools.hidden = false;
    return;
  }

  sessionButton.textContent = state.currentUser.email;
  adminTools.hidden = true;
};

const showTab = (tabName) => {
  loginBox.hidden = true;
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  panels.forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tabName}`));
};

const requestApi = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.adminToken}`,
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "No se pudo completar la operacion.");
  }

  return data;
};

const renderProduct = (product) => {
  const canEditProduct = isAdmin() && product.id;

  return `
    <article class="menu-product" data-id="${product.id || ""}" data-category="${product.category}">
      <div class="product-main">
        <div>
          <h3>${product.name}</h3>
          <p>${product.description || "Producto de la casa."}</p>
        </div>
        <strong>${formatPrice(product.price)}</strong>
      </div>
      <div class="admin-actions" ${canEditProduct ? "" : "hidden"}>
        <button type="button" class="secondary edit-product">editar</button>
        <button type="button" class="danger delete-product">eliminar</button>
      </div>
    </article>`;
};

const renderMenu = () => {
  menuBoard.innerHTML = categories
    .map((category) => {
      const products = state.products.filter((product) => product.category === category);

      return `
        <section class="menu-section" data-category="${category}">
          <h2>${category}</h2>
          <div class="items" data-products="${category}">
            ${products.map(renderProduct).join("")}
          </div>
          ${category === "salados" ? '<p class="note">*incluye ensalada de estacion y una bebida sin alcohol.</p>' : ""}
          <form class="add-product-form" data-category="${category}" ${isAdmin() ? "" : "hidden"}>
            <input type="text" name="name" placeholder="producto" required />
            <input type="number" name="price" placeholder="precio" min="1" required />
            <input type="text" name="description" placeholder="descripcion" required />
            <button type="submit">agregar</button>
          </form>
        </section>`;
    })
    .join("");
};

const loadProducts = async () => {
  if (!isAdmin()) {
    state.products = window.menuProducts || [];
    renderMenu();
    return;
  }

  try {
    const products = await requestApi("/api/products");
    state.products = products.length ? products : window.menuProducts;
    renderMenu();
  } catch (error) {
    setMessage(error.message, "error");
  }
};

const resetEditForm = () => {
  editProductForm.reset();
  editProductForm.elements.id.value = "";
  editProductForm.elements.category.value = "";
};

sessionButton.addEventListener("click", () => {
  loginBox.hidden = !loginBox.hidden;
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showTab(tab.dataset.tab));
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Credenciales invalidas.");
    }

    state.adminToken = data.token;
    state.currentUser = data.user;
    saveSession();
    updateSessionButton();
    loginBox.hidden = true;
    setMessage("sesion iniciada", "success");
    await loadProducts();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

googleLoginButton.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    state.adminToken = null;
    state.currentUser = {
      email: result.user.email,
      name: result.user.email,
      role: "user"
    };
    saveSession();
    updateSessionButton();
    loginBox.hidden = true;
    setMessage("sesion iniciada con Google", "success");
    await loadProducts();
  } catch (error) {
    setMessage("No se pudo iniciar sesion con Google.", "error");
  }
});

logoutButton.addEventListener("click", async () => {
  state.adminToken = null;
  state.currentUser = null;
  await signOut(auth).catch(() => {});
  saveSession();
  resetEditForm();
  updateSessionButton();
  loginBox.hidden = true;
  setMessage("sesion cerrada", "success");
  await loadProducts();
});

menuBoard.addEventListener("submit", async (event) => {
  const form = event.target.closest(".add-product-form");

  if (!form) {
    return;
  }

  event.preventDefault();

  if (!isAdmin()) {
    setMessage("Solo el administrador puede agregar productos.", "error");
    return;
  }

  const formData = new FormData(form);
  const product = {
    name: formData.get("name"),
    category: form.dataset.category,
    price: Number(formData.get("price")),
    description: formData.get("description"),
    currency: "ARS",
    imageUrl: "",
    available: true
  };

  try {
    await requestApi("/api/products", {
      method: "POST",
      body: JSON.stringify(product)
    });
    form.reset();
    await loadProducts();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

menuBoard.addEventListener("click", async (event) => {
  const productElement = event.target.closest(".menu-product");

  if (!productElement || !isAdmin()) {
    return;
  }

  const product = state.products.find((item) => item.id === productElement.dataset.id);

  if (event.target.classList.contains("edit-product") && product) {
    editProductForm.elements.id.value = product.id;
    editProductForm.elements.category.value = product.category;
    editProductForm.elements.name.value = product.name;
    editProductForm.elements.price.value = product.price;
    editProductForm.elements.description.value = product.description || "";
    editProductForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (event.target.classList.contains("delete-product")) {
    try {
      await requestApi(`/api/products/${productElement.dataset.id}`, { method: "DELETE" });
      await loadProducts();
    } catch (error) {
      setMessage(error.message, "error");
    }
  }
});

editProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isAdmin()) {
    return;
  }

  const formData = new FormData(editProductForm);
  const id = formData.get("id");

  if (!id) {
    setMessage("Elegi un producto para editar.", "error");
    return;
  }

  const product = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    description: formData.get("description"),
    currency: "ARS",
    imageUrl: "",
    available: true
  };

  try {
    await requestApi(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product)
    });
    resetEditForm();
    await loadProducts();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

cancelEditButton.addEventListener("click", resetEditForm);

updateSessionButton();
loadProducts();

