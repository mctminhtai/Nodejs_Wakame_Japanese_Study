'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TKB_DU_KIEN', {
            USERId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'USER',
                    key: 'id'
                },
            },
            LOPHOCId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'LOPHOC',
                    key: 'id'
                },
            },
            THUId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'THU',
                    key: 'id'
                },
            },
            TIETId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TIET',
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
        })
            .then(() => {
                return queryInterface.sequelize.query('ALTER TABLE "TKB_DU_KIEN" ADD CONSTRAINT "TKB" PRIMARY KEY ("USERId", "LOPHOCId","THUId","TIETId")');
            })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('TKB_DU_KIEN');
    }
};