import { body, check } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, productExists } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("surname", "The surname is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username").optional().isString().withMessage("Enter a valid username"),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];

export const createClient = [
check("name", "El nombre es obligatorio").not().isEmpty().custom(productExists),
check("description", "La descripción es obligatoria").not().isEmpty(),
check("price", "El precio debe ser un número").isNumeric(),
check("stock", "El stock debe ser un número").isNumeric(),
check("category", "La categoría es obligatoria").not().isEmpty(),
validarCampos
];