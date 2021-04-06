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
            // define association 
            this.belongsTo(models.THU, { foreignKey: 'THUId', as: 'thuhoc' });
            this.belongsTo(models.TIET, { foreignKey: 'TIETId', as: 'tiethoc' });
            //this.hasMany(models.DS_LOP_HOC, { as: 'thuhoc' });
            //this.hasMany(models.DS_LOP_HOC, { as: 'tiethoc' });
        }
    };
    TIET_THU.init({
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
            modelName: 'TIET_THU',
            freezeTableName: true,
        });
    TIET_THU.removeAttribute('id');
    return TIET_THU;
};