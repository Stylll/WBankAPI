
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
      
        if (parseFloat(request.body.openingBalance, 10) <= 1) {
            request.errors.openingBalance = 'Opening balance must be a number above 1';
            return next();
        }
      
        request.body.openingBalance = Number.parseFloat(request.body.openingBalance, 10);
      
        return next();
    }

    static async AmountValidate (request, response, next) {
        if(!request.body.amount || !request.body.amount.trim()) {
            request.errors.amount = 'Amount is required'
            return next();
        }

        if (Number.isNaN(parseFloat(request.body.amount, 10))) {
            request.errors.amount = 'Amount must be a number above 1'
            return next();
        }
      
        if (/[^0-9.]/gi.test(request.body.amount) === true) {
            request.errors.amount = 'Amount must be a number above 1';
            return next();
        }
      
        if (parseFloat(request.body.amount, 10) <= 1) {
            request.errors.amount = 'Amount must be a number above 1';
            return next();
        }
      
        request.body.amount = Number.parseFloat(request.body.amount, 10);
      
        return next();
    }

    static async TransferAccountNoValidate (request, response, next) {
        if (!request.body.transferAccountNo || !request.body.transferAccountNo.trim()) {
            request.errors.transferAccountNo = 'Transfer account number is required';
            return next();
        }

        return next();
    }

    static async CurrencyValidate (request, response, next) {
        if (!request.body.currency || !request.body.currency.trim()) {
            request.errors.currency = 'Currency is required';
            return next();
        }

        const validCurrencies = ['usd', 'cad', 'mxn'];
        if (!validCurrencies.includes(request.body.currency.toLowerCase())) {
            request.errors.currency = 'Currency must be either usd, cad or mxn';
            return next();
        }

        request.body.currency = request.body.currency.toLowerCase();

        return next();
    }
}

export default AccountValidators;
