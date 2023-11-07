import express from 'express';
import morgan from 'morgan';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import viewRouter from "./routes/views.router.js";
import fs from 'fs';

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

app.use('/api/products', productRouter(socketServer));
app.use('/api/carts', cartRouter);

app.use("/", viewRouter);

socketServer.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

socketServer.on('connection', async(socket) => {
  const productsFilePath = './src/data/products.json';
  const productsData = await fs.readFileSync(productsFilePath, 'utf-8');
  const products = JSON.parse(productsData);
  console.log(`New client connected ${socket.id}`);
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on("newProduct", (product)=>{
    products.push(product);
    socketServer.emit("arrayProducts", products);
  })
});
