import request from 'supertest';
import app from '../../src/app';
import {
    Customer as CustomerModel,
    account as AccountModel,
    account_customer as AccountCustomerModel,
    transactions as TransactionsModel
} from '../../src/models';
import {
    usersWithId as users,
    userTokenA,
    fakeUserToken
} from '../helpers/users';
import { accountsWithId, accountCustomers, transactions } from '../helpers/accounts';

describe('Withdrawal Test', () => {
    const accountA = accountsWithId[0];
    const accountB = accountsWithId[2];
    beforeEach(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });
        await TransactionsModel.sync({ force: true });
        await CustomerModel.bulkCreate(users);
        await AccountModel.bulkCreate(accountsWithId);
        await AccountCustomerModel.bulkCreate(accountCustomers);
        await TransactionsModel.bulkCreate(transactions);
    });

    afterAll(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });
        await TransactionsModel.sync({ force: true });
    });

    describe('Withdraw from account test suite', () => {
        it ('should require an authentication token', async () => {
            const response = await request(app)
                .get('/api/v1/accounts/0002')
                .send();
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toEqual('Authentication failed. No token provided');
        });

        it('should require a valid token', async () => {
            const response = await request(app)
                .get('/api/v1/accounts/0002')
                .set({
                    'x-access-token': 'eiueriuasd.34343.qwasdfrrr',
                })
                .send();
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toEqual('Token is invalid or has expired');
        });

        it('should require amount', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/withdraws')
                .set({
                    'x-access-token': userTokenA,
                })
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                amount: 'Amount is required',
                currency: 'Currency is required'
            });
        });

        it('should require an existing customer', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/withdraws')
                .set({
                    'x-access-token': fakeUserToken,
                })
                .send({
                    amount: '5000',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        });

        it('should require an existing account accountNo', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/acoun32443/withdraws')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '5000',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Account number does not exist');
        });

        it('should require account owner as customer', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountB.accountNo}/withdraws`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '5000',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toEqual('Sorry, you don\'t have access to this account');
        });

        it('should require a valid amount', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/withdraws')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: 'five thousand',
                    accountNo: 'acoun32443',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                amount: 'Amount must be a number above 1'
            });
        });

        it('should require an amount above 1', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/withdraws')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '1',
                    accountNo: 'acoun32443',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                amount: 'Amount must be a number above 1'
            });
        });

        it('should not allow debit more than available balance', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '5000',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Insufficient funds');
        });

        it('should not allow debit more than available balance (Pesos to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '50000',
                    currency: 'pesos'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Insufficient funds');
        });

        it('should create a withdraw transaction', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '50',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Withdrawal created successfully');
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amountDebited).toEqual(50);
            expect(response.body.data.cadAmountDebited).toEqual(50);
            expect(response.body.data.debitCurrency).toEqual('cad');
        });

        it('should create a deposit transaction (Pesos to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '100',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Withdrawal created successfully');
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amountDebited).toEqual(100);
            expect(response.body.data.cadAmountDebited).toEqual(10);
            expect(response.body.data.debitCurrency).toEqual('pesos');
        });

        it('should create a deposit transaction (USD to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '10',
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Withdrawal created successfully');
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amountDebited).toEqual(10);
            expect(response.body.data.cadAmountDebited).toEqual(20);
            expect(response.body.data.debitCurrency).toEqual('usd');
        });
    });
});
