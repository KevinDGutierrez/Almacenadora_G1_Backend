import Client from '../client/client.model.js'
import Supplier from '../suppliers/supplier.model.js'

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
    const supplierExist = await Product.findById(id);

    if (!supplierExist) {
        throw new Error(`El producto con ID ${id} no existe`);
    }
};

export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
};