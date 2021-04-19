'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CATEGORY extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.BLOG, { as: 'category_blog' });
    }
  };
  CATEGORY.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CATEGORY',
    freezeTableName: true,
  });
  return CATEGORY;
};