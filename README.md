# Project UTN - Backend

**Backend de una tienda de comidas**
tienda:
- en principio el back se prepara para que el cliente pueda hacer pedidos tanto de comida por delivery o un servicio de catering
- el staff lo usaria en el local generando ordenes tanto del local como delivery
catering:
- el catering funciona separado del staff del local, la relacion es directamente cliente - admin que en este caso cumple como organizador
- si crece el negocio de catering se puede agregar otro rol o directamente separarlo de la tienda (de momento es un agregado)
- el admin/organizador recibe llamados y crea eventos o directamente modifica y revisa eventos creados por el cliente 

---

## Tecnologías y Stack
*   **Entorno:** [Node.js](https://nodejs.org/) (versión 24.14.0)
*   **Framework:** [Express](https://expressjs.com/) (versión 5.2.1)
*   **Base de Datos:** [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/) (versión 9.11.1)
*   **Control de versiones:** Git / GitHub

---

## Estructura del Proyecto

```text
├── config/         # Conexión a base de datos (db.js)
├── models/         # Esquemas y modelos de la base de datos (Mongoose)
├── services/       # Lógica de negocio y consultas a Mongoose
├── controllers/    # Capa HTTP: leen req, llaman al servicio y arman res
├── routes/         # Definición de rutas y endpoints de la API
├── middleware/     # verifyToken (JWT), requireRole (roles) y errorHandler
├── utils/          # ErrorApp y constantes (roles)
├── app.js          # Configuración de la aplicación Express
└── server.js       # Punto de entrada que arranca el servidor
```
## Poblamiento de la Base de Datos (Seed)

El proyecto incluye un script de **Seed** para inicializar la base de datos local con los documentos de prueba requeridos por el trabajo práctico (usuarios, ítems de menú, órdenes, personal de catering y eventos).

### Requisitos Previos

1. Tener MongoDB corriendo localmente (o disponer de un cluster en MongoDB Atlas).
2. Contar con un archivo `.env` en la raíz del proyecto configurado con la variable `MONGO_URI`.
3. usar **npm run seed**

## Endpoints Principales (API Reference)

### Menú — `/api/menu-items`

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu-items` | Lista los platos activos (filtro opcional `?category=dulce\|salado`) | Público |
| `GET` | `/api/menu-items/:id` | Obtiene un plato por ID | Público |
| `POST` | `/api/menu-items` | Crea un plato | Admin |
| `PUT` | `/api/menu-items/:id` | Actualiza un plato | Admin |
| `PATCH` | `/api/menu-items/:id/deactivate` | Baja lógica (soft delete) | Admin |
| `DELETE` | `/api/menu-items/:id` | Eliminación física (solo por la consigna) | Admin |

### Usuarios — `/api/users`

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Registra un usuario (siempre con rol `client`) | Público |
| `POST` | `/api/users/login` | Inicia sesión y devuelve el token JWT | Público |
| `GET` | `/api/users` | Lista los usuarios | Admin |
| `POST` | `/api/users` | Crea un usuario con el rol indicado | Admin |
| `GET` | `/api/users/:id` | Obtiene un usuario por ID | Admin |
| `PUT` | `/api/users/:id` | Actualiza un usuario | Admin |
| `PATCH` | `/api/users/:id/deactivate` | Baja lógica (soft delete) | Admin |

### Pedidos — `/api/orders`

Todas las rutas requieren token.

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Crea un pedido. El cliente pide para sí mismo; staff y admin envían `client_id`. Precios y total salen de la base | Cualquier rol |
| `GET` | `/api/orders` | Lista pedidos (filtro opcional `?status=`). El cliente ve solo los suyos | Cualquier rol |
| `GET` | `/api/orders/:id` | Obtiene un pedido. El cliente solo puede ver los suyos | Cualquier rol |
| `PUT` | `/api/orders/:id` | Corrige un pedido (solo en estado `pending` o `confirmed`) | Admin, Staff |
| `PATCH` | `/api/orders/:id/status` | Cambia el estado respetando las transiciones permitidas | Admin, Staff |
| `PATCH` | `/api/orders/:id/cancel` | El cliente cancela su pedido, solo si está `pending` | Client |
| `PATCH` | `/api/orders/:id/deactivate` | Baja lógica (soft delete) | Admin |
| `DELETE` | `/api/orders/:id` | Eliminación física (solo por la consigna) | Admin |

Transiciones de estado permitidas:

| Desde | Hacia |
| :--- | :--- |
| `pending` | `confirmed`, `cancelled` |
| `confirmed` | `preparing`, `cancelled` |
| `preparing` | `ready`, `cancelled` |
| `ready` | `delivered` |
| `delivered`, `cancelled` | (estados finales) |