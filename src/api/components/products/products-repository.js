const {Product} = require('../../../models');

/** get all products
 * @param {object} o
 * @returns {Promise}
 */

async function getProducts(o = {}){
    const { page_number=1, page_size=o.count, sort='price:asc', search=null} = o;

    let product = Product.find();

    //logik untuk search
    if(search){
        const[v,k] = search.split(':');
        const reg = new RegExp(k,'i');
        product = product.where(v,{$regex: reg});
    }

    //logik untuk validasi dan sorting
    let[sort_v, sort_o] = sort.split(':');
    sort_o = sort_o.toLowerCase();
    if(!['asc','desc'].includes(sort_o)){
        sort_v='price';
        sort_o='asc';
      }

    product = product.sort({[sort_v]: sort_o});

    const totalData =  product.clone().countDocuments();
    const total = await totalData;

    const total_pages = Math.ceil(total/page_size);
    
    if(page_size){
        product = product.skip((page_number-1) * page_size).limit(page_size);
    }

    const data = await product;

    const has_previous_page = page_number > 1;
    const has_next_page = page_number < total_pages;

    return{
        page_number,
        page_size: page_size || total,
        total_pages,
        count: total,
        has_previous_page,
        has_next_page,
        data,
    }
}

/** get product by id
 * @param {string} id
 * @returns {Promise}
 */

async function getProduct(id){
    return Product.findById(id);
}

/**
 * Create new product
 * @param {string} name_product - Name
 * @param {string} description - Description
 * @param {number} price - Price
 * @returns {Promise}
 */

async function createProduct(name_product, description, price){
    return Product.create({
        name_product,
        description,
        price,
    });
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} name_product - Name
 * @param {string} description - description
 * @param {number} price - Price
 * @returns {Promise}
 */
async function updateProduct(id, name_product, description, price){
    return Product.updateOne(
        {
            _id: id,
        },
        {
            $set: {
                name_product,
                description,
                price
            },
        }
    );
}

/**
 * delete a product
 * @param {string} id
 * @returns {Promise}
 */
async function deleteProduct(id){
    return Product.deleteOne({_id: id});
}

/**
 * membuat review baru di product
 * @param {string} product_id - Product ID
 * @param {string} user_id - User ID
 * @param {string} text - Review content
 * @returns {Promise}
 */
async function createReview(product_id, user_id, text){
    const product = await Product.findById(product_id);

    if(!product){
        throw new Error('Product not found');
    }

    product.reviews.push({name_id: user_id, text});
    await product.save();
}

/**
 * mendapatkan review di product 
 * @param {string} product_id - Product ID
 * @returns {Promise}
 */
async function getProductReviews(product_id){
    const product = await Product.findById(product_id);

    if(!product){
        throw new Error('Product not found');
    }

    return product.reviews;
}

async function deleteReview(product_id, review_id){
    const product = await Product.findById(product_id);

    if(!product){
        throw new Error('Product not founc');
    }

    const review_index = product.reviews.findIndex(review => review._id.toString() === review_id);
    if(review_id === -1){
        throw new Error('Review not found');
    }

    product.reviews.splice(review_index, 1);
    await product.save();
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