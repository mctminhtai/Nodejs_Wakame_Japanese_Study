'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TIET_THU extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            //this.hasMany(models.DS_LOP_HOC, { as: 'thuhoc' });
            //this.hasMany(models.DS_LOP_HOC, { as: 'tiethoc' });
        }
    };
    TIET_THU.init({
        ID_THU: DataTypes.INTEGER,
        ID_TIET: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'TIET_THU',
            freezeTableName: true,
        });
    return TIET_THU;
};