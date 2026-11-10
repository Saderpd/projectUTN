import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { ErrorApp } from "../utils/errorApp.js";

// Filtro: solo usuarios activos
const ACTIVE = { deleted_at: null };

// Campos que se puede enviar (excluye password_hash y deleted_at)
const ALLOWED = ["first_name", "last_name", "email", "phone", "address", "role"];

const pickFields = (data = {}) =>
    Object.fromEntries(
        ALLOWED.filter((key) => data[key] !== undefined).map((key) => [key, data[key]])
    );

// Genera el JWT con id y rol
const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    });

// CREATE: Crea el usuario, el modelo hashea la contraseña
const createUser = async (data = {}) =>
    User.create({ ...pickFields(data), password_hash: data.password });

// Registro publico: el rol siempre es client
export const register = async (data = {}) => {
    const user = await createUser({ ...data, role: "client" });
    return { user, token: signToken(user) };
};

// Login: devuelve el usuario y el token
export const login = async (email, password) => {
    // Evita objetos tipo {"$ne": null} (inyección NoSQL)
    if (typeof email !== "string" || typeof password !== "string") {
        throw new ErrorApp("Email y contraseña son obligatorios", 400);
    }
    // El hash viene oculto por defecto: se pide explícitamente
    const user = await User.findOne({ email: email.toLowerCase(), ...ACTIVE }).select(
        "+password_hash"
    );
    const valid = user && (await bcrypt.compare(password, user.password_hash));
    // Mismo mensaje para email o contraseña incorrectos
  if (!valid) throw new ErrorApp("Credenciales inválidas", 401);
    return { user, token: signToken(user) };
};

// Alta por admin: puede asignar cualquier rol
export const create = async (data) => createUser(data);

export const getAll = async () => User.find(ACTIVE);

export const getById = async (id) => User.findOne({ _id: id, ...ACTIVE });

// No modifica la contraseña ni deleted_at
export const update = async (id, data) =>
    User.findOneAndUpdate({ _id: id, ...ACTIVE }, pickFields(data), {
        returnDocument: "after",
        runValidators: true,
    });

// Soft Delete
export const softDelete = async (id) =>
    User.findOneAndUpdate(
        { _id: id, ...ACTIVE },
        { deleted_at: new Date() },
        { returnDocument: "after" }
    );