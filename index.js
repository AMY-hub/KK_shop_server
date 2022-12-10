require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const sequelize = require('./db');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const port = process.env.PORT || 8080;

const whitelist = [
  'http://localhost:3000',
  'https://kk-shop.vercel.app',
  'https://kk-shop-amy-hub.vercel.app',
  'https://kkshop-3avj.onrender.com',
  'https://kkshop.onrender.com',
  'https://app.netlify.com/',
  'https://kk-shop.netlify.app/'
];

const corsOptions ={
    origin: (origin, callback) => {
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }, 
    credentials:true,           
    optionSuccessStatus:200,
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