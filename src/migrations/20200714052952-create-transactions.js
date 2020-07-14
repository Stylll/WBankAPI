
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            accountId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'accounts',
                    key: 'id'
                }
            },
            credit: {
                type: Sequelize.FLOAT
            },
            debit: {
                type: Sequelize.FLOAT
            },
            customerId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Customers',
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transactions');
    }
};
