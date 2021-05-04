'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('CHUDE_KHOAHOC', {
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
            CHUDEKHId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'CHUDEKH',
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
        await queryInterface.dropTable('CHUDE_KHOAHOC');
    }
};