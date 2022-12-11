const {Sequelize} = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        dialect:'postgres',
        host: process.env.PGHOST,
        port: process.env.DB_PORT || 5432,
        logging: false,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true
            }
        }
    }
);
