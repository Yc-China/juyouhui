const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    timezone: dbConfig.timezone,
    logging: false
  }
);

// 加载所有模型
const Merchant = require('./merchant')(sequelize, Sequelize.DataTypes);
const Store = require('./store')(sequelize, Sequelize.DataTypes);
const MerchantPoint = require('./merchant-point')(sequelize, Sequelize.DataTypes);
const RechargeOrder = require('./recharge-order')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const UserPoint = require('./user-point')(sequelize, Sequelize.DataTypes);
const PointLog = require('./point-log')(sequelize, Sequelize.DataTypes);
const Gift = require('./gift')(sequelize, Sequelize.DataTypes);
const ExchangeOrder = require('./exchange-order')(sequelize, Sequelize.DataTypes);
const Admin = require('./admin')(sequelize, Sequelize.DataTypes);
const Application = require('./application')(sequelize, Sequelize.DataTypes);

// 建立关联关系
Merchant.hasMany(Store, { foreignKey: 'merchantId' });
Store.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasOne(MerchantPoint, { foreignKey: 'merchantId' });
MerchantPoint.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasMany(RechargeOrder, { foreignKey: 'merchantId' });
RechargeOrder.belongsTo(Merchant, { foreignKey: 'merchantId' });

User.hasOne(UserPoint, { foreignKey: 'userId' });
UserPoint.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Merchant,
  Store,
  MerchantPoint,
  RechargeOrder,
  User,
  UserPoint,
  PointLog,
  Gift,
  ExchangeOrder,
  Admin,
  Application
};
