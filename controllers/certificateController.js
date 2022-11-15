const crypto = require('crypto');
const path = require('path');
const ApiError = require('../error/apiError');
const { Certificate } = require('../models/models');

class CertificateController {

    async getAll(req, res, next) {
        try{
            const certificates = await Certificate.findAll();
            return res.json({certificates}); 

        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteCertificate(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await Certificate.destroy({ where: {id} });

            return res.json({message: `Удалено: ${deleted}`});

        } catch(err) {
            next(ApiError.internal(err.message));
        }
    }

    async createCertificate(req, res, next) {
        try {
            const {name, price } = req.body;
            
            const {img} = req.files;

            const fileName = crypto.randomUUID() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const certificate = await Certificate.create({
                name, 
                price, 
                img: fileName
            }); 

           return res.json({certificate});

        } catch(err) {
            next(ApiError.internal(err.message));
        }

    }
};

module.exports = new CertificateController();