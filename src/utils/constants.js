export const ROLES = Object.freeze({
  ADMIN: "admin",
  STAFF: "staff",
  CLIENT: "client",
});

// Roles con acceso total a los pedidos
export const STAFF_ROLES = [ROLES.ADMIN, ROLES.STAFF];