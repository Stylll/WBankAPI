import request from 'supertest';
import app from '../../src/app';
import {
    Customer as CustomerModel,
    account as AccountModel,
    account_customer as AccountCustomerModel,
    transactions as TransactionsModel
} from '../../src/models';
import { usersWithId as users } from '../helpers/users';
import { accountsWithId, accountCustomers, transactions } from '../helpers/accounts';

describe('Withdrawal Test', () => {
    const userA = users[0];
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
        it('should require customer id, email, amount', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/withdraws')
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                customerId: 'Customer Id is required',
                email: 'Email is required',
                amount: 'Amount is required',
                currency: 'Currency is required'
            });
        });

        it('should require an existing customer', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/withdraws')
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
                    amount: '5000',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        });

        it('should require an existing account accountNo', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/acoun32443/withdraws')
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Account number does not exist');
        });

        it('should require account owner as customer', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountB.accountNo}/withdraws`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toEqual('Sorry, you don\'t have access to this account');
        });

        it('should require a valid amount', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/withdraws')
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
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
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
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
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Insufficient funds');
        });

        it('should not allow debit more than available balance (Pesos to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '50000',
                    currency: 'pesos'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Insufficient funds');
        });

        it('should create a withdraw transaction', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '50',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amountDebited).toEqual(50);
            expect(response.body.data.cadAmountDebited).toEqual(50);
            expect(response.body.data.debitCurrency).toEqual('cad');
        });

        it('should create a deposit transaction (Pesos to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '100',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amountDebited).toEqual(100);
            expect(response.body.data.cadAmountDebited).toEqual(10);
            expect(response.body.data.debitCurrency).toEqual('pesos');
        });

        it('should create a deposit transaction (USD to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/withdraws`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '10',
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amountDebited).toEqual(10);
            expect(response.body.data.cadAmountDebited).toEqual(20);
            expect(response.body.data.debitCurrency).toEqual('usd');
        });
    });
});
