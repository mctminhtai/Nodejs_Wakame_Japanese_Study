'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('BAIHOC', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            KHOAHOCId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'KHOAHOC',
                    key: 'id'
                }
            },
            TEN_BAI_HOC: {
                type: Sequelize.STRING
            },
            LINK_BAIHOC: {
                type: Sequelize.STRING(1024)
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
        await queryInterface.dropTable('BAIHOC');
    }
};