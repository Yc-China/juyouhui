module.exports = (sequelize, DataTypes) => {
  const MerchantPoint = sequelize.define('MerchantPoint', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    merchantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'merchant_id',
      unique: true,
      comment: '商家ID'
    },
    balance: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '当前积分余额'
    },
    totalRecharge: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: 'total_recharge',
      comment: '累计充值积分'
    },
    totalConsumed: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: 'total_consumed',
      comment: '累计消费积分'
    }
  }, {
    tableName: 'merchant_points',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return MerchantPoint;
};
