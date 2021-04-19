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
            this.belongsTo(models.USER, { foreignKey: 'USERId', as: 'blog_user' });
            this.belongsToMany(models.TAG, { through: models.TAG_BLOG, foreignKey: 'BLOGId', as: 'blog_tag' });
            this.hasMany(models.COMMENT, { as: 'blog_comment' });
            this.belongsTo(models.CATEGORY, { foreignKey: 'CATEGORYId', as: 'blog_category' });
            // this.belongsToMany(models.USER, { through: models.COMMENT, foreignKey: 'BLOGId', as: 'blog_comment_user' });
        }
    };
    BLOG.init({
        USERId: DataTypes.INTEGER,
        CATEGORYId: DataTypes.INTEGER,
        title: DataTypes.STRING(1024),
        blogimg: DataTypes.STRING(1024),
        uuid: DataTypes.UUID,
        content: DataTypes.TEXT('long'),
        description: DataTypes.STRING(1024),
    }, {
        sequelize,
        modelName: 'BLOG',
        freezeTableName: true,
    });
    return BLOG;
};