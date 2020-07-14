import { Sequelize, Op } from 'sequelize';
import { Customer as CustomerModel } from '../models';
import Authenticate from '../utils/Authenticate';

class CustomerController {

    static async post (request, response) {
        try {
            const { name, email } = request.body;
            // check if email already exists
            const dbEmail = await CustomerModel.findAll({
                where: Sequelize
                    .where(
                        Sequelize.fn('lower', Sequelize.col('email')),
                        Sequelize.fn('lower', email),
                    ),
            });

            if (dbEmail.length) {
                return response.status(409).json({
                    success: false,
                    message: "Email already exists. Try another one."
                });
            }

            // create customer
            const newCustomer = await CustomerModel.create({
                name, email
            });

            const token = Authenticate.authenticateUser({
                id: newCustomer.id,
                email: newCustomer.email,
                name: newCustomer.name
            });

            return response.status(201).json({
                success: true,
                token,
                message: "Customer created successfully",
                data: newCustomer
            });
        } catch(error) {
            return response.status(500).json({
                success: false,
                message: "Unexpected Server Error",
            });
        }
    }

    static async authenticate (request, response, next) {
        try {
            const { customerId: id, email } = request.body;
            const dbCustomer = await CustomerModel.findOne({
                where: {
                    [Op.and]: [
                        { id },
                        Sequelize
                            .where(
                                Sequelize.fn('lower', Sequelize.col('email')),
                                Sequelize.fn('lower', email),
                            ),
                    ]
                }
            });

            if (!dbCustomer) {
                return response.status(401).json({
                    success: false,
                    message: "Email or customer Id is incorrect"
                });
            }

            const token = Authenticate.authenticateUser({
                id: dbCustomer.id,
                email: dbCustomer.email,
                name: dbCustomer.name
            });

            return response.status(200).json({
                success: true,
                token,
                data: {
                    id: dbCustomer.id,
                    email: dbCustomer.email,
                    name: dbCustomer.name,
                },
                message: "Customer authenticated successfully"
            });

        } catch(error) {
            return response.status(500).json({
                success: false,
                message: "Unexpected Server Error",
            });
        }
    }
}

export default CustomerController;
