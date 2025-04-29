import { Router } from 'express';
import { registrarEntrada, registrarSalida, obtenerHistorial } from '../controllers/movimientos.controller.js';

const router = Router();

router.post('/entrada', registrarEntrada);
router.post('/salida', registrarSalida);
router.get('/:producto', obtenerHistorial);

export default router;
