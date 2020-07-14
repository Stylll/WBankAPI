import validator from 'validator';

class CustomerValidators {
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
}

export default CustomerValidators;
