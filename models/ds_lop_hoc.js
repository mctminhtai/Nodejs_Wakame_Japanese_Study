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
            /*
            this.hasMany(models.GIANG_VIEN, { foreignKey: 'GIANG_VIENId', as: 'dayhoc' });
            this.belongsTo(models.LOPHOC, { foreignKey: 'LOPHOCId', as: 'hoclop' });
            this.hasMany(models.TIET_THU, { foreignKey: 'ID_THU', as: 'thuhoc' });
            this.hasMany(models.TIET_THU, { foreignKey: 'ID_TIET', as: 'tiethoc' });
            */
        }
    };
    DS_LOP_HOC.init({
        LOPHOCId: DataTypes.INTEGER,
        GIANG_VIENId: DataTypes.INTEGER,
        ID_THU: DataTypes.INTEGER,
        ID_TIET: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'DS_LOP_HOC',
            freezeTableName: true,
        });
    return DS_LOP_HOC;
};