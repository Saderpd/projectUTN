import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
            minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        },
        description: { type: String, trim: true },
        // Solo se permiten dulce o salado 
        category: {
            type: String,
            required: [true, "La categoría es obligatoria"],
            enum: {
                values: ["dulce", "salado"],
                message: "La categoría debe ser dulce o salado",
            },
        },
        // Precio como entero en centavos
        price: {
            type: Number,
            required: [true, "El precio es obligatorio"],
            min: [0, "El precio no puede ser negativo"],
            validate: {
                validator: Number.isInteger,
                message: "El precio debe ser un entero en centavos",
            },
        },
        image_url: { type: String, trim: true },

        // Soft delete: null = plato activo, fecha = plato borrado
        deleted_at: { type: Date, default: null },
    },
    {
        // Nombre exacto de la colección en Mongo para que no cree una nueva (aprendí de errores)
        collection: "menu_items",

        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export default mongoose.model("MenuItem", menuItemSchema);