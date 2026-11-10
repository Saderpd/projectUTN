// No hay try/catch porque Express 5 lo hace solo:
// Si una función async lanza un error, Express lo agarra y se lo manda al middleware de errores.

// Middleware de errores:
export const errorHandler = (error, req, res, next) => {

    // Datos que no pasan las validaciones del modelo
    if (error.name === "ValidationError") {
        return res.status(400).json({
            error: "Los datos no son válidos",
            detalles: Object.values(error.errors).map((e) => e.message),
        });
    }

    // Id con formato no valido
    if (error.name === "CastError") {
        return res.status(400).json({ error: "El id no es válido" });
    }

    // Valor duplicado en un campo UNIQUE (ej. email)
    if (error.code === 11000) {
        return res.status(400).json({ error: "Ya existe un registro con ese dato" });
    }

    // Cualquier otro error: no se expone el detalle al cliente, solo al log
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
};