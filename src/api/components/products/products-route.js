const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productController = require('./products-controller');
const productValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
    app.use('/products', route);

    // Get products
    route.get('/', authenticationMiddleware, productController.getProducts);

    // Create product
    route.post('/', authenticationMiddleware, celebrate(productValidator.createProduct) ,productController.createProduct);

    // Get product by ID
    route.get('/:id', authenticationMiddleware, productController.getProduct);

    // Update product
    route.put('/:id', authenticationMiddleware, celebrate(productValidator.updateProduct), productController.updateProduct);

    // Delete product
    route.delete('/:id', authenticationMiddleware, productController.deleteProduct);

    // Create review for product
    route.post('/:id/reviews', authenticationMiddleware, celebrate(productValidator.createReview), productController.createReview);

    // Get reviews for product
    route.get('/:id/reviews', authenticationMiddleware, productController.getProductReviews);

    //delete review
    route.delete('/:id/reviews/:reviewId', authenticationMiddleware, productController.deleteReview);
};
