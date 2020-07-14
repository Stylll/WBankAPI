import express from 'express';
import CustomerController from '../controllers/CustomerController';
import CustomerValidators from '../middlewares/CustomerValidators';
import ErrorHandler from '../middlewares/ErrorHandler';
import AsyncWrapper from '../utils/AsyncWrapper';

const customerRoutes = express.Router();

customerRoutes.post(
    '/customers', AsyncWrapper(CustomerValidators.NameValidate),
    AsyncWrapper(CustomerValidators.EmailValidate), ErrorHandler.handleErrors,
    CustomerController.post,
);

customerRoutes.post(
    '/customers/authenticate', AsyncWrapper(CustomerValidators.CustomerIdValidate),
    AsyncWrapper(CustomerValidators.EmailValidate), ErrorHandler.handleErrors,
    CustomerController.authenticate,
);

export default customerRoutes;
