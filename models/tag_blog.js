'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TAG_BLOG extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.TAG, { foreignKey: 'TAGId', as: 'the' });
            this.belongsTo(models.BLOG, { foreignKey: 'BLOGId', as: 'theloai' });
        }
    };
    TAG_BLOG.init({
        TAGId: DataTypes.INTEGER,
        BLOGId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'TAG_BLOG',
            freezeTableName: true,
        });
    return TAG_BLOG;
};