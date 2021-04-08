'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GIANG_VIEN extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            //this.belongsToMany(models.TIET, { through: models.DS_LOP_HOC, as: 'dayhoc3' });
            this.hasMany(models.DS_LOP_HOC, { as: 'dayhoc21' });
        }
    };
    GIANG_VIEN.init({
        TEN_GV: DataTypes.STRING
    }, {
            sequelize,
            modelName: 'GIANG_VIEN',
            freezeTableName: true,
        });
    return GIANG_VIEN;
};