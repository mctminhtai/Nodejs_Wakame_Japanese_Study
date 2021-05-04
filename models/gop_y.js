'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GOP_Y extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    GOP_Y.init({
        NAME: DataTypes.STRING,
        EMAIL: DataTypes.STRING,
        SUBJECT: DataTypes.STRING(1024),
        MESSENGER: DataTypes.TEXT('long')
    }, {
            sequelize,
            modelName: 'GOP_Y',
            freezeTableName: true,
        });
    return GOP_Y;
};