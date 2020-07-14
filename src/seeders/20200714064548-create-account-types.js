

module.exports = {
    up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
        await queryInterface.bulkInsert('account_types', [{
            id: 1,
            name: 'Checking',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            name: 'Joint',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
        await queryInterface.bulkDelete('account_types', null, {});
    }
};
