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
    required: true
  },
  motivo: {
    type: String,
    required: true
  },
  destino: {
    type: String,
    required: true
  }
}, { _id: false });

const MovimientosSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    required: true
  },
  historial: [MovimientoSchema]
}, { timestamps: true });

export default model('Movimientos', MovimientosSchema);
