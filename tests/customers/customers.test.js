import request from 'supertest';
import app from '../../src/app';
import { Customer as CustomerModel } from '../../src/models';
import { users, usersWithId } from '../helpers/users';

describe('Customer Test', () => {
    beforeEach(async () => {
        await CustomerModel.sync({ force: true });

        await CustomerModel.bulkCreate(users);
    });

    afterAll(async () => {
        await CustomerModel.sync({ force: true });
    })

    describe('Customer POST', () => {
        it('should require name and email', async () => {
            const response = await request(app)
                .post('/api/v1/customers')
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                name: 'Name is required',
                email: 'Email is required'
            });
        });
        it('should require a valid email', async () => {
            const response = await request(app)
                .post('/api/v1/customers')
                .send({
                    name: 'Matthew Murdock',
                    email: 'matthew.com'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                email: 'Email is invalid'
            });
        });
        it('should check if customer email already exists', async () => {
            const response = await request(app)
                .post('/api/v1/customers')
                .send({
                    name: 'Matthew Murdock',
                    email: 'justin@bieber.com'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body.message).toEqual('Email already exists. Try another one.');
        });
        it('should create a new customer', async () => {
            const response = await request(app)
                .post('/api/v1/customers')
                .send({
                    name: 'Matthew Murdock',
                    email: 'matthew@murdock.com'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toEqual('Customer created successfully');
            expect(response.body.data.name).toEqual('Matthew Murdock');
            expect(response.body.data.email).toEqual('matthew@murdock.com');
            expect(response.body).toHaveProperty('token');
        });
    })

    describe('Customer Authenticate', () => {
        it('should require id and email', async () => {
            const response = await request(app)
                .post('/api/v1/customers/authenticate')
                .send();
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                customerId: 'Customer Id is required',
                email: 'Email is required'
            });
        });

        it('should return error for invalid customer id', async () => {
            await CustomerModel.sync({ force: true });
            await CustomerModel.bulkCreate(usersWithId);
            const response = await request(app)
                .post('/api/v1/customers/authenticate')
                .send({
                    customerId: 'abc',
                    email: 'email@yah.com'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toEqual({
                customerId: 'Customer Id must be a number',
            });
        });

        it('should return error for wrong values', async () => {
            await CustomerModel.sync({ force: true });
            await CustomerModel.bulkCreate(usersWithId);
            const response = await request(app)
                .post('/api/v1/customers/authenticate')
                .send({
                    customerId: '2124',
                    email: 'email@yah.com'
                });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toEqual('Email or customer Id is incorrect');
        });

        it('should return customer with token', async () => {
            await CustomerModel.sync({ force: true });
            await CustomerModel.bulkCreate(usersWithId);
            const response = await request(app)
                .post('/api/v1/customers/authenticate')
                .send({
                    customerId: usersWithId[0].id,
                    email: usersWithId[0].email
                });
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual('Customer authenticated successfully');
            expect(response.body.data.name).toEqual(usersWithId[0].name);
            expect(response.body.data.email).toEqual(usersWithId[0].email);
            expect(response.body.data.id).toEqual(usersWithId[0].id);
            expect(response.body).toHaveProperty('token');
        });
    })
});
