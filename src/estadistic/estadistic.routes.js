import { Router } from 'express';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import Product from '../product/product-model.js';  

const router = Router();

router.get('/estadisticas', async (req, res) => {
  try {
    const productos = await Product.find(); 

    if (!productos || productos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron productos para generar estadísticas'
      });
    }

    const productosMasMovidos = productos.sort((a, b) => b.stock - a.stock).slice(0, 5);  

    const productosNombres = productosMasMovidos.map(producto => producto.name);  
    const productosStock = productosMasMovidos.map(producto => producto.stock);  

    const width = 800; 
    const height = 600; 
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration = {
      type: 'bar',
      data: {
        labels: productosNombres,  
        datasets: [{
          label: 'Cantidad en Stock',
          data: productosStock,  
          backgroundColor: 'rgba(75, 192, 192, 0.2)', 
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',  
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);  
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename=graphic.png'); 
    res.send(imageBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener estadísticas');
  }
});

export default router;
