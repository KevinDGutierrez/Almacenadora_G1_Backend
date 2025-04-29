import { Router } from 'express';
//import Product from '../../models/product.js'; 

const router = Router();

router.get('/estadisticas', async (req, res) => {
  try {
    const productos = await Product.find();  

    const productosMasMovidos = productos.sort((a, b) => b.cantidadEnStock - a.cantidadEnStock).slice(0, 5);

    res.json({
      productosMasMovidos,
      totalProductos: productos.length, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener estadísticas');
  }
});

export default router;
