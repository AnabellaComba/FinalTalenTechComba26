const categoryTitles = {
  cafeteria: "cafeteria",
  "bebidas sin alcohol": "bebidas sin alcohol",
  dulce: "dulce",
  salados: "salados"
};

const formatPrice = (price) => `$ ${new Intl.NumberFormat("es-AR").format(price)}`;

const renderProduct = (product) => `
  <article class="menu-product" data-id="${product.id || ""}" data-category="${product.category}">
    <div class="product-main">
      <div>
        <h3>${product.name}</h3>
        <p>${product.description || "Producto de la casa."}</p>
      </div>
      <strong>${formatPrice(product.price)}</strong>
    </div>
    <div class="admin-actions" hidden>
      <button type="button" class="secondary edit-product">editar</button>
      <button type="button" class="danger delete-product">eliminar</button>
    </div>
  </article>`;

const renderSection = (category, products) => {
  const items = products.filter((product) => product.category === category);

  return `
    <section class="menu-section" data-category="${category}">
      <h2>${categoryTitles[category]}</h2>
      <div class="items" data-products="${category}">
        ${items.map(renderProduct).join("")}
      </div>
      ${category === "salados" ? '<p class="note">*incluye ensalada de estacion y una bebida sin alcohol.</p>' : ""}
      <form class="add-product-form" data-category="${category}" hidden>
        <input type="text" name="name" placeholder="producto" required />
        <input type="number" name="price" placeholder="precio" min="1" required />
        <input type="text" name="description" placeholder="descripcion" required />
        <button type="submit">agregar</button>
      </form>
    </section>`;
};

export const renderHome = (products, firebaseConfig) => {
  const categories = Object.keys(categoryTitles);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Noventa Cafeteria</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <main class="shell">
    <aside class="brand-panel" aria-label="Noventa">
      <span>NOVENTA</span>
    </aside>

    <section class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">cafeteria</p>
          <h1>Noventa</h1>
        </div>

        <div class="login-area">
          <button class="session" id="sessionButton" type="button">Registrarse/Login</button>
          <div class="login-box" id="loginBox" hidden>
            <form id="loginForm">
              <label>
                usuario
                <input type="email" name="email" placeholder="admin@gmail.com" required />
              </label>
              <label>
                password
                <input type="password" name="password" placeholder="password" required />
              </label>
              <button type="submit">ingresar</button>
            </form>
            <button type="button" class="secondary full" id="googleLoginButton">ingresar con Google</button>
            <button type="button" class="secondary full" id="logoutButton">cerrar sesion</button>
            <p class="message" id="authMessage"></p>
          </div>
        </div>
      </header>

      <nav class="tabs" aria-label="Secciones">
        <button class="tab active" type="button" data-tab="menu">menu</button>
        <button class="tab" type="button" data-tab="contactanos">contactanos</button>
      </nav>

      <section class="tab-panel active" id="tab-menu">
        <div class="admin-tools" id="adminTools" hidden>
          <form class="edit-form" id="editProductForm">
            <input type="hidden" name="id" />
            <input type="hidden" name="category" />
            <input type="text" name="name" placeholder="producto" required />
            <input type="number" name="price" placeholder="precio" min="1" required />
            <input type="text" name="description" placeholder="descripcion" required />
            <button type="submit">guardar cambios</button>
            <button type="button" class="secondary" id="cancelEditButton">cancelar</button>
          </form>
        </div>

        <div class="menu-board" id="menuBoard">
          ${categories.map((category) => renderSection(category, products)).join("")}
        </div>
      </section>

      <section class="tab-panel" id="tab-contactanos">
        <div class="contact-panel">
          <h2>contactanos</h2>
          <a href="https://www.instagram.com/noventa.concept/" target="_blank" rel="noreferrer">@noventa.concept</a>
          <p>Specialty Coffee & Aperitivos</p>
          <p>Viamonte 1649</p>
          <p>Lun-Sab desde las 8 AM</p>
        </div>
      </section>
    </section>
  </main>

  <script>
    window.menuProducts = ${JSON.stringify(products)};
    window.firebaseConfig = ${JSON.stringify(firebaseConfig)};
  </script>
  <script type="module" src="/app.js"></script>
</body>
</html>`;
};
