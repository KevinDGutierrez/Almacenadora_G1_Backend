import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { createSupplier, getSuppliers, getSupplierById , updateSupplier, deleteSupplier } from "./supplier.controller.js"
import { existeSupplierById } from "../helpers/db-validator.js";
import { checkRolePermission } from "../helpers/validation-user.js";

const router = Router();

router.post(
    '/', 
    [
        validarJWT, 
        checkRolePermission
    ], 
    createSupplier
);

router.get(
    '/', 
    getSuppliers
);

router.get(
    '/:id',
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeSupplierById),
        validarCampos
    ],
    getSupplierById
);

router.put(
    '/:id', 
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeSupplierById),
        checkRolePermission,
        validarCampos
    ],
    updateSupplier
);

router.delete(
    '/:id', 
    [
        validarJWT,
        checkRolePermission,
        validarCampos
    ],
    deleteSupplier
);


export default router;
