
class AccountValidators {
    static async NameValidate (request, response, next) {
        if (!request.body.name || !request.body.name.trim()) {
            request.errors.name = "Account name is required"
        }
        return next();
    }

    static async EmailValidate (request, response, next) {
        if (!request.body.email || !request.body.email.trim()) {
            request.errors.email = 'Email is required';
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

    static async OpeningBalanceValidate (request, response, next) {
        if(!request.body.openingBalance || !request.body.openingBalance.trim()) {
            return next();
        }

        if (Number.isNaN(parseFloat(request.body.openingBalance, 10))) {
            request.errors.openingBalance = 'Opening balance must be a number above 1'
            return next();
        }
      
        if (/[^0-9.]/gi.test(request.body.openingBalance) === true) {
            request.errors.openingBalance = 'Opening balance must be a number above 1';
            return next();
        }
      
        if (parseFloat(request.body.openingBalance, 10) < 1) {
            request.errors.openingBalance = 'Opening balance must be a number above 1';
            return next();
        }
      
        request.body.openingBalance = Number.parseFloat(request.body.openingBalance, 10);
      
        return next();
    }
}

export default AccountValidators;
