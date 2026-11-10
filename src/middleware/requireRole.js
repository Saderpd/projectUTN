// Deja pasar solo a los roles indicados (va después de verifyToken)
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tenés permisos para esta acción" });
    }
    next();
  };