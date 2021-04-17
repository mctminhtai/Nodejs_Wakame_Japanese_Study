'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RESETTOKEN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RESETTOKEN.init({
    token: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RESETTOKEN',
    freezeTableName: true,
  });
  return RESETTOKEN;
};