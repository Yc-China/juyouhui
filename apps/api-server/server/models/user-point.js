module.exports = (sequelize, DataTypes) => {
  const UserPoint = sequelize.define('UserPoint', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
      unique: true,
      comment: '用户ID'
    },
    balance: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '当前积分余额'
    },
    totalEarned: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: 'total_earned',
      comment: '累计获得积分'
    },
    totalSpent: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: 'total_spent',
      comment: '累计消费积分'
    }
  }, {
    tableName: 'user_points',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return UserPoint;
};
