import { response,request } from "express";
import Product from "./product-model.js";
import { hash, verify } from "argon2";


export const createProduct = async (req, res) => {
    try {
        const data = req.body;

        const productExistente = await Product.findOne({ name: data.name });
        if (productExistente) {
            return res.status(400).json({
                success: false,
                message: 'Product already exists'
            });
        }

        const product = new Product({ ...data });

        await product.save();

        return res.status(201).json({ success: true, product });

    } catch (error) {
        console.error('Error creating product', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, productsRaw] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('category', 'name')
                .populate('supplier', 'name')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);        

        return res.status(200).json({ success: true, total, products: productsRaw });

    } catch (error) {
        console.error("Error getting products", error);
        return res.status(500).json({ success: false, message: 'Error getting products', error: error.message });
    }
};

export const getSearchProductsByName = async (req, res) => {
    try {
        const { name } = req.query; 
        if (!name) { 
            return res.status(400).json({
                success: false,
                message: 'Debes proporcionar un nombre para buscar'
            });
        }
        const productos = await Producto.find({
            name: { $regex: name, $options: 'i' } 
        });
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron productos con ese nombre'
            });
        }
        res.status(200).json({
            success: true,
            productos,
            message: 'Productos encontrados'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar productos por nombre',
            error: error.message
        });
        console.error(error);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, ...data } = req.body;


        const productExists = await Product.findById(id);
        if (!productExists) {
            return res.status(404).json({
                succes: false,
                msg: "product not found",
            });
        }

        if (password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(password, salt);
        }


        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            succes: true,
            msg: "successfully updated product",
            product,
        });

    } catch (error) {
        console.error("error updating the product", error);

        return res.status(500).json({
            succes: false,
            msg: "error updating the product",
            error: error.message, 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {description} = req.params;

        if(!description){
            return res.status(404).json({
                succes:false,
                msg: "description not found"
            })
        }

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "product not found",

            });          

        }
        return res.status(200).json({
            success: true,
            msg: "product disposed correctly",
            product
        });

    } catch (error) {
        console.error("Error deleting product", error);
            console.log()
        return res.status(500).json({
            success: false,
            msg: "Error deleting product",
            error: error.message
        });
    }
};

export const getStockProducts = async (req = request, res = response) => {
    try {
        const lowStockProducts = await Product.find({
            $expr: { $lt: ["$stock", "$stockMinimo"] }
        });
        res.status(200).json({
            success: true,
            lowStockProducts,
            message: "Productos con stock bajo encontrados"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener productos con stock bajo",
            error: error.message,
        });
    }
};

export const verificarVencimientos = (product, diasAntes) => {
    const hoy = new Date();

    const productosProximosAVencerse = product.filter(producto => {

        const diferenciaDias = (new Date(producto.fechaVencimiento) - hoy) 

         (1000 * 60 * 60 * 24);
        return diferenciaDias <= diasAntes && diferenciaDias >= 0;
    });

    if (productosProximosAVencerse.length > 0) {
        console.log(" Productos próximos a vencer:");

        productosProximosAVencerse.forEach(product => {

            console.log(`- ${product.nombre}, Fecha de Vencimiento: 
            ${new Date(product.fechaVencimiento).toLocaleDateString()}`);
        });
    } else {
        console.log("No hay productos próximos a vencer.");
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        const isLowStock = product.stock < product.minimumStock;

        return res.json({
            success: true,
            product,
            lowStockWarning: isLowStock,
            message: isLowStock ? "  Low stock, consider replenishing." : "Stock level is sufficient."
        });

    } catch (error) {
        console.error("Error getting product", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};
