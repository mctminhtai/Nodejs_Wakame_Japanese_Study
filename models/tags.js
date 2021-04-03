'use strict';
const {
  Model
} = require('sequelize');
const blogs = require('./blogs');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //this.belongsToMany(blogs);
    }
  };
  Tags.init({
    tagName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Tags',
  });
  return Tags;
};