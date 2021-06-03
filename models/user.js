'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class USER extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.BLOG, { as: 'user_blog' });
            this.hasMany(models.COMMENT, { as: 'user_comment' });
            this.belongsToMany(models.BLOG, { through: models.USER_UPGRADE_BLOG, foreignKey: 'USERId', as: 'user_blog2' });
        }
    };
    USER.init({
        fullName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        actived: DataTypes.BOOLEAN,
        gender: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        level: DataTypes.STRING,
        country: DataTypes.STRING,
        address: DataTypes.STRING,
        dob: DataTypes.DATEONLY,
        role: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'USER',
        freezeTableName: true,
    });
    return USER;
};