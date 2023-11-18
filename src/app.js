const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose'); // Import Mongoose

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

app.use(express.json());

const productsRouter = require('./routes/product');
const cartsRouter = require('./routes/cart');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.get('/chat', (req, res) => {
  res.render('chat', { layout: 'main' });
});

io.on('connection', (socket) => {
  socket.on('new-product', (product) => {
    io.emit('product-added', product);
  });
});

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
