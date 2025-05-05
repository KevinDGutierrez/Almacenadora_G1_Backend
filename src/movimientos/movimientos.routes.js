import { Router } from "express";
import { check } from "express-validator";
import validarJWT from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";

import {
  registrarEntrada,
  registrarSalida,
  obtenerHistorial,
  generarInformeMovimientos,
} from "../controllers/movimientos.controller.js";

const router = Router();

router.post(
  "/entrada",
  validarJWT,
  [
    check("producto").notEmpty().isMongoId(),
    check("cantidad").notEmpty().isInt({ gt: 0 }),
    check("empleado").notEmpty().isMongoId(),
    validarCampos(),
  ],
  registrarEntrada
);

router.post(
  "/salida",
  validarJWT,
  [
    check("producto").notEmpty().isMongoId(),
    check("cantidad").notEmpty().isInt({ gt: 0 }),
    check("empleado").notEmpty().isMongoId(),
    check("motivo").notEmpty(),
    check("destino").notEmpty(),
  ],
  registrarSalida
);

router.get(
  "/:producto",
  validarJWT,
  [check("producto").isMongoId()],
  obtenerHistorial
);

router.get(
  "/informeMovimientos",
  validarJWT,
  [
    check("fechaInicio").notEmpty().isISO8601(),
    check("fechaFin").notEmpty().isISO8601(),
  ],
  generarInformeMovimientos
);

export default router;
