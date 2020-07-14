import request from 'supertest';
import app from '../../src/app';
import {
    Customer as CustomerModel,
    account as AccountModel,
    account_customer as AccountCustomerModel
} from '../../src/models';
import { usersWithId as users } from '../helpers/users';

describe('Accounts Test', () => {
    const userA = users[0];
    beforeEach(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });

        await CustomerModel.bulkCreate(users);
    });
    afterAll(async () => {
        await CustomerModel.sync({ force: true });
        await AccountModel.sync({ force: true });
        await AccountCustomerModel.sync({ force: true });
    });

    describe('Create Account Test Suite', () => {
        it('should require customer id, email, name', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                customerId: 'Customer Id is required',
                email: 'Email is required',
                name: 'Account name is required'
            });
        });

        it('should require an existing customer id and email', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .send({
                    customerId: '6432',
                    email: 'johnson@john.com',
                    name: 'MyAccount'
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toEqual('Customer does not exist');
        })

        it('should not allow an invalid opening balance', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .send({
                    customerId: userA.id,
                    email: userA.email,
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
                .send({
                    customerId: userA.id,
                    email: userA.email,
                    openingBalance: '-200',
                    name: 'MyAccount'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                openingBalance: 'Opening balance must be a number above 1',
            });
        });

        it('should create a valid bank account', async () => {
            const response = await request(app)
                .post('/api/v1/accounts')
                .send({
                    customerId: userA.id,
                    email: userA.email,
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
});
