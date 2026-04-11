module.exports = (sequelize, DataTypes) => {
  const Gift = sequelize.define('Gift', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '礼品名称'
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '礼品描述'
    },
    points: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '所需积分'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '市场价'
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '库存'
    },
    image: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '礼品图片'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '状态：0-下架，1-上架'
    }
  }, {
    tableName: 'gifts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Gift;
};
