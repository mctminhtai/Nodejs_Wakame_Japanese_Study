'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class USER_UPGRADE_BLOG extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.USER, { foreignKey: 'USERId', as: 'user_upgrade_blog_user' });
            this.belongsTo(models.BLOG, { foreignKey: 'BLOGId', as: 'user_upgrade_blog_blog' });
        }
    };
    USER_UPGRADE_BLOG.init({
        USERId: DataTypes.INTEGER,
        BLOGId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'USER_UPGRADE_BLOG',
            freezeTableName: true,
        });
    return USER_UPGRADE_BLOG;
};