import request from 'supertest';
import app from '../../src/app';
import {
    Customer as CustomerModel,
    account as AccountModel,
    account_customer as AccountCustomerModel
} from '../../src/models';
import { usersWithId as users } from '../helpers/users';
import { accountsWithId, accountCustomers } from '../helpers/accounts';

describe('Deposits Test', () => {
    const userA = users[0];
    const accountA = accountsWithId[0];
    beforeEach(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });
        await CustomerModel.bulkCreate(users);
        await AccountModel.bulkCreate(accountsWithId);
        await AccountCustomerModel.bulkCreate(accountCustomers);
    });

    afterAll(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });
    });

    describe('Deposit to account test suite', () => {
        it('should require customer id, email, amount and accountNo', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/deposits')
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                customerId: 'Customer Id is required',
                email: 'Email is required',
                amount: 'Amount is required',
                accountNo: 'AccountNo is required',
                currency: 'Currency is required'
            });
        });

        it('should require an existing customer', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/deposits')
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
                    amount: '5000',
                    accountNo: '0002',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        });

        it('should require an existing account accountNo', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/deposits')
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    accountNo: 'acoun32443',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Account number does not exist');
        });

        it('should require a valid amount', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/deposits')
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
                .post('/api/v1/accounts/deposits')
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

        it('should create a deposit transaction', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/deposits')
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    accountNo: accountA.accountNo,
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amount).toEqual(5000);
            expect(response.body.data.cadAmount).toEqual(5000);
            expect(response.body.data.depositCurrency).toEqual('cad');
        });

        it('should create a deposit transaction (Pesos to CAD)', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/deposits')
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5120',
                    accountNo: accountA.accountNo,
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amount).toEqual(5120);
            expect(response.body.data.cadAmount).toEqual(512);
            expect(response.body.data.depositCurrency).toEqual('pesos');
        });

        it('should create a deposit transaction (USD to CAD)', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/deposits')
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    amount: '5000',
                    accountNo: accountA.accountNo,
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amount).toEqual(5000);
            expect(response.body.data.cadAmount).toEqual(10000);
            expect(response.body.data.depositCurrency).toEqual('usd');
        });
    });
});
