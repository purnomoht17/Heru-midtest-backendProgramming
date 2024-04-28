const joi = require('joi');

module.exports = {
    createProduct: {
        body: {
            name_product: joi.string().min(3).max(100).required().label('Name'),
            description: joi.string().min(1).required().label('Description'),
            price: joi.number().min(0).required().label('Price'),
        },
    },

    updateProduct: {
        body: {
            name_product: joi.string().min(3).max(100).label('Name'),
            description: joi.string().min(1).label('Description'),
            price: joi.number().min(0).label('Price'),
        },
    },

    createReview: {
        body: {
            name_id: joi.string().required().label('User'),
            text: joi.string().min(1).required().label('Content'),
        }
    },

    updateReview: {
        body: {
            name_id: joi.string().required().label('User'),
            text: joi.string().min(1).required().label('Content'),
        }
    }
}