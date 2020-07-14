import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Authenticate {
    static authenticateUser (customer) {
        const payload = {
            id: customer.id,
            email: customer.email,
            name: customer.name
        };
        const token = jwt.sign(
            {
                user: payload,
            },
            process.env.SECRET,
            {
                expiresIn: '24h',
            },
        );
        return token;
    }

    static verifyToken (token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET);
        } catch (error) {
            return null;
        }
        return decoded;
    }
}

export default Authenticate;
