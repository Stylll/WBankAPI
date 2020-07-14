
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        }
    }, {});
    Customer.associate = function (models) {
    // associations can be defined here
    };
    return Customer;
};
