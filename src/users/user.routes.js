import { Router } from 'express';
import { check } from 'express-validator';
import {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from './user.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeUserById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
  '/register',
  registerValidator,
  deleteFileOnError,
  validarCampos,
  register
);

router.post(
  '/login',
  loginValidator,
  deleteFileOnError,
  login
);

router.get('/list', getUsers);

router.get(
  '/search',
  validarJWT,
  getUserById
);

router.put(
  '/update',
  validarJWT,
  updateUser
);

router.put(
  '/delete',
  validarJWT,
  deleteUser
);

export default router;
