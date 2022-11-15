const ApiError = require('../error/apiError');
const productService = require('../services/productService');

class ProductController {

    async getAll(req, res, next) {
        try{
            const products = await productService.getProducts(req.query);

            return res.json({products}); 
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                return next(ApiError.badRequest());
            }
            const deleted = await productService.deleteProduct(id);

            return res.json(deleted);
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async getProduct(req, res, next) {
        try {
            const id = req.params.id;
            if(!id) {
                return next(ApiError.badRequest());
            }
            const product = await productService.getProductById(id);

            return res.json({product});
        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const {img} = req.files;
            const {product_add_images} = req.files;

            const product = await productService.createProduct(req.body, img, product_add_images)

           return res.json({product});
        } catch(err) {
            next(ApiError.internal(err.message));
        }

    }
};

module.exports = new ProductController();