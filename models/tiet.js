'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TIET extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            //this.hasMany(models.DS_LOP_HOC, { as: 'thuhoc' });
            this.belongsToMany(models.GIANG_VIEN, { through: models.DS_LOP_HOC, as: 'tiethoc3' });
            this.belongsToMany(models.THU, { through: models.TIET_THU, as: 'tiethoc' });
        }
    };
    TIET.init({
        TEN_TIET: DataTypes.STRING
    }, {
            sequelize,
            modelName: 'TIET',
            freezeTableName: true,
        });
    return TIET;
};