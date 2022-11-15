class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest() {
        return new ApiError(404, 'Страница не найдена');
    }

    static internal(message) {
        return new ApiError(500, message);
    }

    static forbidden() {
        return new ApiError(403, 'Доступ запрещен');
    }

    static unauthorized() {
        return new ApiError(401, 'Пользователь не авторизован');
    }
};

module.exports = ApiError;