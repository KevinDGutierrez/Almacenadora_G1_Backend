import Supplier from './supplier.model.js';
import mongoose from "mongoose";

export const createSupplier = async (req, res) => {
    try {
      const { name, email, phone, address, productsSupplied } = req.body;
  
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          msg: "El nombre y el correo electrónico son obligatorios",
        });
      }
  
      const supplier = new Supplier({ name, email, phone, address, productsSupplied, });
  
      await supplier.save();
  
      return res.status(201).json({
        success: true,
        msg: "Proveedor creado correctamente",
        supplier,
      });
  
    } catch (error) {
      console.error("🔥 Error en createSupplier:", error);
  
      if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(400).json({
          success: false,
          msg: "El correo electrónico ya existe",
        });
      }
  
      return res.status(500).json({
        success: false,
        msg: "Error al crear el proveedor",
        error: error.message,
        detalle: error, 
      });
    }
  };
  

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ status: true });
        return res.status(200).json(suppliers);
    } catch (error) {
        console.error("Error en getSuppliers:", error);
        return res.status(500).json({ success: false, msg: "Error al obtener proveedores", error: error.message });
    }
};

export const getSupplierById = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          msg: "ID inválido",
        });
      }
  
      const supplier = await Supplier.findById(id);
      if (!supplier) {
        return res.status(404).json({
          success: false,
          msg: "Proveedor no encontrado",
        });
      }
  
      return res.status(200).json({
        success: true,
        supplier,
      });
    } catch (error) {
      console.error("Error en getSupplierById:", error);
      return res.status(500).json({
        success: false,
        msg: "Error al obtener el proveedor",
        error: error.message,
      });
    }
  };

export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, productsSupplied } = req.body;

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { name, email, phone, address, productsSupplied },
            { new: true }
        );

        return res.status(200).json({ success: true, msg: "Proveedor actualizado correctamente", supplier: updatedSupplier });
    } catch (error) {
        console.error("Error en updateSupplier:", error);
        return res.status(500).json({ success: false, msg: "Error al actualizar el proveedor", error: error.message });
    }
};

export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const supplier = await Supplier.findById(id);
        if (!supplier || supplier.status === false) {
            return res.status(404).json({
                success: false,
                msg: "El proveedor no existe o ya está deshabilitado."
            });
        }
        await Supplier.findByIdAndUpdate(id, { status: false });

        return res.status(200).json({ success: true, msg: "Proveedor deshabilitado correctamente." });
    } catch (error) {
        console.error("Error en deleteSupplier:", error);
        return res.status(500).json({ success: false, msg: "Error al deshabilitar el proveedor", error: error.message });
    }
};