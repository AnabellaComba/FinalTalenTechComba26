# API- Rest - Backend NodeJS 
  ## Comba Anabella - Cafetería "Noventa"

Proyecto final de Back-End con Node.js, Express, Firebase Firestore y JWT.

## Instalacion del proyecto

```bash
npm install
```

## Ejecutar servidor

```bash
npm run start
```

El servidor queda disponible en:

```txt
http://localhost:3000
```

## Deploy en Vercel

Vercel permite publicar esta API Express como una funcion serverless. El archivo `index.js` exporta `app` para Vercel y usa `app.listen` solamente cuando se ejecuta localmente con `npm run start`.

El rol `admin` puede crear, editar, actualizar y eliminar productos. El rol `user` solo puede consultar productos.

## Rutas

```txt
POST   /auth/login
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

Las rutas `GET` requieren un token valido de usuario o administrador. Las rutas `POST`, `PUT`, `PATCH` y `DELETE` requieren un token con rol `admin`.

## CORS

La API configura CORS desde `src/config/cors.config.js`, con una estructura similar a la vista en clase:

```js
app.use(cors(corsConfig));
```

Los metodos permitidos son `GET`, `POST`, `PUT`, `PATCH` y `DELETE`. Los headers permitidos son `Content-Type` y `Authorization`.

## Cargar productos iniciales

Con Firebase configurado en `.env`:

```bash
npm run seed
```

## Variables de entorno

```env
PORT=
JWT_SECRET=
JWT_EXPIRES_IN=
CORS_ORIGINS=
ADMIN_EMAIL=
ADMIN_PASSWORD=
USER_EMAIL=
USER_PASSWORD=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
FIRESTORE_PRODUCTS_COLLECTION=
FIRESTORE_USERS_COLLECTION=
```
