import { randomBytes } from "node:crypto";
import Order from "../models/orderModel.js";
import MenuItem from "../models/menuItemModel.js";
import User from "../models/userModel.js";
import { ErrorApp } from "../utils/errorApps.js";
import { ROLES, STAFF_ROLES } from "../utils/constants.js";

/* ---------- Constantes ---------- */

// Filtro: solo pedidos activos
const ACTIVE = { deleted_at: null };

// Llena (populates) los datos del cliente y del plato en las consultas
const POPULATE = [
    { path: "client_id", select: "first_name last_name email phone" },
    { path: "items.item_id", select: "name category image_url" },
];

// Estados a los que se puede pasar desde cada estado
const TRANSITIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["delivered"],
    delivered: [],
    cancelled: [],
};

// Estados en los que staff y admin todavía pueden corregir el pedido
const EDITABLE_STATUSES = ["pending", "confirmed"];

/* ---------- Helpers de permisos y persistencia ---------- */

// Admin y staff ven todos los pedidos; el cliente solo los suyos
const canSeeAll = (user) => STAFF_ROLES.includes(user.role);

// Filtro base según el rol: activos, y propios si es cliente
const visibilityFilter = (user) =>
    canSeeAll(user) ? { ...ACTIVE } : { ...ACTIVE, client_id: user.id };

// Guarda el pedido y lo devuelve con los datos populados
const saveAndPopulate = async (order) => {
    await order.save();
    return order.populate(POPULATE);
};

/* ---------- Helpers de armado y validación ---------- */

// Número de orden, ej. ORD-MH3K9Q2-A1B2C3
const generateOrderNumber = () =>
    `ORD-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;

// Verifica que el cliente exista y esté activo (ref)
const assertClient = async (clientId) => {
    if (typeof clientId !== "string") throw new ErrorApp("El cliente es obligatorio", 400);
    const exists = await User.exists({ _id: clientId, role: ROLES.CLIENT, deleted_at: null });
    if (!exists) throw new ErrorApp("El cliente no existe", 400);
};

// Arma las líneas del pedido con nombre y precio tomados del menú
const buildLines = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new ErrorApp("El pedido debe tener al menos un plato", 400);
    }
    // Busca solo los platos activos que se pidieron
    const ids = items.map((line) => line?.item_id).filter(Boolean);
    const menuItems = await MenuItem.find({ _id: { $in: ids }, deleted_at: null });
    const byId = new Map(menuItems.map((menuItem) => [String(menuItem._id), menuItem]));

    return items.map((line) => {
        const { item_id, quantity } = line ?? {};
        const menuItem = byId.get(String(item_id));
        if (!menuItem) throw new ErrorApp("Un plato del pedido no existe o no está disponible", 400);
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new ErrorApp("La cantidad debe ser un entero mayor o igual a 1", 400);
        }
        return { item_id: menuItem._id, name: menuItem.name, quantity, unit_price: menuItem.price };
    });
};

// Total en centavos a partir de las líneas
const calcTotal = (lines) => lines.reduce((sum, line) => sum + line.unit_price * line.quantity, 0);

// La dirección solo se guarda si la entrega es a domicilio
const buildDelivery = (delivery) => ({
    type: delivery?.type,
    address: delivery?.type === "delivery" ? delivery.address : undefined,
});

/* ---------- Servicios ---------- */

// Crea el pedido: precios y total salen de la base, nunca del cliente
export const create = async (user, data = {}) => {
    // El cliente pide para sí mismo; staff y admin eligen el cliente
    const clientId = user.role === ROLES.CLIENT ? user.id : data.client_id;
    await assertClient(clientId);
    const lines = await buildLines(data.items);

    const order = await Order.create({
        order_number: generateOrderNumber(),
        client_id: clientId,
        items: lines,
        delivery: buildDelivery(data.delivery),
        notes: data.notes,
        total: calcTotal(lines),
    });
    return order.populate(POPULATE);
};

// Lista pedidos, con filtro opcional por estado
export const getAll = async (user, status) => {
    const filter = visibilityFilter(user);
    if (status) filter.status = status;
    return Order.find(filter).populate(POPULATE).sort({ created_at: -1 });
};

// Un cliente solo puede ver sus propios pedidos
export const getById = async (user, id) =>
    Order.findOne({ _id: id, ...visibilityFilter(user) }).populate(POPULATE);

// Corrección de un pedido mal tomado (solo staff y admin)
export const update = async (id, data = {}) => {
    const order = await Order.findOne({ _id: id, ...ACTIVE });
    if (!order) return null;
    if (!EDITABLE_STATUSES.includes(order.status)) {
        throw new ErrorApp(`No se puede modificar un pedido en estado ${order.status}`, 409);
    }

    const { client_id, items, delivery, notes } = data;
    if (client_id !== undefined) {
        await assertClient(client_id);
        order.client_id = client_id;
    }
    // Si cambian los platos, se recalculan precios y total con el menú actual
    if (items !== undefined) {
        const lines = await buildLines(items);
        order.items = lines;
        order.total = calcTotal(lines);
    }
    if (delivery !== undefined) order.delivery = buildDelivery(delivery);
    if (notes !== undefined) order.notes = notes;

    return saveAndPopulate(order);
};

// Cambia el estado respetando las transiciones permitidas
export const updateStatus = async (id, status) => {
    if (typeof status !== "string" || !Object.hasOwn(TRANSITIONS, status)) {
        throw new ErrorApp("El estado no es válido", 400);
    }
    const order = await Order.findOne({ _id: id, ...ACTIVE });
    if (!order) return null;
    if (!TRANSITIONS[order.status].includes(status)) {
        throw new ErrorApp(`No se puede pasar de ${order.status} a ${status}`, 409);
    }
    order.status = status;
    return saveAndPopulate(order);
};

// El cliente cancela su propio pedido, solo si sigue pendiente
export const cancel = async (user, id) => {
    const order = await Order.findOne({ _id: id, client_id: user.id, ...ACTIVE });
    if (!order) return null;
    if (order.status !== "pending") {
        throw new ErrorApp("Solo se puede cancelar un pedido pendiente", 409);
    }
    order.status = "cancelled";
    return saveAndPopulate(order);
};

// Soft delete (solo admin)
export const softDelete = async (id) =>
    Order.findOneAndUpdate(
        { _id: id, ...ACTIVE },
        { deleted_at: new Date() },
        { returnDocument: "after" }
    );

// Delete:
export const remove = async (id) => Order.findByIdAndDelete(id);