'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class COMMENT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.USER, { foreignKey: 'USERId', as: 'nguoicomment' });
      this.belongsTo(models.BLOG, { foreignKey: 'BLOGId', as: 'noicomment' });
    }
  };
  COMMENT.init({
    USERId: DataTypes.INTEGER,
    BLOGId: DataTypes.INTEGER,
    cmcontent: DataTypes.STRING
    //sua luon ca cho nay
  }, {
    sequelize,
    modelName: 'COMMENT',
    freezeTableName: true,
  });
  return COMMENT;
};