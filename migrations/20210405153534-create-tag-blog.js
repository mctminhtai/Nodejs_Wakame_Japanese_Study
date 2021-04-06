'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TAG_BLOG', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            TAGId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TAG',
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
        await queryInterface.dropTable('TAG_BLOG');
    }
};