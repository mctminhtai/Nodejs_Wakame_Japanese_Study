'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('COMMENT', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            USERId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'USER',
                    key: 'id'
                }
            },
            BLOGId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'BLOG',
                    key: 'id'
                }
            },
            cmcontent: {
                type: Sequelize.TEXT('tiny')
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
        await queryInterface.dropTable('COMMENT');
    }
};