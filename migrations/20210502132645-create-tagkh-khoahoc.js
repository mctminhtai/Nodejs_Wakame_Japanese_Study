'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TAGKH_KHOAHOC', {
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
            TAGKHId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TAGKH',
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
        await queryInterface.dropTable('TAGKH_KHOAHOC');
    }
};