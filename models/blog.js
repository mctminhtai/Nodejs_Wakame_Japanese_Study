'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BLOG extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.USER, { foreignKey: 'USERId', as: 'nguoidang' });
      this.hasMany(models.COMMENT, { as: 'binhluan' });
    }
  };
  BLOG.init({
    USERId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BLOG',
    freezeTableName: true,
  });
  return BLOG;
};