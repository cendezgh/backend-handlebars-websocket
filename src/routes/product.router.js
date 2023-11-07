import express from 'express';
import { ProductManager } from '../managers/product.manager.js';

const createProductRouter = (socketServer) => {
  const router = express.Router();
  const productManager = new ProductManager('./src/data/products.json', socketServer);

  router.get('/', async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await productManager.getProducts();
      if (!limit) {
        res.status(200).json(products);
      } else {
        const limitedProducts = products.slice(0, limit);
        res.status(200).json(limitedProducts);
      }
    } catch (error) {
      console.log(error); 
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const productId = Number(pid);
      const product = await productManager.getProductById(productId);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const product = req.body;
      const createdProduct = await productManager.createProduct(product);
      // Emitir evento 'productCreated'
      socketServer.emit('productCreated', createdProduct);
      res.status(200).json(createdProduct);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.put('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const productId = Number(pid);
      const productUpdates = req.body;
      const updatedProduct = await productManager.updateProduct(productId, productUpdates);
      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json({ message: 'Product updated successfully' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const productId = Number(pid);
      const deletedProduct = await productManager.deleteProduct(productId);
      if (!deletedProduct) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        // Emitir evento 'productDeleted'
        socketServer.emit('productDeleted', productId);
        res.status(200).json({ message: 'Product deleted successfully' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};

export default createProductRouter;
