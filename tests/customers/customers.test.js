import request from 'supertest';
import app from '../../src/app';
import { Customer as CustomerModel } from '../../src/models';
import { users } from '../helpers/users';

describe('Customer Test', () => {
    beforeEach(async () => {
        await CustomerModel.destroy({
            truncate: true
        });

        await CustomerModel.bulkCreate(users);
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
        });
    })
});
