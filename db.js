const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'korean_cosm',
    'postgres',
    'admin',
    {
        dialect:'postgres',
        host: 'localhost',
        port: 5432
    }
);