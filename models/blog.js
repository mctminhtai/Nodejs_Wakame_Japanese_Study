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
        }
    };
    BLOG.init({
        USERId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        blogimg: DataTypes.STRING,
        uuid: DataTypes.UUID,
        content: DataTypes.STRING,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'BLOG',
        freezeTableName: true,
    });
    return BLOG;
};