'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DS_LOP_HOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.GIANG_VIEN, { foreignKey: 'GIANG_VIENId', as: 'dayhoc3' });
            this.belongsTo(models.LOPHOC, { foreignKey: 'LOPHOCId', as: 'hoclop3' });
            this.belongsTo(models.THU, { foreignKey: 'THUId', as: 'thuhoc3' });
            this.belongsTo(models.TIET, { foreignKey: 'TIETId', as: 'tiethoc3' });

        }
    };
    DS_LOP_HOC.init({
        LOPHOCId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        GIANG_VIENId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ID_THU: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ID_TIET: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
    }, {
            sequelize,
            modelName: 'DS_LOP_HOC',
            freezeTableName: true,
        });
    DS_LOP_HOC.removeAttribute('id');
    return DS_LOP_HOC;
};