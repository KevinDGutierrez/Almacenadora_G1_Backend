import { Router } from 'express';
import Product from '../../src/product/product-model.js'; 

const router = Router();

router.get('/informe-inventario', async (req, res) => {
  try {
    const productos = await Product.find();  

    const totalProductos = productos.reduce((total, producto) => total + producto.cantidadEnStock, 0);
    const valorInventario = productos.reduce((total, producto) => total + (producto.cantidadEnStock * producto.precio), 0);

    res.json({
      totalProductos,
      valorInventario,
      productos, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el informe de inventario');
  }
});

export default router;
