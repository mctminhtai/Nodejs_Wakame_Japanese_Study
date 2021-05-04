'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TAGKH extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.KHOAHOC, { through: models.TAGKH_KHOAHOC, foreignKey: 'TAGKHId', as: 'tagkh_khoahoc' });

        }
    };
    TAGKH.init({
        TEN_TAG_KH: DataTypes.STRING
    }, {
            sequelize,
            modelName: 'TAGKH',
            freezeTableName: true,
        });
    return TAGKH;
};