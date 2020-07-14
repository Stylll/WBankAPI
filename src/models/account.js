
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate (models) {
            // define association here
            account.belongsToMany(models.Customer, {
                through: models.account_customer,
                as: 'customers',
                foreignKey: 'accountId'
            });
            account.belongsTo(models.account_types, {
                as: 'account_type',
                foreignKey: 'accountTypeId'
            });
        }
    }
    account.init({
        name: DataTypes.STRING,
        accountTypeId: DataTypes.INTEGER,
        openingBalance: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'account',
    });
    return account;
};
