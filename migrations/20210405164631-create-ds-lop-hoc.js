'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('DS_LOP_HOC', {
            id: {
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            LOPHOCId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'LOPHOC',
                    key: 'id'
                },
                allowNull: false,
                primaryKey: true,
            },
            GIANG_VIENId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'GIANG_VIEN',
                    key: 'id'
                },
                allowNull: false,
                primaryKey: true,
            },
            ID_THU: {
                type: Sequelize.INTEGER,
                //allowNull: false,
                //references: {
                //    model: 'TIET_THU',
                //    key: 'ID_THU'
                //},
                allowNull: false,
                primaryKey: true,
            },
            ID_TIET: {
                type: Sequelize.INTEGER,
                //allowNull: false,
                //references: {
                //    model: 'TIET_THU',
                //    key: 'ID_TIET'
                //},
                allowNull: false,
                primaryKey: true,
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
        await queryInterface.dropTable('DS_LOP_HOC');
    }
};