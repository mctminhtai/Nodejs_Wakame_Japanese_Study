'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('KHOAHOC', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            TENKH: {
                type: Sequelize.STRING
            },
            KH_IMG: {
                type: Sequelize.STRING(1024)
            },
            DESCRIPTION: {
                type: Sequelize.STRING(1024)
            },
            SO_BAI_HOC: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            THONG_TIN_KH: {
                type: Sequelize.TEXT('long')
            },
            GIANGVIENId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'GIANGVIEN',
                    key: 'id'
                }
            },
            LUOT_XEM_KH: {
                type: Sequelize.INTEGER,
                defaultValue: 77
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
        await queryInterface.dropTable('KHOAHOC');
    }
};