
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate (models) {
            // define association here
            transactions.belongsTo(models.account, {
                as: 'account',
                foreignKey: 'accountId'
            });
            transactions.belongsTo(models.Customer, {
                as: 'customer',
                foreignKey: 'customerId'
            });
        }
    }
    transactions.init({
        accountId: DataTypes.INTEGER,
        credit: DataTypes.FLOAT,
        debit: DataTypes.FLOAT,
        customerId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'transactions',
    });
    return transactions;
};
