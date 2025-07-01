const { Rubro, Unidad, Area } = require('../models/Lista');

// Función auxiliar para manejar operaciones CRUD genéricas
const handleCRUD = (Model) => ({
  // Obtener todos los items
  getItems: async (req, res) => {
    try {
      const items = await Model.find({ usuario: req.user.id });
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      console.error(`Error al obtener ${Model.modelName}:`, error);
      res.status(500).json({
        success: false,
        message: `Error al obtener ${Model.modelName.toLowerCase()}s`
      });
    }
  },

  // Crear un nuevo item
  createItem: async (req, res) => {
    try {
      // Verificar si ya existe un item con el mismo nombre para este usuario
      const existingItem = await Model.findOne({
        nombre: req.body.nombre,
        usuario: req.user.id
      });

      if (existingItem) {
        return res.status(400).json({
          success: false,
          message: `Ya existe un ${Model.modelName.toLowerCase()} con ese nombre`
        });
      }

      const newItem = await Model.create({
        ...req.body,
        usuario: req.user.id
      });

      res.status(201).json({
        success: true,
        data: newItem
      });
    } catch (error) {
      console.error(`Error al crear ${Model.modelName.toLowerCase()}:`, error);
      res.status(500).json({
        success: false,
        message: `Error al crear ${Model.modelName.toLowerCase()}`
      });
    }
  },

  // Actualizar un item
  updateItem: async (req, res) => {
    try {
      const item = await Model.findOneAndUpdate(
        { _id: req.params.id, usuario: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${Model.modelName} no encontrado`
        });
      }

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error(`Error al actualizar ${Model.modelName.toLowerCase()}:`, error);
      res.status(500).json({
        success: false,
        message: `Error al actualizar ${Model.modelName.toLowerCase()}`
      });
    }
  },

  // Eliminar un item
  deleteItem: async (req, res) => {
    try {
      const item = await Model.findOneAndDelete({
        _id: req.params.id,
        usuario: req.user.id
      });

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${Model.modelName} no encontrado`
        });
      }

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error(`Error al eliminar ${Model.modelName.toLowerCase()}:`, error);
      res.status(500).json({
        success: false,
        message: `Error al eliminar ${Model.modelName.toLowerCase()}`
      });
    }
  }
});

// Controladores específicos para cada tipo de lista
const rubroController = handleCRUD(Rubro);
const unidadController = handleCRUD(Unidad);
const areaController = handleCRUD(Area);

module.exports = {
  rubroController,
  unidadController,
  areaController
};
