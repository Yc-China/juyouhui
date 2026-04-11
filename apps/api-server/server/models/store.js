module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    merchantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'merchant_id',
      comment: '商家ID'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '门店名称'
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '门店地址'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '门店电话'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '状态：0-禁用，1-启用'
    }
  }, {
    tableName: 'stores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Store;
};
