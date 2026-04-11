module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    shopName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '店铺名称'
    },
    contactName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '联系人姓名'
    },
    contactPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '联系电话'
    },
    email: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      comment: '邮箱'
    },
    provinceCode: {
      type: DataTypes.STRING(20),
      defaultValue: '',
      comment: '省份编码'
    },
    cityCode: {
      type: DataTypes.STRING(20),
      defaultValue: '',
      comment: '城市编码'
    },
    districtCode: {
      type: DataTypes.STRING(20),
      defaultValue: '',
      comment: '区县编码'
    },
    address: {
      type: DataTypes.STRING(200),
      defaultValue: '',
      comment: '详细地址'
    },
    traffic: {
      type: DataTypes.STRING(50),
      defaultValue: '',
      comment: '月均客流量'
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '状态：0-待处理，1-已处理'
    }
  }, {
    tableName: 'applications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Application;
};
