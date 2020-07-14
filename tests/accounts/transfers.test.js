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

describe('Transfer Test', () => {
    const userA = users[0];
    const userB = users[2];
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

    describe('Transfer between accounts test suite', () => {
        it('should require customer id, email, amount, transferAccountNo', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/transfers')
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                customerId: 'Customer Id is required',
                email: 'Email is required',
                amount: 'Amount is required',
                transferAccountNo: 'Transfer account number is required',
                currency: 'Currency is required'
            });
        });

        it('should require an existing customer', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/transfers')
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
                    amount: '5000',
                    currency: 'Pesos',
                    transferAccountNo: '589450'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        });

        it('should require an existing account accountNo', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/acoun32443/transfers')
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    currency: 'Pesos',
                    transferAccountNo: '589450'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Account number does not exist');
        });

        it('should require an existing account transferAccountNo', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountB.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    currency: 'Pesos',
                    transferAccountNo: '340923'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Transfer account number does not exist');
        });

        it('should require account owner as customer', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountB.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    currency: 'CAD',
                    transferAccountNo: accountA.accountNo
                });
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toEqual('Sorry, you don\'t have access to this account');
        });

        it('should require a valid amount', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/transfers')
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
                    amount: 'five thousand',
                    accountNo: 'acoun32443',
                    transferAccountNo: accountB.accountNo,
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                amount: 'Amount must be a number above 1'
            });
        });

        it('should require an amount above 1', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0002/transfers')
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
                    amount: '1',
                    accountNo: 'acoun32443',
                    transferAccountNo: accountB.accountNo,
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                amount: 'Amount must be a number above 1'
            });
        });

        it('should not allow debit more than available balance', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    transferAccountNo: accountB.accountNo,
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Insufficient funds');
        });

        it('should not allow transfer on the same account', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    transferAccountNo: accountA.accountNo,
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('You can\'t transfer to the same account that will be debited');
        });

        it('should not allow debit more than available balance (Pesos to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '50000',
                    transferAccountNo: accountB.accountNo,
                    currency: 'pesos'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Insufficient funds');
        });

        it('should create a transfer transaction', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '50',
                    transferAccountNo: accountB.accountNo,
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Transfer created successfully');
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.transfer.accountNo).toEqual(accountB.accountNo);
            expect(response.body.data.transfer.accountName).toEqual(accountB.name);
            expect(response.body.data.amountTransferred).toEqual(50);
            expect(response.body.data.cadAmountTransferred).toEqual(50);
            expect(response.body.data.transferCurrency).toEqual('cad');
        });

        it('should create a deposit transaction (Pesos to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '100',
                    transferAccountNo: accountB.accountNo,
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Transfer created successfully');
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.transfer.accountNo).toEqual(accountB.accountNo);
            expect(response.body.data.transfer.accountName).toEqual(accountB.name);
            expect(response.body.data.amountTransferred).toEqual(100);
            expect(response.body.data.cadAmountTransferred).toEqual(10);
            expect(response.body.data.transferCurrency).toEqual('pesos');
        });

        it('should create a deposit transaction (USD to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/transfers`)
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '10',
                    transferAccountNo: accountB.accountNo,
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Transfer created successfully');
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.transfer.accountNo).toEqual(accountB.accountNo);
            expect(response.body.data.transfer.accountName).toEqual(accountB.name);
            expect(response.body.data.amountTransferred).toEqual(10);
            expect(response.body.data.cadAmountTransferred).toEqual(20);
            expect(response.body.data.transferCurrency).toEqual('usd');
        });
    });
});
