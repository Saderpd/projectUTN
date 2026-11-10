import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Vueltas del hash 
const VUELTAS = 10

// RegEx valida email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
            minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        },

        last_name: {
            type: String,
            required: [true, "El apellido es obligatorio"],
            trim: true,
            minlength: [2, "El apellido debe tener al menos 2 caracteres"],
        },

        email: {
            type: String,
            required: [true, "El email es obligatorio"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [emailRegex, "Email no valido"], // Usa el RegEx para validar
        },

        // Se valida en texto plano y el hook lo reemplaza por el hash
        password_hash: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
            select: false,
        },

        phone: { type: String, trim: true },

        address: {
            street: { type: String, trim: true },
            number: { type: String, trim: true },
            city: { type: String, trim: true }
        },

        role: {
            type: String,
            enum: {
                values: ["client", "staff", "admin"],
                message: "El rol debe ser client, staff o admin",
            },
            default: "client",
        },

        // Soft delete: null = usuario activo, fecha = usuario borrado
        deleted_at: { type: Date, default: null },
    },
    {
        // Nombre exacto de la colección en Mongo para que no cree una nueva
        collection: "users",

        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },

        // Nunca se devuelve el hash en las respuestas JSON
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password_hash;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Hashea la contraseña (Siempre en el modelo para que no se guarde el texto plano)
userSchema.pre("save", async function () {
    if (!this.isModified("password_hash")) return;
    this.password_hash = await bcrypt.hash(this.password_hash, VUELTAS);
});

export default mongoose.model("User", userSchema);