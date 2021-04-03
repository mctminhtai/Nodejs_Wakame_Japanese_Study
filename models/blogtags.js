'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogTags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Blogs, { foreignKey: 'blogId' });
      this.belongsTo(models.Tags, { foreignKey: 'tagId' });
    }
  };
  BlogTags.init({
    tagId: DataTypes.INTEGER,
    blogId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BlogTags',
  });
  return BlogTags;
};