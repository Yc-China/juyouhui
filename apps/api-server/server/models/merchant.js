module.exports = (sequelize, DataTypes) => {
  const Merchant = sequelize.define('Merchant', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '商家名称'
    },
    legalPerson: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'legal_person',
      comment: '法人姓名'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: '联系电话'
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '登录密码'
    },
    idCard: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'id_card',
      comment: '身份证号'
    },
    businessLicense: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'business_license',
      comment: '营业执照照片URL'
    },
    depositAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 500.00,
      field: 'deposit_amount',
      comment: '保证金金额'
    },
    depositPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'deposit_paid',
      comment: '保证金是否已支付'
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '状态：0-待审核，1-已通过，2-已拒绝'
    }
  }, {
    tableName: 'merchants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Merchant;
};
