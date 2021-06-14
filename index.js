const express = require('express');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const errorController = require('./controllers/error');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use('/api/customer', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoriesRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

app.listen(port, () => console.log(`Listening on port ${port}`));
