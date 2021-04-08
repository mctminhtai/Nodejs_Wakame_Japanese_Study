'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DS_MON_DA_HOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.USER, { foreignKey: 'USERId', as: 'dsmondahoc_user' });
            this.belongsTo(models.MONHOC, { foreignKey: 'MONHOCId', as: 'dsmondahoc_monhoc' });
        }
    };
    DS_MON_DA_HOC.init({
        MONHOCId: DataTypes.INTEGER,
        USERId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'DS_MON_DA_HOC',
            freezeTableName: true,
        });
    DS_MON_DA_HOC.removeAttribute('id');
    return DS_MON_DA_HOC;
};