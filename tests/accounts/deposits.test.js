import request from 'supertest';
import app from '../../src/app';
import {
    Customer as CustomerModel,
    account as AccountModel,
    account_customer as AccountCustomerModel
} from '../../src/models';
import {
    usersWithId as users,
    userTokenA,
    fakeUserToken
} from '../helpers/users';
import { accountsWithId, accountCustomers } from '../helpers/accounts';

describe('Deposits Test', () => {
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

        it('should require amount and currency', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0023/deposits')
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
                .post('/api/v1/accounts/0023/deposits')
                .set({
                    'x-access-token': fakeUserToken,
                })
                .send({
                    amount: '5000',
                    currency: 'MXN'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        });

        it('should require an existing account accountNo', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/acoun32443/deposits')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '5000',
                    currency: 'MXN'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Account number does not exist');
        });

        it('should require a valid amount', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0023/deposits')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: 'five thousand',
                    currency: 'MXN'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                amount: 'Amount must be a number above 1'
            });
        });

        it('should require an amount above 1', async () => {
            const response = await request(app)
                .post('/api/v1/accounts/0023/deposits')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '1',
                    currency: 'MXN'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                amount: 'Amount must be a number above 1'
            });
        });

        it('should create a deposit transaction', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/deposits`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '5000',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amount).toEqual(5000);
            expect(response.body.data.cadAmount).toEqual(5000);
            expect(response.body.data.depositCurrency).toEqual('cad');
        });

        it('should create a deposit transaction (MXN to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/deposits`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '5120',
                    currency: 'MXN'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.data.accountNo).toEqual(accountA.accountNo);
            expect(response.body.data.accountName).toEqual(accountA.name);
            expect(response.body.data.amount).toEqual(5120);
            expect(response.body.data.cadAmount).toEqual(512);
            expect(response.body.data.depositCurrency).toEqual('mxn');
        });

        it('should create a deposit transaction (USD to CAD)', async () => {
            const response = await request(app)
                .post(`/api/v1/accounts/${accountA.accountNo}/deposits`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    amount: '5000',
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
