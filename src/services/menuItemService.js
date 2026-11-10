import MenuItem from "../models/menuItemModel.js";

// Filtro: Solo documentos activos
const ACTIVE = { deleted_at: null };

// GET: Lista los platos activos, con filtro opcional por categoria
export const getAll = async (category) => {
    const filter = category ? { ...ACTIVE, category } : ACTIVE;
    return MenuItem.find(filter);
};

// GETById: Devuelve un plato activo o null si no existe
export const getById = async (id) => {
    return MenuItem.findOne({ _id: id, ...ACTIVE });
};

// CREATE: Crea un plato (deleted_at lo maneja el servicio, no el cliente)
export const create = async (data) => {
    const { deleted_at, ...fields } = data;
    return MenuItem.create(fields);
};

// UPDATE: Actualiza un plato activo y valida los cambios
export const update = async (id, data) => {
    const { deleted_at, ...fields } = data;
    return MenuItem.findOneAndUpdate({ _id: id, ...ACTIVE }, fields, {
        returnDocument: "after",
        runValidators: true,
    });
};

// Soft Delete: Solo "borra" platos activos 
export const softDelete = async (id) => {
    return MenuItem.findOneAndUpdate(
        { _id: id, ...ACTIVE },
        { deleted_at: new Date() },
        { returnDocument: "after" }
    );
};

// DELETE: Podria implementarse pero por ahora solo cumple con la consigna del TP
export const remove = async (id) => {
    return MenuItem.findByIdAndDelete(id);
};