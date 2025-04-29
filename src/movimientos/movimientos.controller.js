import Movimientos from '../models/Movimientos.js';

export const registrarEntrada = async (req, res) => {
  try {
    const { producto, cantidad, empleado } = req.body;

    const movimiento = {
      tipo: 'entrada',
      cantidad,
      empleado,
    };

    let doc = await Movimientos.findOne({ producto });

    if (!doc) {
      doc = new Movimientos({ producto, historial: [movimiento] });
    } else {
      doc.historial.push(movimiento);
    }

    await doc.save();
    res.status(201).json({ message: 'Entrada registrada', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar entrada', error });
  }
};

export const registrarSalida = async (req, res) => {
  try {
    const { producto, cantidad, motivo, destino } = req.body;

    const movimiento = {
      tipo: 'salida',
      cantidad,
      motivo,
      destino,
    };

    let doc = await Movimientos.findOne({ producto });

    if (!doc) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    doc.historial.push(movimiento);
    await doc.save();
    res.status(201).json({ message: 'Salida registrada', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar salida', error });
  }
};

export const obtenerHistorial = async (req, res) => {
  try {
    const { producto } = req.params;
    const doc = await Movimientos.findOne({ producto });

    if (!doc) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ producto: doc.producto, historial: doc.historial });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error });
  }
};
