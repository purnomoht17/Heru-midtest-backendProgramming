const productRepository = require('./products-repository');

//mengambil semua product beserta reviewnya jika ada
async function getProducts(o = {}){
    const products = await productRepository.getProducts(o);

    const data = [];
    for(let i = 0; i < products.data.length; i++){
        const product = products.data[i];
        data.push({
            id: product.id,
            name_product: product.name_product,
            description: product.description,
            price: product.price,
            reviews: product.reviews
        });
    }

    return {
        page_number: products.page_number,
        page_size: products.page_size,
        total_pages: products.total_pages,
        count: products.count,
        has_previous_page: products.has_previous_page,
        has_next_page: products.has_next_page,
        data: data,
    };
}

//mengambil produk menggunakan id beserta reviewnya jika ada
async function getProduct(id){
    const product = await productRepository.getProduct(id);

    if(!product){
        return null;
    }

    return {
        id: product.id,
        name_product: product.name_product,
        description: product.description,
        price: product.price,
        reviews: product.reviews
      };
}

//post product
//dimana dibutuhkan nama produk, descirptsi produk, dan harga produk, semuanya wajib
async function createProduct(name_product, description, price){
    try{
        await productRepository.createProduct(name_product, description, price);

        return true;
    } catch(e){
        return null;
    }
}

//update produk jika terjadi kesalah dalam nama produk, description, maupuun harga
async function updateProduct(id, name_product, description, price){
    const product = await productRepository.getProduct(id);

    if(!product){
        return null;
    }

    try{
        await productRepository.updateProduct(id, name_product, description, price);

        return true;
    }catch(e){
        return null;
    }
}

//hapus product
async function deleteProduct(id){
    const product = await productRepository.getProduct(id);

    if(!product){
        return null;
    }

    try{
        await productRepository.deleteProduct(id);

        return true;
    }catch(e){
        return null;
    }
}

//membuat review pada sebuah produk
async function createReview(product_id, user_id, text){
    try{
        await productRepository.createReview(product_id, user_id, text);

        return true;
    }catch(e){
        return null;
    }
}

async function getProductReviews(product_id){
    try{
        const reviews = await productRepository.getProductReviews(product_id);

        return reviews;
    }catch(e){
        throw new Error(`Failed to get product reviews: ${e.message}`);
    }
}

//hapus review
async function deleteReview(product_id, review_id){
    try{
        await productRepository.deleteReview(product_id, review_id);

        return true;
    }catch(e){
        throw new Error(`Failed to delete review ${e.message}`);
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
}