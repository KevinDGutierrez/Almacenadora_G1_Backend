import { Router } from 'express';
import { registrarEntrada, registrarSalida, obtenerHistorial, generarInformeMovimientos } from '../controllers/movimientos.controller.js';

const router = Router();

router.post('/entrada', registrarEntrada);
router.post('/salida', registrarSalida);
router.get('/:producto', obtenerHistorial);
router.get('/informeMovimientos', generarInformeMovimientos)

export default router;
