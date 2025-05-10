import Movimiento from "../movimientos/movimientos.model.js";
import Product from '../product/product-model.js';
import mongoose from "mongoose";

export const registrarMovimiento = async (req, res) => {
  try {
    const { tipo, producto, cantidad, empleado, motivo, destino } = req.body;

    if (!["entrada", "salida"].includes(tipo)) {
      return res
        .status(400)
        .json({
          message:
            'Tipo de movimiento no válido. Debe ser "entrada" o "salida".',
        });
    }

    if (!mongoose.Types.ObjectId.isValid(producto)) {
      return res.status(400).json({ message: "ID de producto no válido." });
    }
    if (!mongoose.Types.ObjectId.isValid(empleado)) {
      return res.status(400).json({ message: "ID de empleado no válido." });
    }

    const product = await Product.findById(producto);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    if (tipo === "entrada") {
      product.stock += cantidad;
    } else if (tipo === "salida") {
      if (product.stock < cantidad) {
        return res
          .status(400)
          .json({ message: "Stock insuficiente para realizar la salida." });
      }
      product.stock -= cantidad;
    }

    await product.save();

    const nuevoMovimiento = new Movimiento({
      tipo,
      producto,
      cantidad,
      empleado,
      motivo,
      destino,
    });

    await nuevoMovimiento.save();

    const movimientoGuardado = await Movimiento.findById(nuevoMovimiento._id)
      .populate("producto", "name stock")
      .populate("empleado", "name surname email");

    res.status(201).json({
      message: `Movimiento de ${tipo} registrado exitosamente.`,
      data: movimientoGuardado,
      updatedStock: product.stock,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error al registrar movimiento de ${req.body.tipo}.`,
      error: error.message,
    });
  }
};

export const obtenerHistorial = async (req, res) => {
  try {
    const { producto } = req.params;

    const historial = await Movimiento.find({ producto })
      .populate("empleado", "name surname email")
      .sort({ fecha: -1 });

    if (!historial.length) {
      return res
        .status(404)
        .json({ message: "No hay movimientos para este producto" });
    }

    res.json({ producto, historial });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error });
  }
};

export const generarInformeMovimientos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body;

    const inicio = new Date(fechaInicio + 'T00:00:00.000Z');
    const fin = new Date(fechaFin + 'T23:59:59.999Z');

    console.log("Filtro fechas:", { desde: inicio, hasta: fin });

    if (isNaN(inicio) || isNaN(fin)) {
      return res.status(400).json({ message: "Fechas inválidas" });
    }

    const resumen = await Movimiento.aggregate([
      {
        $match: {
          fecha: { $gte: inicio, $lte: fin }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'producto',
          foreignField: '_id',
          as: 'producto'
        }
      },
      { $unwind: '$producto' },
      {
        $lookup: {
          from: 'users',
          localField: 'empleado',
          foreignField: '_id',
          as: 'empleado'
        }
      },
      { $unwind: '$empleado' },
      {
        $group: {
          _id: { productoId: '$producto._id', empleadoId: '$empleado._id' },
          nombreProducto: { $first: '$producto.name' },
          currentStock: { $first: '$producto.stock' },
          employeeId: { $first: '$empleado._id' },
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
        $project: {
          productoId: '$_id.productoId',
          employeeId: '$_id.empleadoId',
          nombreProducto: 1,
          currentStock: 1,
          totalEntradas: 1,
          totalSalidas: 1,
          _id: 0
        }
      },
      {
        $sort: { nombreProducto: 1 }
      }
    ]);

    res.json({
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      resumen,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al generar el informe", error });
  }
};
