import express from 'express';
import morgan from 'morgan';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import exphbs from 'express-handlebars';

const app = express();
const PORT = 8080;

const httpServer = new Server(app);
const io = new SocketIOServer(httpServer);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use(express.static('public')); // Carpeta para archivos estáticos (CSS, JS, imágenes, etc.)

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
