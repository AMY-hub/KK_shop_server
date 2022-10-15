module.exports = (req, res, next) => {
    try {
        if(req.user.role !== 'ADMIN') {
            return res.status(403).json({message: "Нет доступа"});
        } else {
            next();
        }  
    } catch(err) {
        res.status(401).json({message: "Пользователь не авторизован."});
    }
};