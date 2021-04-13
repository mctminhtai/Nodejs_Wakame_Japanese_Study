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
            this.belongsTo(models.USER, { foreignKey: 'USERId', as: 'comment_user' });
            this.belongsTo(models.BLOG, { foreignKey: 'BLOGId', as: 'comment_blog' });
        }
    };
    COMMENT.init({
        USERId: DataTypes.INTEGER,
        BLOGId: DataTypes.INTEGER,
        cmcontent: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'COMMENT',
        freezeTableName: true,
    });
    return COMMENT;
};