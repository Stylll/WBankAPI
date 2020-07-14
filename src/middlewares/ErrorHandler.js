import { isEmpty } from 'lodash';

class ErrorHandler {
    static handleErrors (request, response, next) {
        if (!isEmpty(request.errors)) {
            return response.status(400).json({ errors: request.errors });
        }
        return next();
    }
}

export default ErrorHandler;