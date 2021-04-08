'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TKB_DU_KIEN extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.USER, { foreignKey: 'USERId', as: 'tkb_user' })
            this.belongsTo(models.LOPHOC, { foreignKey: 'LOPHOCId', as: 'tkb_lophoc' });
            this.belongsTo(models.THU, { foreignKey: 'THUId', as: 'tkb_thu' });
            this.belongsTo(models.TIET, { foreignKey: 'TIETId', as: 'tkb_tiet' });
        }
    };
    TKB_DU_KIEN.init({
        USERId: DataTypes.INTEGER,
        LOPHOCId: DataTypes.INTEGER,
        THUId: DataTypes.INTEGER,
        TIETId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'TKB_DU_KIEN',
            freezeTableName: true,
        });
    TKB_DU_KIEN.removeAttribute('id');
    return TKB_DU_KIEN;
};