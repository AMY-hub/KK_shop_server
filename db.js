const {Sequelize} = require('sequelize');
require('dotenv').config();

let sequelize;
console.log('NODE ENV',process.env.NODE_ENV);
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod") {
  sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://AMY-hub:kFE2rU5qGMxp@ep-bitter-frog-345662.eu-central-1.aws.neon.tech/neondb', {
    logging: false,
    ssl: true,
    dialectOptions: {
                ssl: {
                    require: true
                }
            }
  });
} else {
    sequelize = new Sequelize(
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
}

module.exports = sequelize;

