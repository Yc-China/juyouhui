module.exports = (sequelize, DataTypes) => {
  const RechargeOrder = sequelize.define('RechargeOrder', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    orderNo: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      field: 'order_no',
      comment: '订单号'
    },
    merchantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'merchant_id',
      comment: '商家ID'
    },
    points: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '充值积分数量'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '充值金额'
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '状态：0-待支付，1-已支付，2-已取消'
    },
    payTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'pay_time',
      comment: '支付时间'
    }
  }, {
    tableName: 'recharge_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return RechargeOrder;
};
