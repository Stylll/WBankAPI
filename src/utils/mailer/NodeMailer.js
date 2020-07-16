import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_ACCOUNT_PASSWORD,
    },
});

export {
    transporter,
};
