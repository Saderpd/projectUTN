// seed.js
import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/userModel.js";
import MenuItem from "./models/menuItemModel.js";
import Order from "./models/orderModel.js";

// Genera un número de pedido fijo y legible para los datos de ejemplo
const orderNumber = (n) => `ORD-SEED-${String(n).padStart(4, "0")}`;

// Calcula el total en centavos a partir de las líneas
const calcTotal = (lines) => lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);

// Arma una línea de pedido congelando nombre y precio del plato
const line = (menuItem, quantity) => ({
  item_id: menuItem._id,
  name: menuItem.name,
  quantity,
  unit_price: menuItem.price,
});

const seed = async () => {
  if (!process.env.MONGODB_URI) throw new Error("Falta MONGODB_URI en el .env");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Conectado a la base "${mongoose.connection.name}"`);

  // Limpia solo las colecciones que usa la app actual
  await Promise.all([User.deleteMany({}), MenuItem.deleteMany({}), Order.deleteMany({})]);
  console.log("Colecciones limpiadas");

  // Usuarios: create (no insertMany) para que corra el hash de bcrypt
  const [admin, staff, client1, client2] = await User.create([
    { first_name: "Admin", last_name: "Test", email: "admin@test.com", password_hash: "Admin1234",
      phone: "1100000001", role: "admin" },
    { first_name: "Staff", last_name: "Test", email: "staff@test.com", password_hash: "Staff1234",
      phone: "1100000002", role: "staff" },
    { first_name: "Lucía", last_name: "Gómez", email: "client@test.com", password_hash: "Client1234",
      phone: "1145678901", role: "client",
      address: { street: "Av. Rivadavia", number: "2450", city: "CABA" } },
    { first_name: "Mateo", last_name: "Fernández", email: "mateo.fernandez@test.com", password_hash: "Client1234",
      phone: "1138920147", role: "client",
      address: { street: "Calle Corrientes", number: "1380", city: "CABA" } },
  ]);

  // Platos con precio en centavos
  const [empanadaCarne, bolloDulce, empanadaPollo, medialuna, pastelito] = await MenuItem.create([
    { name: "Empanada de carne", description: "Carne cortada a cuchillo", category: "salado", price: 45000 },
    { name: "Bollo dulce", description: "Bollo relleno de dulce de leche", category: "dulce", price: 40000 },
    { name: "Empanada de pollo", description: "Pollo y verdeo", category: "salado", price: 45000 },
    { name: "Medialuna de manteca", description: "Clásica argentina", category: "dulce", price: 35000 },
    { name: "Pastelito de membrillo", description: "Hojaldre y membrillo", category: "dulce", price: 25000 },
  ]);

  // Pedidos de ejemplo en distintos estados
  const orders = [
    { client: client1, status: "pending", lines: [line(empanadaCarne, 3), line(bolloDulce, 2)],
      delivery: { type: "pickup" } },
    { client: client1, status: "confirmed", lines: [line(medialuna, 4), line(pastelito, 3)],
      delivery: { type: "delivery", address: client1.address }, notes: "Tocar timbre 2B" },
    { client: client2, status: "preparing", lines: [line(empanadaPollo, 6)],
      delivery: { type: "pickup" } },
    { client: client2, status: "delivered", lines: [line(bolloDulce, 3), line(empanadaCarne, 2)],
      delivery: { type: "delivery", address: client2.address } },
    { client: client1, status: "cancelled", lines: [line(pastelito, 5)],
      delivery: { type: "pickup" } },
  ];

  await Order.create(
    orders.map((o, i) => ({
      order_number: orderNumber(i + 1),
      client_id: o.client._id,
      status: o.status,
      items: o.lines,
      delivery: o.delivery,
      notes: o.notes,
      total: calcTotal(o.lines),
    }))
  );

  console.log("Datos de ejemplo cargados");
  console.log(`Usuarios: ${[admin, staff, client1, client2].map((u) => u.email).join(", ")}`);
};

// Corre el seed y cierra la conexión pase lo que pase
seed()
  .catch((error) => {
    console.error("Error al poblar la base:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());