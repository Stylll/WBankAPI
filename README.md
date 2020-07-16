# WBankAPI
A small scale banking app to manage customer accounts

## Features
* User can create a customer account
* User can create a bank account
* User can deposit to a bank account
* User can withdraw from their bank account
* User can transfer to a bank account
* User can view their list of bank account

## Requirements

* Node.js v10.x or higher
* npm
* PostgreSQL

# Getting Started
**Via Cloning The Repository**
```
# Clone the app
git clone https://github.com/Stylll/wbankapi.git

# Switch to directory
cd wbankapi

# Create .env file in the root directory
touch .env
update env file with required information
use the .env.sample file as a guideline

# Install Package dependencies
npm install

#Start the application
npm run start:dev

You should now be able to access the API via http://localhost:port/api/v1/
```

## Built with
* [NodeJS](https://nodejs.org/en/) - A Javascript runtime built runtime that uses an event-driven non-blocking I/O model that makes it lightweight and efficient.
* [ExpressJS](http://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. This is used in this application for routing to endpoints.
* [NPM](https://www.npmjs.com/) - A Node Package Dependency Manager
* [PGSQL](https://www.postgresql.org/) - Opened source relational database

#### Linter(s)

* [ESLint](https://eslint.org/) - Linter Tool

#### Compiler

* [Babel](https://eslint.org/) - Compiler for Next Generation JavaScript


## License and Copyright

&copy; Stephen Aribaba

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
