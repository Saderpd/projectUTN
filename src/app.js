// Punto de entrada
import express from "express";
import cors from "cors";
import menuItemRoute from "./routes/menuItemRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app = express();

// Solo acepta peticiones del CLIENT_URL ya configurado en el env 
app.use(cors({origin: process.env.CLIENT_URL })); 

// Parsea el body JSON (Lee los body en JSON y los deja en req.body)
app.use(express.json()); 

// Health check (ruta de prueba)
app.use("/api/health", (req, res) => res.json({ status: "ok"})); 

// Agrupadores de ruta
app.use("/api/menu-items", menuItemRoute);

// Ruta
app.use((req, res) => {
    res.status(404).json({ error: "Esa dirección no existe" })
})

// RECORDATORIO: Siempre al final, después de las rutas
app.use(errorHandler);

export default app 
