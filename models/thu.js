'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class THU extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.DS_LOP_HOC, { as: 'thuhoc3' });
            //this.hasMany(models.DS_LOP_HOC, { as: 'tiethoc' });
            this.belongsToMany(models.TIET, { through: models.TIET_THU, as: 'thuhoc' });
        }
    };
    THU.init({
        TEN_THU: DataTypes.STRING
    }, {
            sequelize,
            modelName: 'THU',
            freezeTableName: true,
        });
    return THU;
};