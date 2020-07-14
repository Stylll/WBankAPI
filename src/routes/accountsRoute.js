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

export default accountsRoutes;
