# Modelo de la Base de Datos (MongoDB)

Convenciones:
- Colecciones y campos en `snake_case`.
- Precios y totales como entero en centavos.
- Todas las colecciones llevan `_id`, `created_at`, `updated_at` y `deleted_at` (`null` = activo).
- `ref` indica una referencia a otra colección.

---

## Colecciones

### `users`

| Campo | Tipo | Detalle |
| :--- | :--- | :--- |
| `first_name` | String | |
| `last_name` | String | |
| `email` | String | Único |
| `password_hash` | String | Hasheada con bcrypt |
| `phone` | String | |
| `address` | Object | `{ street, number, city }` |
| `role` | String | `client` \| `staff` \| `admin` |

### `menu_items`

| Campo | Tipo | Detalle |
| :--- | :--- | :--- |
| `name` | String | |
| `description` | String | |
| `category` | String | `dulce` \| `salado` |
| `price` | Number | Centavos |
| `image_url` | String | |

### `orders`

| Campo | Tipo | Detalle |
| :--- | :--- | :--- |
| `order_number` | String | Único |
| `client_id` | ObjectId | ref `users` |
| `status` | String | `pending` \| `confirmed` \| `preparing` \| `ready` \| `delivered` \| `cancelled` |
| `items` | Array | `[{ item_id (ref menu_items), name, quantity, unit_price }]` |
| `delivery` | Object | `{ type: pickup \| delivery, address: { street, number, city } }` |
| `notes` | String | |
| `total` | Number | Centavos |

### `catering_events`

| Campo | Tipo | Detalle |
| :--- | :--- | :--- |
| `client_id` | ObjectId | ref `users` |
| `status` | String | `requested` \| `quoted` \| `confirmed` \| `completed` \| `cancelled` |
| `event_date` | Date | |
| `catering_type` | String | `buffet` \| `plated` \| `food_station` \| `drop_off` \| `passed_hors_doeuvres` |
| `event_location` | Object | `{ street, number, city }` |
| `details` | String | |
| `guest_count` | Number | |
| `price_per_person` | Number | Centavos |
| `total` | Number | Centavos |
| `payment_status` | String | `unpaid` \| `deposit_paid` \| `paid_in_full` |
| `assigned_crew` | Array | `[{ crew_id (ref catering_crew) }]` |

### `catering_crew`

| Campo | Tipo | Detalle |
| :--- | :--- | :--- |
| `first_name` | String | |
| `last_name` | String | |
| `phone` | String | |
| `role` | String | `chef` \| `waiter` \| `delivery` \| `catering_manager` |

---

## Relaciones

| Desde | Hacia | Campo |
| :--- | :--- | :--- |
| `orders` | `users` | `client_id` |
| `orders` | `menu_items` | `items.item_id` |
| `catering_events` | `users` | `client_id` |
| `catering_events` | `catering_crew` | `assigned_crew.crew_id` |