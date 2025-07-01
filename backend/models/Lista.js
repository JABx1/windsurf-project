const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para búsquedas más rápidas
itemSchema.index({ nombre: 1, usuario: 1 }, { unique: true });

// Modelo para Rubros
const Rubro = mongoose.model('Rubro', itemSchema);

// Modelo para Unidades
const Unidad = mongoose.model('Unidad', itemSchema);

// Modelo para Áreas
const Area = mongoose.model('Area', itemSchema);

module.exports = {
  Rubro,
  Unidad,
  Area
};
