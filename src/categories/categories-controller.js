import { response, request } from "express";
import Categorie from "../categories/categories-model.js"
import { hash, verify } from "argon2";
import Product from "../product/product-model.js"

export const createCategories = async (req, res = response) => {
    try {
        const { name, description } = req.body;

        const categorie = new Categorie({ name: name, description: description });
        await categorie.save();

        return res.status(201).json({
            success: true,
            msg: "Categoría creada correctamente",
            categorie,
        });
    } catch (error) {
        console.error("Error en createCategorie:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al crear categoría",
        });
    }
};

export const getCategoria = async (req, res) => {
    try {
        const categories = await Categorie.find();
        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontraron categorías'
            });
        }

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener categorías',
            error: error.message
        });
    }
};

export const getCategorieById = async (req, res) => {
    try {
        const { id } = req.params;
        const categorie = await Categorie.findById(id);

        if (!categorie) {
            return res.status(404).json({
                succes: false,
                msg: 'Categoría no encontrada'
            });
        }

        return res.status(200).json({
            succes: true,
            categorie
        });

    } catch (error) {
        return res.status(500).json({
            succes: false,
            msg: 'Error al obtener categoría',
            error
        });
    }
};

export const updateCategorie = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;


        if (data.password) {
            data.password = await hash(data.password);
        }

        const categorie = await Categorie.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).json({
            succes: true,
            msg: 'Updated categorie',
            categorie
        });

    } catch (error) {
        return res.status(500).json({
            succes: false,
            msg: 'Error updating categorie',
            error
        });
    }
};

export const deleteCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        const categorie = await Categorie.findByIdAndUpdate(id, { status: false }, { new: true });
        console.log(categorie)
        const defaultCategorie = await Categorie.findOne({ name: 'defecto' });


        const product = await Product.find({ categorie: id });

        await Promise.all(
            product.map(async (prdct) => {
                prdct.categorie = defaultCategorie._id;
                return prdct.save();
            })
        );

        return res.status(200).json({
            success: true,
            message: 'Deleted categorie',
            categorie
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting categorie',
            error: err.message
        });
    }
}

export const createDefaultCategory = async () => {
    try {
      const existingCategory = await Categorie.findOne({ name: "General" });
  
      if (!existingCategory) {
        const newCategory = new Categorie({
          name: "General",
          description: "Categoría predeterminada",
          status: true,
        });
        await newCategory.save();
        console.log("--> Categoría por defecto creada correctamente.");
      }  else {
        console.log("Categories already exists");
      }
    } catch (error) {
      console.error("--> Error al crear la categoría por defecto:", error);
    }
  };