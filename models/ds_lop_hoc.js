'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DS_LOP_HOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.GIANGVIEN, { foreignKey: 'GIANGVIENId', as: 'dslophoc_giangvien' });
            this.belongsTo(models.LOPHOC, { foreignKey: 'LOPHOCId', as: 'dslophoc_lophoc' });
            this.belongsTo(models.THU, { foreignKey: 'THUId', as: 'dslophoc_thu' });
            this.belongsTo(models.TIET, { foreignKey: 'TIETId', as: 'dslophoc_tiet' });

        }
    };
    DS_LOP_HOC.init({
        LOPHOCId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        GIANGVIENId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        THUId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        TIETId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
    }, {
            sequelize,
            modelName: 'DS_LOP_HOC',
            freezeTableName: true,
        });
    DS_LOP_HOC.removeAttribute('id');
    return DS_LOP_HOC;
};