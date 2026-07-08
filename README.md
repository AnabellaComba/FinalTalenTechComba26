# APIRest - Backend NodeJS 
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

Pasos recomendados:

1. Subir el repositorio a GitHub.
2. Entrar a Vercel e importar el repositorio.
3. Configurar las variables de entorno del proyecto en Vercel.
4. Hacer deploy.
5. Entregar la URL generada, por ejemplo:

```txt
https://nombre-del-proyecto.vercel.app
```

En Vercel deben cargarse las mismas variables del `.env`, excepto `PORT`, porque Vercel administra el puerto internamente. Para CORS se puede usar:

```env
CORS_ORIGINS=https://nombre-del-proyecto.vercel.app
```

Tambien se puede usar `CORS_ORIGINS=*` para pruebas o si el curso pide una configuracion abierta como la vista en clase.

Si Vercel muestra `404: NOT_FOUND`, revisar que el archivo `vercel.json` este subido al repositorio. Ese archivo fuerza que las rutas `/`, `/auth/login` y `/api/products` entren a `index.js`.

## Autenticacion

Para iniciar sesion:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

La respuesta devuelve un token. Para usar las rutas de productos hay que enviarlo asi:

```http
Authorization: Bearer TU_TOKEN
```

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
