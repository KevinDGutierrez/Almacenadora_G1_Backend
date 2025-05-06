import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { createClient, getClients, updateClient, deleteClient, getClientById } from './client.controller.js'

const router = Router();

router.post(
    '/', 
    createClient
);

router.get(
    '/', getClients
);

router.get(
    '/:id', getClientById
);

router.put(
    '/:id', 
    updateClient
);

router.delete(
    '/:id', 
    deleteClient
);


export default router;
