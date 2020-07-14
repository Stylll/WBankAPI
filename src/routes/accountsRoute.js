import express from 'express';
import AccountController from '../controllers/AccountController';
import AccountValidators from '../middlewares/AccountValidators';
import ErrorHandler from '../middlewares/ErrorHandler';
import AsyncWrapper from '../utils/AsyncWrapper';

const accountsRoutes = express.Router();

accountsRoutes.post(
    '/accounts', AsyncWrapper(AccountValidators.NameValidate),
    AsyncWrapper(AccountValidators.CustomerIdValidate),
    AsyncWrapper(AccountValidators.EmailValidate),
    AsyncWrapper(AccountValidators.OpeningBalanceValidate),
    ErrorHandler.handleErrors, AccountController.post,
);

accountsRoutes.post(
    '/accounts/deposits', AsyncWrapper(AccountValidators.CustomerIdValidate),
    AsyncWrapper(AccountValidators.EmailValidate),
    AsyncWrapper(AccountValidators.AccountNoValidate),
    AsyncWrapper(AccountValidators.AmountValidate),
    AsyncWrapper(AccountValidators.CurrencyValidate),
    ErrorHandler.handleErrors, AccountController.deposit,
)

export default accountsRoutes;
