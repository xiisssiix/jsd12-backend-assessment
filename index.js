const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Custom request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleString('th-TH')} ${req.method} ${req.url}`);
  next();
});

const products = [];

function validateProductData(data, allowPartial = false) {
  const errors = [];

  if (!allowPartial || data.hasOwnProperty('name')) {
    if (!data.name || typeof data.name !== 'string') {
      errors.push('name is required and must be a string');
    }
  }

  if (!allowPartial || data.hasOwnProperty('price')) {
    if (typeof data.price !== 'number' || Number.isNaN(data.price)) {
      errors.push('price is required and must be a number');
    }
  }

  if (!allowPartial || data.hasOwnProperty('quantity')) {
    if (data.quantity !== undefined && (typeof data.quantity !== 'number' || Number.isNaN(data.quantity))) {
      errors.push('quantity must be a number');
    }
  }

  return errors;
}

app.get('/products', (req, res) => {
  let results = [...products];

  if (req.query.name) {
    const name = req.query.name.toLowerCase();
    results = results.filter((product) => product.name.toLowerCase().includes(name));
  }

  if (req.query.minPrice) {
    const minPrice = Number(req.query.minPrice);
    if (!Number.isNaN(minPrice)) {
      results = results.filter((product) => product.price >= minPrice);
    }
  }

  if (req.query.sort === 'price') {
    results.sort((a, b) => a.price - b.price);
  } else if (req.query.sort === '-price') {
    results.sort((a, b) => b.price - a.price);
  }

  res.json(results);
});

app.get('/products/:id', (req, res, next) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }
  res.json(product);
});

app.post('/products/bulk', (req, res, next) => {
  if (!Array.isArray(req.body)) {
    const error = new Error('Request body must be an array of products');
    error.status = 400;
    return next(error);
  }

  if (req.body.length !== 5) {
    const error = new Error('Bulk product creation requires exactly 5 products');
    error.status = 400;
    return next(error);
  }

  const createdProducts = [];

  for (let index = 0; index < req.body.length; index += 1) {
    const item = req.body[index];
    const { name, price, quantity = 1 } = item;
    const body = { name, price, quantity };
    const errors = validateProductData(body);

    if (errors.length > 0) {
      const error = new Error(`Product validation error: ${errors.join(', ')}`);
      error.status = 400;
      return next(error);
    }

    const id = String(index + 1);

    if (products.some((product) => product.id === id)) {
      const error = new Error(`Product with id ${id} already exists`);
      error.status = 400;
      return next(error);
    }

    const product = {
      id,
      name: name.trim(),
      price,
      quantity
    };

    products.push(product);
    createdProducts.push(product);
  }

  res.status(201).json(createdProducts);
});

app.post('/products', (req, res, next) => {
  const { name, price, quantity = 1 } = req.body;
  const body = { name, price, quantity };
  const errors = validateProductData(body);

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    return next(error);
  }

  const product = {
    id: String(Date.now()),
    name: name.trim(),
    price,
    quantity
  };

  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res, next) => {
  const productIndex = products.findIndex((item) => item.id === req.params.id);
  if (productIndex === -1) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }

  const { name, price, quantity = 1 } = req.body;
  const body = { name, price, quantity };
  const errors = validateProductData(body);

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    return next(error);
  }

  products[productIndex] = {
    id: products[productIndex].id,
    name: name.trim(),
    price,
    quantity
  };

  res.json(products[productIndex]);
});

app.patch('/products/:id', (req, res, next) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }

  const errors = validateProductData(req.body, true);
  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    return next(error);
  }

  if (req.body.name !== undefined) {
    product.name = req.body.name.trim();
  }
  if (req.body.price !== undefined) {
    product.price = req.body.price;
  }
  if (req.body.quantity !== undefined) {
    product.quantity = req.body.quantity;
  }

  res.json(product);
});

app.delete('/products/:id', (req, res, next) => {
  const index = products.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }

  products.splice(index, 1);
  res.json({ message: 'Product deleted successfully' });
});

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
