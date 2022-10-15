require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const port = process.env.PORT ?? 8000;

const app = express();
app.use(cors());
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
        await sequelize.sync();
        app.listen(port, () => console.log(`Server starts at port: ${port}`));
    } catch(err) {
        console.log('Unable to connect DB: ', err);
    }
}

start();