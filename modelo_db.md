Modelo de la Base de Datos (Mongodb)

users = {
  _id: ObjectId("..."),
  first_name: String,
  last_name: String,
  email: String,            // Único
  password_hash: String,
  phone: String,
  address: {
    street: String,
    number: String,
    city: String
  },
  role: String,             // "client" | "staff" | "admin"
  created_at: Date,
  updated_at: Date,
  deleted_at: Date          // null si está activo
}

menu_items = {
  _id: ObjectId("..."),
  name: String,
  description: String,
  category: String,         // "dulce" | "salado"
  price: Number,            // Entero en centavos
  image_url: String,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date          // null si está activo
}

orders = {
  _id: ObjectId("..."),
  order_number: String,     // Único
  client_id: ObjectId("..."), // ref users
  status: String,           // "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  items: [
    {
      item_id: ObjectId("..."), // ref menu_items
      name: String,
      quantity: Number,
      unit_price: Number    // Entero en centavos
    }
  ],
  delivery: {
    type: String,           // "pickup" | "delivery"
    address: {
      street: String,
      number: String,
      city: String
    }
  },
  notes: String,
  total: Number,            // Entero en centavos
  created_at: Date,
  updated_at: Date,
  deleted_at: Date          // null si está activo
}

catering_events = {
  _id: ObjectId("..."),
  client_id: ObjectId("..."), // ref users
  status: String,           // "requested" | "quoted" | "confirmed" | "completed" | "cancelled"
  event_date: Date,
  catering_type: String,    // "buffet" | "plated" | "food_station" | "drop_off" | "passed_hors_doeuvres"
  event_location: {
    street: String,
    number: String,
    city: String
  },
  details: String,
  guest_count: Number,
  price_per_person: Number, // Entero en centavos
  total: Number,            // Entero en centavos
  payment_status: String,   // "unpaid" | "deposit_paid" | "paid_in_full"
  assigned_crew: [
    {
      crew_id: ObjectId("...") // ref catering_crew  
    }
  ],
  created_at: Date,
  updated_at: Date,
  deleted_at: Date          // null si está activo
}

catering_crew = {
  _id: ObjectId("..."),
  first_name: String,
  last_name: String,
  phone: String,
  role: String,             // "chef" | "waiter" | "delivery" | "catering_manager"
  created_at: Date,
  updated_at: Date,
  deleted_at: Date          // null = activo (disponible) | Fecha = dado de baja
}