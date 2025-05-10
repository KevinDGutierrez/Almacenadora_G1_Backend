import { response,request } from "express";
import { hash, verify } from "argon2";
import Product from "./product-model.js";
import mongoose from "mongoose";
import { existeCategoriaById, existeSupplierById } from '../helpers/db-validator.js';

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            stock,
            supplier,
            description,
            entryDate, 
            fechaDeVencimiento,
            precioUnitario
        } = req.body;

        const categoryId = typeof category === 'object' ? category._id : category;
        const supplierId = typeof supplier === 'object' ? supplier._id : supplier;

        try {
            await existeCategoriaById(categoryId);
            await existeSupplierById(supplierId);
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        const newProduct = new Product({
            name,
            category: categoryId,
            stock,
            supplier: supplierId,
            description,
            fechaDeEntrada: entryDate, 
            fechaDeVencimiento,
            precioUnitario
        });

        await newProduct.save();

        res.status(201).json({ success: true, product: newProduct });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: true })
            .populate('category', 'name')  
            .populate('supplier', 'name');  

        return res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return res.status(500).json({ success: false, msg: "Error al obtener productos", error: error.message });
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
        const {
            name, description, category, stock,
            supplier, fechaDeVencimiento, fechaDeEntrada, precioUnitario
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "ID inválido" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, category, stock, supplier, fechaDeVencimiento, fechaDeEntrada, precioUnitario },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado para actualizar" });
        }

        return res.status(200).json({ success: true, msg: "Producto actualizado correctamente", product: updatedProduct });
    } catch (error) {
        console.error("Error en updateProduct:", error);
        return res.status(500).json({ success: false, msg: "Error al actualizar producto", error: error.message });
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "ID inválido" });
        }

        const product = await Product.findById(id)
            .populate('category', 'name')
            .populate('supplier', 'name');

        if (!product) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado" });
        }

        return res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Error en getProductById:", error);
        return res.status(500).json({ success: false, msg: "Error al obtener producto", error: error.message });
    }
};