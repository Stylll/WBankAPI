import { Sequelize } from 'sequelize';
import { Customer as CustomerModel } from '../models';

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

            return response.status(201).json({
                success: true,
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
}

export default CustomerController;
