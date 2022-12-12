require('dotenv').config();
const https = require('https');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const sequelize = require('./db');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const port = process.env.PORT || 8080;

const corsOptions ={
    origin: [
        'http://localhost',
        'https://kkshop.vercel.app',
        'https://kk-shop-server.vercel.app',
        'https://app.kkshop.site',
        'https://api.kkshop.site'
    ], 
    credentials:true,           
    optionSuccessStatus:200,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
}

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api', router);

//Error handler - last middleware:
app.use(errorHandler);


app.get('/', (req, res) => {
    res.status(200).json({message: "Hello"})
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        app.listen(port, () => console.log(`Server starts at port: ${port}`));
    } catch(err) {
        console.log('Unable to connect DB: ', err);
    }
}

start();

module.exports = app;