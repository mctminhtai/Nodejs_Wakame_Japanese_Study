'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('DS_LOP_HOC', {
            LOPHOCId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'LOPHOC',
                    key: 'id'
                },
            },
            GIANGVIENId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'GIANGVIEN',
                    key: 'id'
                },
            },
            THUId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'THU',
                    key: "id"
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
                return queryInterface.sequelize.query('ALTER TABLE "DS_LOP_HOC" ADD CONSTRAINT "dslophoc1" PRIMARY KEY ("LOPHOCId", "GIANGVIENId","THUId","TIETId")');
            })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('DS_LOP_HOC');
    }
};