import request from 'supertest';
import app from '../../src/app';
import {
    Customer as CustomerModel,
    account as AccountModel,
    account_customer as AccountCustomerModel,
    transactions as TransactionsModel
} from '../../src/models';
import {
    customUsers,
    customTokenStewie,
    customTokenGlen,
    customTokenJoe,
    customTokenPeter,
    customTokenLois,
    customTokenJohn
} from '../helpers/users';
import { 
    customAccounts,
    customAccountCustomers,
    customTransactions
} from '../helpers/accounts';

describe('Test suite for cases provided in the challenge', () => {
    beforeAll(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });
        await TransactionsModel.sync({ force: true });
        await CustomerModel.bulkCreate(customUsers);
        await AccountModel.bulkCreate(customAccounts);
        await AccountCustomerModel.bulkCreate(customAccountCustomers);
        await TransactionsModel.bulkCreate(customTransactions);
    });

    afterAll(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });
        await TransactionsModel.sync({ force: true });
    });

    describe('Cases 1 - 4', () => {
        it('should return correct balance for stewie griffin', async () => {
            let response = await request(app)
                .post(`/api/v1/accounts/1234/deposits`)
                .set({
                    'x-access-token': customTokenStewie,
                })
                .send({
                    amount: '300',
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .get(`/api/v1/accounts/1234`)
                .set({
                    'x-access-token': customTokenStewie,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data.currentBalance).toEqual("700.00");
            expect(response.body.data.accountNo).toEqual('1234');
        });

        it('should return correct balance for glen quagmire', async () => {
            let response = await request(app)
                .post(`/api/v1/accounts/2001/withdraws`)
                .set({
                    'x-access-token': customTokenGlen,
                })
                .send({
                    amount: '5000',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .post(`/api/v1/accounts/2001/withdraws`)
                .set({
                    'x-access-token': customTokenGlen,
                })
                .send({
                    amount: '12500',
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .post(`/api/v1/accounts/2001/deposits`)
                .set({
                    'x-access-token': customTokenGlen,
                })
                .send({
                    amount: '300',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .get(`/api/v1/accounts/2001`)
                .set({
                    'x-access-token': customTokenGlen,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data.currentBalance).toEqual("9800.00");
            expect(response.body.data.accountNo).toEqual('2001');
        });

        it('should return correct balance for joe swanson', async () => {
            let response = await request(app)
                .post(`/api/v1/accounts/5500/withdraws`)
                .set({
                    'x-access-token': customTokenJoe,
                })
                .send({
                    amount: '5000',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .post(`/api/v1/accounts/1010/transfers`)
                .set({
                    'x-access-token': customTokenJoe,
                })
                .send({
                    amount: '7300',
                    transferAccountNo: '5500',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .post(`/api/v1/accounts/1010/deposits`)
                .set({
                    'x-access-token': customTokenJoe,
                })
                .send({
                    amount: '13726',
                    currency: 'Pesos'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .get(`/api/v1/accounts/1010`)
                .set({
                    'x-access-token': customTokenJoe,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data.currentBalance).toEqual("1497.60");
            expect(response.body.data.accountNo).toEqual('1010');

            response = await request(app)
                .get(`/api/v1/accounts/5500`)
                .set({
                    'x-access-token': customTokenJoe,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data.currentBalance).toEqual("17300.00");
            expect(response.body.data.accountNo).toEqual('5500');
        });

        it('should return correct balance for peter griffin and lois griffin', async () => {
            let response = await request(app)
                .post(`/api/v1/accounts/0123/withdraws`)
                .set({
                    'x-access-token': customTokenPeter,
                })
                .send({
                    amount: '70',
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .post(`/api/v1/accounts/0456/deposits`)
                .set({
                    'x-access-token': customTokenLois,
                })
                .send({
                    amount: '23789',
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .post(`/api/v1/accounts/0456/transfers`)
                .set({
                    'x-access-token': customTokenLois,
                })
                .send({
                    amount: '23.75',
                    transferAccountNo: '0123',
                    currency: 'CAD'
                });
            expect(response.statusCode).toBe(201);

            response = await request(app)
                .get(`/api/v1/accounts/0123`)
                .set({
                    'x-access-token': customTokenPeter,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data.currentBalance).toEqual("33.75");
            expect(response.body.data.accountNo).toEqual('0123');

            response = await request(app)
                .get(`/api/v1/accounts/0456`)
                .set({
                    'x-access-token': customTokenLois,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data.currentBalance).toEqual("112554.25");
            expect(response.body.data.accountNo).toEqual('0456');
        });
    });

    describe('Case 5', () => {
        beforeAll(async () => {
            await TransactionsModel.sync({ force: true });
            await TransactionsModel
                .bulkCreate([customTransactions[2]]);
        });
        
        it('it should return correct amount for Joe Swanson', async () => {
            let response = await request(app)
                .post(`/api/v1/accounts/1010/withdraws`)
                .set({
                    'x-access-token': customTokenJohn,
                })
                .send({
                    amount: '100',
                    currency: 'USD'
                });
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toEqual('Sorry, you don\'t have access to this account');

            response = await request(app)
                .get(`/api/v1/accounts/1010`)
                .set({
                    'x-access-token': customTokenJoe,
                })
                .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Account details retrieved successfully');
            expect(response.body.data.currentBalance).toEqual("7425.00");
            expect(response.body.data.accountNo).toEqual('1010');
        })
    });
})
