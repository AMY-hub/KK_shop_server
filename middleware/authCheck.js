const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            res.status(401).json({message: "Пользователь не авторизован."});
        }
        const decodedToken = jwt.verify(token, process.env.SEKRET_KEY);
        req.user = decodedToken;
        next();

    } catch(err) {
        res.status(401).json({message: "Пользователь не авторизован."});
    }
};