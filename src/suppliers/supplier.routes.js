import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/tiene-role.js";
import { createSupplier, getSuppliers, updateSupplier, deleteSupplier } from "./supplier.controller.js"
import { existeSupplierById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    '/', 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),  
    ], 
    createSupplier
);

router.get(
    '/', 
    getSuppliers
);

router.put(
    '/:id', 
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeSupplierById),
        validarCampos
    ],
    updateSupplier
);

router.delete(
    '/:id', 
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),  
        validarCampos
    ],
    deleteSupplier
);


export default router;
