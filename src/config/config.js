require('dotenv').config();

const config = {
    development: {
        url: process.env.DB_URL,
        dialect: 'postgres'
    },
    test: {
        url: process.env.TEST_DB_URL,
        dialect: 'postgres',
        logging: false
    },
    production: {
        url: process.env.PROD_DB_URL,
        dialect: 'postgres'
    }
}

module.exports = config;
