module.exports = (sequelize, DataTypes) => {
  const PointLog = sequelize.define('PointLog', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
      comment: '用户ID'
    },
    merchantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'merchant_id',
      comment: '商家ID'
    },
    storeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'store_id',
      comment: '门店ID'
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '积分变化，正数增加，负数减少'
    },
    type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '类型：1-商家发放，2-商家核销，3-平台兑换，4-过期清零'
    },
    balance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '变动后余额'
    },
    expireAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'expire_at',
      comment: '积分过期时间'
    },
    remark: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '备注'
    }
  }, {
    tableName: 'point_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return PointLog;
};
