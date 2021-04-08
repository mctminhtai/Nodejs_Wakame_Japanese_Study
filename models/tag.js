'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TAG extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.BLOG, { through: models.TAG_BLOG, foreignKey: 'TAGId', as: 'the' });
        }
    };
    TAG.init({
        TEN_TAG: DataTypes.STRING
    }, {
            sequelize,
            modelName: 'TAG',
            freezeTableName: true,
        });
    return TAG;
};