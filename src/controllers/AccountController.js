import { Sequelize, Op } from 'sequelize';
import Utils from '../utils/Utils';
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

            const accountNo = Utils.generateAccountNo(dbAccount.id);
            dbAccount.accountNo = accountNo;
            await dbAccount.save();

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

    static async deposit (request, response, next) {
        try {
            const { customerId, email, amount, currency } = request.body;
            const { accountNo } = request.params;
            // check customer exists
            const customerExists = await Utils.checkCustomerExists(customerId, email);
            if (!customerExists) {
                return response.status(404).json({
                    success: false,
                    message: "Customer does not exist"
                });
            }

            // check account no exists
            const dbAccount = await AccountModel.findOne({
                where: {
                    accountNo
                }
            });
            if (!dbAccount) {
                return response.status(404).json({
                    success: false,
                    message: "Account number does not exist"
                });
            }

            // convert to cad
            const cadAmount = Utils.convertToCAD(currency, amount);

            // insert into transactions
            await TransactionsModel.create({
                accountId: dbAccount.id,
                credit: cadAmount,
                debit: 0,
                customerId
            });

            const responseData = {
                accountNo,
                accountName: dbAccount.name,
                amount,
                cadAmount,
                depositCurrency: currency,
            }

            // return response
            return response.status(201).json({
                success: true,
                message: "Deposit created successfully",
                data: responseData
            });

        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "An error occurred while processing your request"
            });
        }
    }

    static async withdraw (request, response, next) {
        try {
            const { customerId, email, amount, currency } = request.body;
            const { accountNo } = request.params;
            // check customer exists
            const customerExists = await Utils.checkCustomerExists(customerId, email);
            if (!customerExists) {
                return response.status(404).json({
                    success: false,
                    message: "Customer does not exist"
                });
            }

            // check account no exists
            const dbAccount = await AccountModel.findOne({
                where: {
                    accountNo
                }
            });
            if (!dbAccount) {
                return response.status(404).json({
                    success: false,
                    message: "Account number does not exist"
                });
            }

            // check customer is account owner
            const dbAccCustomer = await AccountCustomerModel.findOne({
                where: {
                    accountId: dbAccount.id,
                    customerId
                }
            });
            if (!dbAccCustomer) {
                return response.status(403).json({
                    success: false,
                    message: "Sorry, you don't have access to this account"
                });
            }

            // convert to CAD
            const cadAmount = Utils.convertToCAD(currency, amount);

            // check if customer has enough funds
            const balance = await Utils.getAccountBalance(dbAccount.id);
            if (balance < cadAmount) {
                return response.status(400).json({
                    success: false,
                    message: "Insufficient funds"
                });
            }

            // insert into transactions
            await TransactionsModel.create({
                accountId: dbAccount.id,
                credit: 0,
                debit: cadAmount,
                customerId
            });

            const responseData = {
                accountNo,
                accountName: dbAccount.name,
                amountDebited: amount,
                cadAmountDebited: cadAmount,
                debitCurrency: currency,
            }

            // return response
            return response.status(201).json({
                success: true,
                message: "Withdrawal created successfully",
                data: responseData
            });

        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "An error occurred while processing your request"
            });
        }
    }

    static async transfer (request, response, next) {
        try {
            const { customerId, email, amount, currency, transferAccountNo } = request.body;
            const { accountNo } = request.params;

            if (accountNo == transferAccountNo) {
                return response.status(400).json({
                    success: false,
                    message: "You can't transfer to the same account that will be debited"
                });
            }

            // check customer exists
            const customerExists = await Utils.checkCustomerExists(customerId, email);
            if (!customerExists) {
                return response.status(404).json({
                    success: false,
                    message: "Customer does not exist"
                });
            }

            // check account no exists
            const dbAccount = await AccountModel.findOne({
                where: {
                    accountNo
                }
            });
            if (!dbAccount) {
                return response.status(404).json({
                    success: false,
                    message: "Account number does not exist"
                });
            }

            // check transfer account no exists
            const dbTransferAccount = await AccountModel.findOne({
                where: {
                    accountNo: transferAccountNo
                }
            });
            if (!dbTransferAccount) {
                return response.status(404).json({
                    success: false,
                    message: "Transfer account number does not exist"
                });
            }

            // check customer is account owner
            const dbAccCustomer = await AccountCustomerModel.findOne({
                where: {
                    accountId: dbAccount.id,
                    customerId
                }
            });
            if (!dbAccCustomer) {
                return response.status(403).json({
                    success: false,
                    message: "Sorry, you don't have access to this account"
                });
            }

            // convert to CAD
            const cadAmount = Utils.convertToCAD(currency, amount);

            // check if customer has enough funds
            const balance = await Utils.getAccountBalance(dbAccount.id);
            if (balance < cadAmount) {
                return response.status(400).json({
                    success: false,
                    message: "Insufficient funds"
                });
            }

            // insert debit transactions
            await TransactionsModel.create({
                accountId: dbAccount.id,
                credit: 0,
                debit: cadAmount,
                customerId
            });

            // insert credit transaction
            await TransactionsModel.create({
                accountId: dbTransferAccount.id,
                credit: cadAmount,
                debit: 0,
                customerId
            });

            const responseData = {
                accountNo: dbAccount.accountNo,
                accountName: dbAccount.name,
                transfer: {
                    accountNo: dbTransferAccount.accountNo,
                    accountName: dbTransferAccount.name
                },
                amountTransferred: amount,
                cadAmountTransferred: cadAmount,
                transferCurrency: currency,
            }

            // return response
            return response.status(201).json({
                success: true,
                message: "Transfer created successfully",
                data: responseData
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
