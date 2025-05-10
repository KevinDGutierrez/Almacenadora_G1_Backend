import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";

import {
  registrarMovimiento,
  obtenerHistorial,
  generarInformeMovimientos,
} from "../movimientos/movimientos.controller.js";

const router = Router();

router.post(
  "/registrarMovimiento",
    validarJWT,
  [
    check("producto").notEmpty().isMongoId(),
    check("cantidad").notEmpty().isInt({ gt: 0 }),
    check("empleado").notEmpty().isMongoId(),
    check("motivo").notEmpty(),
    check("destino").notEmpty(),
  ],
  registrarMovimiento
);

router.post(
  "/informeMovimientos",
  validarJWT,
  [
    check("fechaInicio").notEmpty().isISO8601(),
    check("fechaFin").notEmpty().isISO8601(),
  ],
  generarInformeMovimientos
);

router.get(
  "/:producto",
  validarJWT,
  [check("producto").isMongoId()],
  obtenerHistorial
);

export default router;