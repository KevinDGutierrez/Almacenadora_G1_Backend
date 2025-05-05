import { Router } from "express";
import {check} from "express-validator";
import {
    createProduct,
    getProducts,
    updateProduct,
    getSearchProductsByName,
    deleteProduct,
    getStockProducts,
    verificarVencimientos 
    } from "./product-controller.js"
import {validarCampos} from "../middlewares/validar-campos.js"
import { existeProductById } from "../helpers/db-validator.js";


const router = Router();

router.get("/", getProducts)

router.post(
    "/createProduct",
    [
        check("name", "Name is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
        validarCampos
    ],
    createProduct
);


router.put(
    "/:uid",
    [
        check("uid","No es un ID valido").isMongoId(),
        check("uid").custom(existeProductById),
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
        check("id", "No es un ID valido").isMongoId(),
        //check("id").custom(existeCategoriaById),
        validarCampos
    ],
    deleteProduct
)

router.get("/productsOutOfStock", getStockProducts);

router.get("/vencimientos/:diasAntes", verificarVencimientos)

export default router;
