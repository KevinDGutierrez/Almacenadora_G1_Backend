import { Schema, model } from 'mongoose';

const MovimientoSchema = new Schema({
  tipo: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  empleado: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  motivo: {
    type: String,
    required: true
  },
  destino: {
    type: String,
    required: true
  },
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  }
}, { timestamps: true });

export default model('Movimiento', MovimientoSchema);