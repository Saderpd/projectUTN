// Configuración de Express: middlewares y rutas (el arranque está en server.js)
import express from "express";
import cors from "cors";
import menuItemRoute from "./routes/menuItemRoute.js";
import userRoute from "./routes/userRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Solo acepta peticiones del CLIENT_URL ya configurado en el env
app.use(cors({ origin: process.env.CLIENT_URL }));

// Parsea el body JSON (lo deja en req.body)
app.use(express.json());

// Health check (ruta de prueba, solo GET)
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Agrupadores de ruta
app.use("/api/menu-items", menuItemRoute);
app.use("/api/users", userRoute);

// Ruta no encontrada (404)
app.use((req, res) => {
    res.status(404).json({ error: "Esa dirección no existe" });
});

// Siempre al final, después de las rutas
app.use(errorHandler);

export default app;