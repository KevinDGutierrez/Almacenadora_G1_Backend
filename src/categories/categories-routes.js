import { Router } from "express";
import { check } from "express-validator";
import {
    createCategories,
    getCategorieById,
    updateCategorie,
    deleteCategorie} from "./categories-controller.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeUsuarioById } from "../helpers/db-validator.js";


const router = Router();

router.post(
    "/createCategory",
    [
        check("name", "Name is required").not().isEmpty(),
        check("description", "description is required").not().isEmpty(),
        validarCampos
    ],
    createCategories
)

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getCategorieById
)

router.put(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos

    ],
    updateCategorie
)

router.delete(
    "/:cid",
    [
        check("cid", "No es un ID valido").isMongoId(),
        //check("uid").custom(existeCategoriaById),
        validarCampos
    ],
    deleteCategorie
)






export default router;