import * as orderService from "../services/orderService.js";

// POST /api/orders
export const create = async (req, res, next) => {
  try {
    const order = await orderService.create(req.user, req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders?status=pending  "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"
export const getAll = async (req, res, next) => {
  try {
    const orders = await orderService.getAll(req.user, req.query.status);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
export const getById = async (req, res, next) => {
  try {
    const order = await orderService.getById(req.user, req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id (staff y admin) 
export const update = async (req, res, next) => {
  try {
    const order = await orderService.update(req.params.id, req.body);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status
export const updateStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body?.status);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/cancel (solo el cliente dueño del pedido)
export const cancel = async (req, res, next) => {
  try {
    const order = await orderService.cancel(req.user, req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/deactivate
export const softDelete = async (req, res, next) => {
  try {
    const order = await orderService.softDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.status(200).json({ mensaje: "Pedido dado de baja" });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id
export const remove = async (req, res, next) => {
  try {
    const order = await orderService.remove(req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.status(200).json({ mensaje: "Pedido eliminado" });
  } catch (error) {
    next(error);
  }
};