//Punto de entrada
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({origin: process.env.CLIENT_URL })); //solo acepta peticiones del CLIENT_URL ya configurado en el env 

app.use(express.json()); // Parsea el body JSON (Lee los body en JSON y los deja en req.body)

app.use("/api/health", (req, res) => res.json({ status: "ok"})); // Health check (ruta de prueba)

export default app 
