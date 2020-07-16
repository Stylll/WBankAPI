import { Sequelize, Op } from 'sequelize';
import {
    Customer as CustomerModel,
    transactions as TransactionModel,
    sequelize
} from '../models';

class Utils {
    static generateAccountNo (accountId) {
        return `${accountId}`.padStart(4, '0');
    }

    static async checkCustomerExists (customerId, email) {
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

        return !!dbCustomer;
    }

    static convertToCAD (currency, amount) {
        const pesosRate = 10.00;
        const usdRate = 0.50;
        const cadRate = 1.00;
        if (currency === 'cad') return amount;
        if (currency === 'pesos') {
            const cadAmount = (amount * cadRate) / pesosRate;
            return Number.parseFloat(cadAmount.toFixed(2));
        }
        if (currency === 'usd') {
            const cadAmount = (amount * cadRate) / usdRate;
            return Number.parseFloat(cadAmount.toFixed(2));
        }
    }

    static async getAccountBalance (accountId) {
        const transaction = await TransactionModel.findAll({
            where: {
                accountId
            },
            attributes: [
                'accountId',
                [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
                [sequelize.fn('sum', sequelize.col('debit')), 'debit'],
            ],
            group: ['accountId']
        });

        const result = transaction['0'];
        const balance = result.credit - result.debit;

        return Number.parseFloat(balance).toFixed(2);
    }
}

export default Utils;
