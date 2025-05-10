import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { createClient, getClients, updateClient, deleteClient, getClientById } from './client.controller.js'
import { checkPermission } from "../helpers/validation-user.js";

const router = Router();

router.post(
    '/', 
    [
        validarJWT,
    ],
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
    [
        validarJWT,
        checkPermission,
    ],
    updateClient
);

router.delete(
    '/:id', 
    [
        validarJWT,
        checkPermission,
    ],
    deleteClient
);

export default router;
