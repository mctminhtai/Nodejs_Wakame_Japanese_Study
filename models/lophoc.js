'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LOPHOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.MONHOC, { foreignKey: 'MONHOCId', as: 'lophoc1' });
            this.belongsTo(models.DS_LOP_HOC, { as: 'hoclop3' });
        }
    };
    LOPHOC.init({
        MONHOCId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'LOPHOC',
            freezeTableName: true,
        });
    return LOPHOC;
};