const { errorResponder, errorTypes} = require('../../../core/errors');
const productService = require('./products-service');

/**
 * handle get list of product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next){
    try {
        const { page_number, page_size, sort, search } = request.query;
        const object = { page_number, page_size, sort, search };
        const products = await productService.getProducts(object);
        return response.status(200).json(products);
    } catch (error) {
        return next(error);
    }
}

/**
 * handle get list product by id request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next){
    try{
        const product_id = request.params.id;
        const product = await productService.getProduct(product_id);

        if(!product){
            throw errorResponder(
            errorTypes.UNPROCESSABLE_ENTITY,
            'Unknown product');
        }

        return response.status(200).json(product);
    }catch(e){
        return next(e);
    }
}

/**
 * Handle post product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next){
    try{
        const { name_product, description, price} = request.body;

        const success = await productService.createProduct(name_product, description, price);
        
        if(!success){
            throw errorResponder(
                errorTypes.UNPROCESSABLE_ENTITY,
                `Failed to create product`
            );
        }

        return response.status(200).json({name_product, description, price});
    }catch(e){
        return next(e);
    }
}

/**
 * Handle update of product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function updateProduct(request, response, next){
    try{
        const product_id = request.params.id;

        const{name_product, description, price} = request.body;

        const success = await productService.updateProduct(product_id, name_product, description, price);

        if(!success){
            throw errorResponder(
                errorTypes.UNPROCESSABLE_ENTITY,
                'Failed to update product'
            );
        }

        return response.status(200).json({id: product_id, name_product, description, price});
    }catch(e){
        return next(e);
    }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next){
    try{
        const product_id = request.params.id;
        
        const success = await productService.deleteProduct(product_id);
        if(!success){
            throw errorResponder(
                errorTypes.UNPROCESSABLE_ENTITY,
                'Failed to delete product'
            );
        }

        return response.status(200).json({id: product_id});
    } catch (e) {
        return next(e);
    }
}

/**
 * Handle  create review request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function createReview(request, response, next){
    try{
        const product_id = request.params.id;
        const {name_id, text} = request.body;

        const success = await productService.createReview(product_id, name_id, text);

        if(!success){
            throw errorResponder(
                errorTypes.UNPROCESSABLE_ENTITY,
                'Failed to create review for the product'
              );
        };

        return response.status(200).json({product_id, name_id, text});
    }catch(e){
        return next(e);
    }
}

/**
 * Handle get reviews in product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProductReviews(request, response, next){
    try{
        const product_id = request.params.id;
        const  reviews = await productService.getProductReviews(product_id);

        return response.status(200).json(reviews);
    }catch(e){
        return next(e);
    }
}

/**
 * Handle delete review request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteReview(request, response, next) {
    try {
        const product_id = request.params.id;
        const review_id = request.params.review_id;

        await productService.deleteReview(product_id, review_id);

        return response.status(200).json({ product_id, review_id });
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createReview,
    getProductReviews,
    deleteReview
};