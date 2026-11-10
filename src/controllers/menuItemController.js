import * as menuItemService from "../services/menuItemService.js";

// GET /api/menu-items?category=dulce o salado
export const getAll = async (req, res, next) => {
    try {
        const items = await menuItemService.getAll(req.query.category);
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

// GET /api/menu-items/:id
export const getById = async (req, res, next) => {
    try {
        const item = await menuItemService.getById(req.params.id);
        if (!item) return res.status(404).json({ error: "Plato no encontrado" });
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

// POST /api/menu-items
export const create = async (req, res, next) => {
    try {
        const item = await menuItemService.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
};

// PUT /api/menu-items/:id
export const update = async (req, res, next) => {
    try {
        const item = await menuItemService.update(req.params.id, req.body);
        if (!item) return res.status(404).json({ error: "Plato no encontrado" });
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/menu-items/:id/deactivate 
export const softDelete = async (req, res, next) => {
    try {
        const item = await menuItemService.softDelete(req.params.id);
        if (!item) return res.status(404).json({ error: "Plato no encontrado" });
        res.status(200).json({ mensaje: "Plato dado de baja" });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/menu-items/:id (no se usa)
export const remove = async (req, res, next) => {
    try {
        const item = await menuItemService.remove(req.params.id);
        if (!item) return res.status(404).json({ error: "Plato no encontrado" });
        res.status(200).json({ mensaje: "Plato eliminado" });
    } catch (error) {
        next(error);
    }
};