import * as userService from "../services/userService.js";

// POST /api/users/register
export const register = async (req, res, next) => {
  try {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({ usuario: user, token });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const { user, token } = await userService.login(email, password);
    res.status(200).json({ usuario: user, token });
  } catch (error) {
    next(error);
  }
};

// POST /api/users (admin)
export const create = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// GET /api/users (admin)
export const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id (admin)
export const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id (admin)
export const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id/deactivate (admin, soft delete)
export const softDelete = async (req, res, next) => {
  try {
    const user = await userService.softDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ mensaje: "Usuario dado de baja" });
  } catch (error) {
    next(error);
  }
};