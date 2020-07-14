import { Sequelize, Op } from 'sequelize';
import { 
    account as AccountModel,
    Customer as CustomerModel,
    account_customer as AccountCustomerModel,
    transactions as TransactionsModel,
} from '../models';

class AccountController {

    static async post (request, response, next) {
        try {
            const { name, email, customerId, openingBalance = 0 } = request.body; 
            // check if customer exists with id and email
            const dbCustomer = await CustomerModel.findOne({
                where: {
                    [Op.and]: [
                        { id: customerId },
                        Sequelize
                            .where(
                                Sequelize.fn('lower', Sequelize.col('email')),
                                Sequelize.fn('lower', email),
                            ),
                    ]
                }
            });

            if (!dbCustomer) {
                return response.status(404).json({
                    success: false,
                    message: "Customer does not exist"
                });
            }

            // create account
            const dbAccount = await AccountModel.create({
                name, openingBalance, accountTypeId: 1
            });

            // insert to account_customers
            await AccountCustomerModel.create({
                customerId, accountId: dbAccount.id
            });

            // insert into transactions
            await TransactionsModel.create({
                accountId: dbAccount.id,
                credit: openingBalance,
                debit: 0,
                customerId
            });

            return response.status(201).json({
                success: true,
                message: "Account created successfully",
                data: dbAccount
            });

        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "An error occurred while processing your request"
            });
        }
    }
}

export default AccountController;
