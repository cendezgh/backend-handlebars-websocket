import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import viewRouter from "./routes/views.router.js";
import { ProductManager } from './managers/product.manager.js';

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));

app.engine('handlebars', handlebars.engine());
app.set("views", __dirname + "/views");
app.set('view engine', 'handlebars');

app.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts")
});

app.use("/", viewRouter);

socketServer.on('connection', async(socket) => {
  const productsFilePath = './src/data/products.json';
  const productManager = new ProductManager(productsFilePath);
  const productsData = await productManager.getProducts();

  socket.emit('arrayProducts', productsData);
  console.log(`New client connected ${socket.id}`);

  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on("newProduct", async (product) => {
    const newProduct = await productManager.createProduct(product);

    if (newProduct) {
      const updatedProducts = await productManager.getProducts();
      socketServer.emit("arrayProducts", updatedProducts);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    let idToDelete = Number(productId);
    const deleted = await productManager.deleteProduct(idToDelete);

    if (deleted) {
      const updatedProducts = await productManager.getProducts();
      socketServer.emit("arrayProducts", updatedProducts);
    }
  });
});

export default app;
