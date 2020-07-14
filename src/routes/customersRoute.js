import express from 'express';
import CustomerController from '../controllers/CustomerController';
import CustomerValidators from '../middlewares/CustomerValidators';
import ErrorHandler from '../middlewares/ErrorHandler';

const customerRoutes = express.Router();

customerRoutes.post(
    '/customers', CustomerValidators.NameValidate,
    CustomerValidators.EmailValidate, ErrorHandler.handleErrors,
    CustomerController.post,
);

export default customerRoutes;