
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class account_customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate (models) {
            // define association here
        }
    }
    account_customer.init({
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Customers',
                key: 'id'
            }
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'accounts',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'account_customer',
    });
    return account_customer;
};
