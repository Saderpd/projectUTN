import mongoose from "mongoose";

// Se exige dirección solo si la entrega es a domicilio
function isDelivery() {
    return this.type === "delivery";
}

// Línea del pedido: copia del plato con nombre y precio congelados
const orderItemSchema = new mongoose.Schema(
    {
        item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem",
            required: [true, "El plato es obligatorio"],
        },

        name: { type: String, required: [true, "El nombre del plato es obligatorio"], trim: true },

        quantity: {
            type: Number,
            required: [true, "La cantidad es obligatoria"],
            min: [1, "La cantidad mínima es 1"],
            validate: { validator: Number.isInteger, message: "La cantidad debe ser un entero" },
        },

        // Precio unitario en centavos
        unit_price: {
            type: Number,
            required: [true, "El precio unitario es obligatorio"],
            min: [0, "El precio no puede ser negativo"],
            validate: { validator: Number.isInteger, message: "El precio debe ser un entero en centavos" },
        },
    },
    { _id: false }
);

// Datos de entrega embebidos
const deliverySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, "El tipo de entrega es obligatorio"],
            enum: { values: ["pickup", "delivery"], message: "La entrega debe ser pickup o delivery" },
        },

        address: {
            street: { type: String, trim: true, required: [isDelivery, "La calle es obligatoria para envío a domicilio"] },
            number: { type: String, trim: true, required: [isDelivery, "El número es obligatorio para envío a domicilio"] },
            city: { type: String, trim: true, required: [isDelivery, "La ciudad es obligatoria para envío a domicilio"] },
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        order_number: { type: String, required: true, unique: true },

        // Referencia al cliente que hizo el pedido
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "El cliente es obligatorio"],
        },

        status: {
            type: String,
            enum: {
                values: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
                message: "El estado no es válido",
            },
            default: "pending",
        },

        items: {
            type: [orderItemSchema],
            validate: { validator: (list) => list.length > 0, message: "El pedido debe tener al menos un plato" },
        },

        delivery: { type: deliverySchema, required: [true, "Los datos de entrega son obligatorios"] },

        notes: { type: String, trim: true, maxlength: [300, "Las notas admiten hasta 300 caracteres"] },

        // Total, calculado por el servidor
        total: {
            type: Number,
            required: [true, "El total es obligatorio"],
            min: [0, "El total no puede ser negativo"],
            validate: { validator: Number.isInteger, message: "El total debe ser un entero en centavos" },
        },

        // Soft delete: null = activo, fecha = borrado
        deleted_at: { type: Date, default: null },
    },
    {
        collection: "orders",
        
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export default mongoose.model("Order", orderSchema);