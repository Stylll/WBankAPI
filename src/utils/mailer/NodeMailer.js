import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host:'in-v3.mailjet.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_ACCOUNT_PASSWORD,
    },
});

export {
    transporter,
};
