const jwt = require('jsonwebtoken');
const { Token } = require('../models/models');

class TokenService {
    
    createTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SEKRET_KEY, {
            expiresIn: '30m'
        });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SEKRET_KEY, {
            expiresIn: '30d'
        });

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, token) {
        const tokenExists = await Token.findOne({where: {userId}});
        if(tokenExists) {
            const updatedToken = await Token.update({refresh_token: token}, {where: {userId}});
            return {token: updatedToken};
        }

        const newToken = await Token.create({
            refresh_token: token,
            userId
        });
        return {token: newToken};
    }

    async deleteToken(refreshToken) {
        const deleted = await Token.destroy({
            where: {refresh_token: refreshToken}
        });
        return deleted;
    }

    validateAccessToken (token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_SEKRET_KEY);
            return userData;
        } catch {
            return null;
        }
    }

    validateRefreshToken (token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_SEKRET_KEY);
            return userData;
        } catch {
            return null;
        }
    }

    checkAuthFromHeader (authHeader) {
        if(!authHeader) {
            return null;
        }
        const token = authHeader.split(' ')[1];
        const userData = this.validateAccessToken(token);
        return userData;
    }

    async findRefreshToken(refreshToken) {
        const token = await Token.findOne({
            where: {refresh_token: refreshToken}
        });
        return token;
    }
};

module.exports = new TokenService();