module.exports = (sequelize, DataTypes) => {
  const ExchangeOrder = sequelize.define('ExchangeOrder', {
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
      comment: '用户ID'
    },
    giftId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'gift_id',
      comment: '礼品ID'
    },
    points: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '消耗积分'
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '收货地址'
    },
    receiverName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'receiver_name',
      comment: '收货人姓名'
    },
    receiverPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'receiver_phone',
      comment: '收货人电话'
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '状态：0-待发货，1-已发货，2-已完成，3-已取消'
    },
    expressNo: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'express_no',
      comment: '快递单号'
    },
    shipTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ship_time',
      comment: '发货时间'
    },
    finishTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'finish_time',
      comment: '完成时间'
    }
  }, {
    tableName: 'exchange_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExchangeOrder;
};
