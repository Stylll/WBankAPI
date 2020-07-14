// require('babel-core/register')
require('dotenv').config();

const config = {
    development: {
        url: process.env.DB_URL,
        dialect: 'postgres'
    },
    test: {
        url: process.env.TEST_DB_URL,
        dialect: 'postgres'
    },
    prod: {
        url: process.env.PROD_DB_URL,
        dialect: 'postgres'
    }
}

module.exports = config;
