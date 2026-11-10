import "dotenv/config"; 
import app from "./app.js";
import { connectDB } from "./config/db.js";

// Variables obligatorias para que la API funcione
const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET", "CLIENT_URL"];

// Corta el arranque si falta alguna, antes de conectar a la base
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length) {
    console.error(`Faltan variables de entorno: ${missing.join(", ")}`);
    process.exit(1);
}

const PORT = process.env.PORT || 3000;

await connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`) )