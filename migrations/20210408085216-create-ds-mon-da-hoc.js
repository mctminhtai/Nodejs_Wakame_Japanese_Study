'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('DS_MON_DA_HOC', {
            MONHOCId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'MONHOC',
                    key: 'id'
                },
            },
            USERId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'USER',
                    key: 'id'
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then(() => {
            return queryInterface.sequelize.query('ALTER TABLE "DS_MON_DA_HOC" ADD CONSTRAINT "MON_DA_HOC" PRIMARY KEY ("MONHOCId","USERId")');
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('DS_MON_DA_HOC');
    }
};