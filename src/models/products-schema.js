const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text : {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const productSchema = new Schema({
    name_product: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    reviews : [reviewSchema]
});

module.exports = productSchema