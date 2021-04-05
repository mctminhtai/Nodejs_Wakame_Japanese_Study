'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('BLOG', {
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
            TAGId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TAG',
                    key: 'id'
                }
            },
            //sua cho nay luon
            title: {
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('BLOG');
    }
};