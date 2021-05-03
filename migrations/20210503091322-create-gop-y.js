'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('GOP_Y', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            NAME: {
                type: Sequelize.STRING
            },
            EMAIL: {
                type: Sequelize.STRING
            },
            SUBJECT: {
                type: Sequelize.STRING(1024)
            },
            MESSENGER: {
                type: Sequelize.TEXT('long')
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
        await queryInterface.dropTable('GOP_Y');
    }
};