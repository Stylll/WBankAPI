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
import {
    accountsWithId,
    transactions,
    accountCustomers
} from '../helpers/accounts';

describe('Accounts Test', () => {
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

    describe('Create Account Test Suite', () => {
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

        it('should require account name', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .set({
                    'x-access-token': userTokenA,
                })
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                name: 'Account name is required'
            });
        });

        it('should require an existing customer id and email', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .set({
                    'x-access-token': fakeUserToken,
                })
                .send({
                    name: 'MyAccount'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        })

        it('should not allow an invalid opening balance', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    openingBalance: 'seven',
                    name: 'MyAccount'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                openingBalance: 'Opening balance must be a number above 1',
            });
        });

        it('should not allow a negative opening balance', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    openingBalance: '-200',
                    name: 'MyAccount'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                openingBalance: 'Opening balance must be a number above 1',
            });
        });

        it('should create a valid bank account', async () => {
            await AccountModel.sync({ force: true });
            await AccountCustomerModel.sync({ force: true });
            await TransactionsModel.sync({ force: true });
            const response = await request(app)
                .post('/api/v1/accounts')
                .set({
                    'x-access-token': userTokenA,
                })
                .send({
                    openingBalance: '700',
                    name: 'MyAccount'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toEqual('Account created successfully');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('accountNo');
            expect(response.body.data.name).toEqual('MyAccount');
            expect(response.body.data.accountTypeId).toEqual(1);
            expect(response.body.data.openingBalance).toEqual(700);
        });
    });

    describe('Get Account Balance Test Suite', () => {
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

        it('should require an existing customer', async () => {
            const response = await request(app)
                .get('/api/v1/accounts/0002')
                .set({
                    'x-access-token': fakeUserToken,
                })
                .send();
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        });

        it('should require an existing account accountNo', async () => {
            const response = await request(app)
                .get('/api/v1/accounts/acoun32443')
                .set({
                    'x-access-token': userTokenA,
                })
                .send();
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Account number does not exist');
        });

        it('should require account owner as customer', async () => {
            const response = await request(app)
                .get(`/api/v1/accounts/${accountB.accountNo}`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send();
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toEqual('Sorry, you don\'t have access to this account');
        });

        it('should return account details and balance', async () => {
            const response = await request(app)
                .get(`/api/v1/accounts/${accountA.accountNo}`)
                .set({
                    'x-access-token': userTokenA,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data).toEqual({
                accountNo: accountA.accountNo,
                accountName: accountA.name,
                openingBalance: accountA.openingBalance,
                currentBalance: accountA.openingBalance + transactions[3].credit,
            });
        });
    });

    describe('Get All Customer Account Test Suite', () => {
        it ('should require an authentication token', async () => {
            const response = await request(app)
                .get('/api/v1/accounts')
                .send();
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toEqual('Authentication failed. No token provided');
        });

        it('should require a valid token', async () => {
            const response = await request(app)
                .get('/api/v1/accounts')
                .set({
                    'x-access-token': 'eiueriuasd.34343.qwasdfrrr',
                })
                .send();
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toEqual('Token is invalid or has expired');
        });

        it('should require an existing customer', async () => {
            const response = await request(app)
                .get('/api/v1/accounts')
                .set({
                    'x-access-token': fakeUserToken,
                })
                .send();
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toEqual('Email or customer Id is incorrect');
        });

        it('should fetch all customer account', async () => {
            const response = await request(app)
                .get('/api/v1/accounts')
                .set({
                    'x-access-token': userTokenA,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual('Account records retrieved successfully');
            expect(response.body.data[0]).toEqual({
                accountNo: accountA.accountNo,
                accountName: accountA.name,
                openingBalance: accountA.openingBalance,
                currentBalance: accountA.openingBalance + transactions[3].credit
            });
        });
    });
});
