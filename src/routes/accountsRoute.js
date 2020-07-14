import express from 'express';
import AccountController from '../controllers/AccountController';
import AccountValidators from '../middlewares/AccountValidators';
import CustomerValidators from '../middlewares/CustomerValidators';
import ErrorHandler from '../middlewares/ErrorHandler';
import AsyncWrapper from '../utils/AsyncWrapper';

const accountsRoutes = express.Router();

accountsRoutes.post(
    '/accounts', CustomerValidators.TokenValidate, AsyncWrapper(AccountValidators.NameValidate),
    AsyncWrapper(AccountValidators.OpeningBalanceValidate),
    ErrorHandler.handleErrors, AccountController.post,
);

accountsRoutes.post(
    '/accounts/:accountNo/deposits', CustomerValidators.TokenValidate,
    AsyncWrapper(AccountValidators.AmountValidate),
    AsyncWrapper(AccountValidators.CurrencyValidate),
    ErrorHandler.handleErrors, AccountController.deposit,
)

accountsRoutes.post(
    '/accounts/:accountNo/withdraws', CustomerValidators.TokenValidate,
    AsyncWrapper(AccountValidators.AmountValidate),
    AsyncWrapper(AccountValidators.CurrencyValidate),
    ErrorHandler.handleErrors, AccountController.withdraw,
)

accountsRoutes.post(
    '/accounts/:accountNo/transfers', CustomerValidators.TokenValidate,
    AsyncWrapper(AccountValidators.TransferAccountNoValidate),
    AsyncWrapper(AccountValidators.AmountValidate),
    AsyncWrapper(AccountValidators.CurrencyValidate),
    ErrorHandler.handleErrors, AccountController.transfer,
)

accountsRoutes.get(
    '/accounts/:accountNo', CustomerValidators.TokenValidate,
    AccountController.account
)

accountsRoutes.get(
    '/accounts', CustomerValidators.TokenValidate,
    AccountController.accounts
)

export default accountsRoutes;
