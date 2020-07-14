import validator from 'validator';
import Authenticate from '../utils/Authenticate';

class CustomerValidators {
    static async TokenValidate (request, response, next) {
        const token = request.body.token || request.query.token
              || request.headers['x-access-token'];
        if (!token) {
            return response.status(401).json({
                success: false,
                message: "Authentication failed. No token provided"
            });
        }
        const decoded = Authenticate.verifyToken(token);
        if (!decoded) {
            return response.status(401).json({
                success: false,
                message: "Token is invalid or has expired"
            });
        } else {
            // put the decoded user object in the request
            request.decoded = decoded;
        }

        return next();
    }

    static async NameValidate (request, response, next) {
        if (!request.body.name || !request.body.name.trim()) {
            request.errors.name = "Name is required"
        }
        return next();
    }

    static async EmailValidate (request, response, next) {
        if (!request.body.email || !request.body.email.trim()) {
            request.errors.email = 'Email is required';
            return next();
        }
        // check if email is valid
        if (!validator.isEmail(request.body.email.trim())) {
            request.errors.email = 'Email is invalid';
            return next();
        }

        return next();
    }

    static async CustomerIdValidate (request, response, next) {
        if (!request.body.customerId || !request.body.customerId.trim()) {
            request.errors.customerId = 'Customer Id is required';
            return next();
        }

        return next();
    }
}

export default CustomerValidators;
