import { Router } from "express";
import { check } from "express-validator";
import {
    createCategories,
    getCategorieById,
    updateCategorie,
    deleteCategorie} from "./categories-controller.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCategoriaById } from "../helpers/db-validator.js";
import { checkPermission } from "../helpers/validation-user.js";
import { validarJWT } from "../middlewares/validar-jwt.js";


const router = Router();

router.post(
    "/createCategory",
    [
        validarJWT, 
        check("name", "Name is required").not().isEmpty(),
        check("description", "description is required").not().isEmpty(),
        checkPermission,
        validarCampos
    ],
    createCategories
)

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos
    ],
    getCategorieById
)

router.put(
    "/:id",
    [
        validarJWT, 
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoriaById),
        checkPermission,
        validarCampos
    ],
    updateCategorie
)

router.delete(
    "/:id",
    [
        validarJWT, 
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoriaById),
        checkPermission,
        validarCampos
    ],
    deleteCategorie
)

export default router;