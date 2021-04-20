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

            this.hasMany(models.TKB_DU_KIEN, { as: 'user_tkb' });
            this.belongsToMany(models.MONHOC, { through: models.DS_MON_DA_HOC, foreignKey: 'USERId', as: 'user_monhoc' });
            // this.belongsToMany(models.BLOG, { through: models.COMMENT, foreignKey: 'USERId', as: 'user_comment_blog' });
        }
    };
    USER.init({
        fullName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        gender: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        level: DataTypes.STRING,
        country: DataTypes.STRING,
        address: DataTypes.STRING,
        dob: DataTypes.DATEONLY,
    }, {
        sequelize,
        modelName: 'USER',
        freezeTableName: true,
    });
    return USER;
};