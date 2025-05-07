import { Router } from "express";
import {check} from "express-validator";
import {
    createProduct,
    getProducts,
    updateProduct,
    getSearchProductsByName,
    deleteProduct,
    getStockProducts,
    verificarVencimientos,
    getProductById
    } from "./product-controller.js"
import {validarCampos} from "../middlewares/validar-campos.js"
import { existeCategoriaById, existeProductById } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { checkPermission } from "../helpers/validation-user.js";
import { createProductValid } from "../middlewares/validator.js";


const router = Router();

router.get("/", getProducts)

router.post(
    "/createProduct",
    [
        validarJWT,
        checkPermission,
        createProductValid,
    ],
    createProduct
);


router.put(
    "/:id",
    [
        validarJWT,
        check("id","No es un ID valido").isMongoId(),
        check("id").custom(existeProductById),
        checkPermission,
        validarCampos
    ],
    updateProduct
)
router.get(
    "/productsName", getSearchProductsByName //?name={nameProduct}
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoriaById),
        checkPermission,
        validarCampos
    ],
    deleteProduct
)

router.get("/productsOutOfStock", getStockProducts);

router.get("/vencimientos/:diasAntes", verificarVencimientos)

export default router;
