import User from '../users/user.model.js'
import Client from '../client/client.model.js'
import Supplier from '../suppliers/supplier.model.js'
import Product from '../product/product-model.js'
import Categories from '../categories/categories-model.js'

export const clientExists = async (name = '') => {
    const clientExists = await Client.findOne({ name });

    if (clientExists) {
        throw new Error(`El cliente "${name}" ya existe`);
    }
};

export const supplierExists = async (name = '') => {
    const supplierExists = await Supplier.findOne({ name });

    if (supplierExists) {
        throw new Error(`El proveedor "${name}" ya existe`);
    }
};

export const existeSupplierById = async (id = '') => {
    const supplierExist = await Supplier.findById(id);

    if (!supplierExist) {
        throw new Error(`El proveedor con ID ${id} no existe`);
    }
};

export const existenteEmail = async (email = ' ') => {
    
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
};

export const existeUserById = async (id = '') => {
    const existeUser = await User.findById(id);

    if (!existeUser) {
        throw new Error(`El ID ${ id } no es un usuario válido`);
    }
};


export const productExists = async (id = '') => {
    const productExists = await Product.findById(id);

    if (!productExists) {
        throw new Error(`El ID ${ id } no es un usuario válido`);
    }
};

export const existeProductById = async (uid = "") => {
    const existeProduct = await Product.findById(uid);
    
    if (!existeProduct) {
        throw new Error(`The product with id ${uid} does not exist in the database`);
    }
};
