import Movimiento from '../movimientos/movimientos.model.js';

export const registrarEntrada = async (req, res) => {
  try {
    const { producto, cantidad, empleado, motivo, destino } = req.body;

    const nuevoMovimiento = new Movimiento({
      tipo: 'entrada',
      cantidad,
      empleado,
      motivo,
      destino,
      producto
    });

    await nuevoMovimiento.save();
    res.status(201).json({ message: 'Entrada registrada', data: nuevoMovimiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar entrada', error });
  }
};

export const registrarSalida = async (req, res) => {
  try {
    const { producto, cantidad, empleado, motivo, destino } = req.body;

    const nuevoMovimiento = new Movimiento({
      tipo: 'salida',
      cantidad,
      empleado,
      motivo,
      destino,
      producto
    });

    await nuevoMovimiento.save();
    res.status(201).json({ message: 'Salida registrada', data: nuevoMovimiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar salida', error });
  }
};

export const obtenerHistorial = async (req, res) => {
  try {
    const { producto } = req.params;

    const historial = await Movimiento.find({ producto })
      .populate('empleado', 'name surname email') // opcional: datos del usuario
      .sort({ fecha: -1 });

    if (!historial.length) {
      return res.status(404).json({ message: 'No hay movimientos para este producto' });
    }

    res.json({ producto, historial });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error });
  }
};

export const generarInformeMovimientos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio) || isNaN(fin)) {
      return res.status(400).json({ message: 'Fechas inválidas' });
    }

    const resumen = await Movimiento.aggregate([
      {
        $match: {
          fecha: { $gte: inicio, $lte: fin }
        }
      },
      {
        $group: {
          _id: '$producto',
          totalEntradas: {
            $sum: {
              $cond: [{ $eq: ['$tipo', 'entrada'] }, '$cantidad', 0]
            }
          },
          totalSalidas: {
            $sum: {
              $cond: [{ $eq: ['$tipo', 'salida'] }, '$cantidad', 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'producto'
        }
      },
      {
        $unwind: '$producto'
      },
      {
        $project: {
          _id: 0,
          productoId: '$_id',
          nombreProducto: '$producto.nombre',
          totalEntradas: 1,
          totalSalidas: 1
        }
      },
      {
        $sort: { nombreProducto: 1 }
      }
    ]);

    res.json({
      fechaInicio: inicio.toISOString(),
      fechaFin: fin.toISOString(),
      resumen
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el informe', error });
  }
};