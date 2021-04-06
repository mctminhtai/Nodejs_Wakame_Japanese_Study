'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TIET_THU', {
            THUId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'THU',
                    key: 'id'
                }
            },
            TIETId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TIET',
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
        })
            .then(() => {
                return queryInterface.sequelize.query('ALTER TABLE "TIET_THU" ADD CONSTRAINT "hocvao" PRIMARY KEY ("THUId", "TIETId")');
            })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('TIET_THU');
    }
};