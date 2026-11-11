require('dotenv').config(); 
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tienda_db";

// ==========================================
// DEFINICIÓN DE MODELOS (Mongoose Schemas)
// ==========================================
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  address: Object,
  role: String,
  created_at: Date
});

const menuItemSchema = new mongoose.Schema({
  item_name: String,
  price_per_unit: mongoose.Types.Decimal128
});

const orderSchema = new mongoose.Schema({
  order_number: String,
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  items: [{
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: Number,
    unit_price: mongoose.Types.Decimal128
  }],
  created_at: Date
});

const cateringStaffSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone: String,
  role: String
});

const cateringEventSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_event: Date,
  catering_type: String,
  event_location: Object,
  details: String,
  price_per_person: mongoose.Types.Decimal128,
  guest_count: Number,
  payment_status: String,
  assigned_staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CateringStaff' }]
});

const User = mongoose.model('User', userSchema, 'users');
const MenuItem = mongoose.model('MenuItem', menuItemSchema, 'menu_items');
const Order = mongoose.model('Order', orderSchema, 'orders');
const CateringStaff = mongoose.model('CateringStaff', cateringStaffSchema, 'catering_staff');
const CateringEvent = mongoose.model('CateringEvent', cateringEventSchema, 'catering_events');

// ==========================================
// DATOS DE EJEMPLO (Basados en el Punto 5)
// ==========================================
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 Conectado exitosamente a MongoDB para realizar el seed...");

    // 1. Limpiar colecciones anteriores
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await CateringStaff.deleteMany({});
    await CateringEvent.deleteMany({});
    console.log("🧹 Colecciones limpiadas correctamente.");

    // 2. Insertar Usuarios
    const users = await User.insertMany([
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        first_name: "Lucía", last_name: "Gómez",
        email: "lucia.gomez@mail.com", phone: "1145678901",
        address: { calle: "Av. Rivadavia", altura: "2450", ciudad: "CABA" },
        role: "client", created_at: new Date("2026-03-10T14:20:00Z")
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
        first_name: "Mateo", last_name: "Fernández",
        email: "mateo.fernandez@mail.com", phone: "1138920147",
        address: { calle: "Calle Corrientes", altura: "1380", ciudad: "CABA" },
        role: "client", created_at: new Date("2026-03-11T09:15:00Z")
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
        first_name: "Sofía", last_name: "Martinez",
        email: "sofia.martinez@mail.com", phone: "1156128493",
        address: { calle: "Av. Santa Fe", altura: "3210", ciudad: "CABA" },
        role: "staff", created_at: new Date("2026-03-12T11:45:30Z")
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"),
        first_name: "Joaquin", last_name: "López",
        email: "joaquin.lopez@mail.com", phone: "1147029384",
        address: { calle: "Calle Belgrano", altura: "850", ciudad: "CABA" },
        role: "client", created_at: new Date("2026-03-13T16:05:12Z")
      },
      {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439015"),
        first_name: "Valentina", last_name: "Díaz",
        email: "valentina.diaz@mail.com", phone: "1162391045",
        address: { calle: "Av. Cabildo", altura: "1940", ciudad: "CABA" },
        role: "staff", created_at: new Date("2026-03-14T18:30:00Z")
      }
    ]);
    console.log("👤 Usuarios insertados.");

    // 3. Insertar Menu Items
    const menuItems = await MenuItem.insertMany([
      { _id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a1"), item_name: "Empanada de carne", price_per_unit: mongoose.Types.Decimal128.fromString("450.00") },
      { _id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a2"), item_name: "Bollo Dulce", price_per_unit: mongoose.Types.Decimal128.fromString("400.00") },
      { _id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a3"), item_name: "Empanada de Pollo", price_per_unit: mongoose.Types.Decimal128.fromString("450.00") },
      { _id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a4"), item_name: "Medialuna de Manteca", price_per_unit: mongoose.Types.Decimal128.fromString("350.00") },
      { _id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a5"), item_name: "Pastelito de Membrillo", price_per_unit: mongoose.Types.Decimal128.fromString("250.00") }
    ]);
    console.log("🍔 Menú insertado.");

    // 4. Insertar Órdenes (Orders)
    await Order.insertMany([
      {
        _id: new mongoose.Types.ObjectId("70f1f77bcf86cd799440b01"), order_number: "ORD-0001",
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), status: "pending",
        items: [
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a1"), quantity: 3, unit_price: mongoose.Types.Decimal128.fromString("450.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a2"), quantity: 2, unit_price: mongoose.Types.Decimal128.fromString("400.00") }
        ],
        created_at: new Date("2026-04-01T12:30:00Z")
      },
      {
        _id: new mongoose.Types.ObjectId("70f1f77bcf86cd799440b02"), order_number: "ORD-0002",
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"), status: "paid",
        items: [
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a1"), quantity: 2, unit_price: mongoose.Types.Decimal128.fromString("450.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a2"), quantity: 2, unit_price: mongoose.Types.Decimal128.fromString("400.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a5"), quantity: 3, unit_price: mongoose.Types.Decimal128.fromString("250.00") }
        ],
        created_at: new Date("2026-04-04T12:34:00Z")
      },
      {
        _id: new mongoose.Types.ObjectId("70f1f77bcf86cd799440b03"), order_number: "ORD-0003",
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"), status: "pending",
        items: [
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a4"), quantity: 2, unit_price: mongoose.Types.Decimal128.fromString("350.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a2"), quantity: 4, unit_price: mongoose.Types.Decimal128.fromString("400.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a5"), quantity: 3, unit_price: mongoose.Types.Decimal128.fromString("250.00") }
        ],
        created_at: new Date("2026-04-05T11:24:00Z")
      },
      {
        _id: new mongoose.Types.ObjectId("70f1f77bcf86cd799440b04"), order_number: "ORD-0004",
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"), status: "delivered",
        items: [
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a2"), quantity: 3, unit_price: mongoose.Types.Decimal128.fromString("400.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a4"), quantity: 4, unit_price: mongoose.Types.Decimal128.fromString("350.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a5"), quantity: 5, unit_price: mongoose.Types.Decimal128.fromString("250.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a3"), quantity: 3, unit_price: mongoose.Types.Decimal128.fromString("450.00") }
        ],
        created_at: new Date("2026-04-05T12:42:00Z")
      },
      {
        _id: new mongoose.Types.ObjectId("70f1f77bcf86cd799440b05"), order_number: "ORD-0005",
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), status: "delivered",
        items: [
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a2"), quantity: 2, unit_price: mongoose.Types.Decimal128.fromString("400.00") },
          { item_id: new mongoose.Types.ObjectId("60f1f77bcf86cd7994390a3"), quantity: 6, unit_price: mongoose.Types.Decimal128.fromString("450.00") }
        ],
        created_at: new Date("2026-04-06T10:36:00Z")
      }
    ]);
    console.log("📦 Órdenes insertadas.");

    // 5. Insertar Personal de Catering
    const cateringStaff = await CateringStaff.insertMany([
      { _id: new mongoose.Types.ObjectId("80f1f77bcf86cd799441c01"), first_name: "Bruno", last_name: "Suárez", phone: "1198234501", role: "chef" },
      { _id: new mongoose.Types.ObjectId("80f1f77bcf86cd799441c02"), first_name: "Mariana", last_name: "Romero", phone: "1198234502", role: "waiter" },
      { _id: new mongoose.Types.ObjectId("80f1f77bcf86cd799441c03"), first_name: "Tomás", last_name: "Herrera", phone: "1198234503", role: "delivery" },
      { _id: new mongoose.Types.ObjectId("80f1f77bcf86cd799441c04"), first_name: "Camila", last_name: "Acosta", phone: "1198234504", role: "catering_manager" },
      { _id: new mongoose.Types.ObjectId("80f1f77bcf86cd799441c05"), first_name: "Santiago", last_name: "Mendoza", phone: "1198234505", role: "waiter" }
    ]);
    console.log("👨‍🍳 Personal de catering insertado.");

    // 6. Insertar Eventos de Catering
    await CateringEvent.insertMany([
      {
        _id: new mongoose.Types.ObjectId("90f1f77bcf86cd799442d01"),
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
        date_event: new Date("2026-05-20T19:00:00Z"), catering_type: "buffet",
        event_location: { calle: "Av. del Libertador", altura: "4500", ciudad: "CABA" },
        details: "Cumpleaños de 40 años, salón cerrado",
        price_per_person: mongoose.Types.Decimal128.fromString("8500.00"), guest_count: 40,
        payment_status: "deposit_paid",
        assigned_staff: [new mongoose.Types.ObjectId("80f1f77bcf86cd799441c01"), new mongoose.Types.ObjectId("80f1f77bcf86cd799441c02")]
      },
      {
        _id: new mongoose.Types.ObjectId("90f1f77bcf86cd799442d02"),
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        date_event: new Date("2026-06-15T12:30:00Z"), catering_type: "plated",
        event_location: { calle: "Av. Alvear", altura: "1890", ciudad: "CABA" },
        details: "Almuerzo corporativo de fin de trimestre",
        price_per_person: mongoose.Types.Decimal128.fromString("12500.00"), guest_count: 25,
        payment_status: "paid_in_full",
        assigned_staff: [
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c01"), 
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c02"),
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c04")
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("90f1f77bcf86cd799442d03"),
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"),
        date_event: new Date("2026-07-02T21:00:00Z"), catering_type: "food_station",
        event_location: { calle: "Calle Gorriti", altura: "5520", ciudad: "CABA" },
        details: "Fiesta de aniversario, espacio al aire libre",
        price_per_person: mongoose.Types.Decimal128.fromString("9800.00"), guest_count: 80,
        payment_status: "deposit_paid",
        assigned_staff: [
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c02"), 
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c05")
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("90f1f77bcf86cd799442d04"),
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
        date_event: new Date("2026-08-10T11:00:00Z"), catering_type: "drop_off",
        event_location: { calle: "Av. Callao", altura: "1120", ciudad: "CABA" },
        details: "Brunch de capacitación empresarial",
        price_per_person: mongoose.Types.Decimal128.fromString("5200.00"), guest_count: 15,
        payment_status: "unpaid",
        assigned_staff: [new mongoose.Types.ObjectId("80f1f77bcf86cd799441c03")]
      },
      {
        _id: new mongoose.Types.ObjectId("90f1f77bcf86cd799442d05"),
        client_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        date_event: new Date("2026-09-05T20:30:00Z"), catering_type: "passed_hors_d_oeuvres",
        event_location: { calle: "Av. Quintana", altura: "340", ciudad: "CABA" },
        details: "Cóctel de inauguración de galería de arte",
        price_per_person: mongoose.Types.Decimal128.fromString("11000.00"), guest_count: 60,
        payment_status: "paid_in_full",
        assigned_staff: [
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c01"), 
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c02"),
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c04"), 
          new mongoose.Types.ObjectId("80f1f77bcf86cd799441c05")
        ]
      }
    ]);
    console.log("🎉 Eventos de catering insertados.");

    console.log("\n✨ ¡Base de datos poblada con éxito con los datos del TP! ✨");
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada.");
  }
};

seedDatabase();