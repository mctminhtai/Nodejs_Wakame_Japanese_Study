'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('BLOG', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            uuid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            USERId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'USER',
                    key: 'id'
                }
            },
            CATEGORYId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'CATEGORY',
                    key: 'id'
                }
            },
            blogimg: {
                type: Sequelize.STRING(1024)
            },
            title: {
                type: Sequelize.STRING(1024)
            },
            description: {
                type: Sequelize.STRING(1024)
            },
            content: {
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
        await queryInterface.dropTable('BLOG');
    }
};