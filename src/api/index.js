const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const product = require('./components/products/products-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  product(app);

  return app;
};
