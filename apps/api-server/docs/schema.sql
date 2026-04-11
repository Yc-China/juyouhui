-- 聚优惠数据库表结构
-- 创建数据库
CREATE DATABASE IF NOT EXISTS juyouhui DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE juyouhui;

-- 1. 商家表
CREATE TABLE `merchants` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '商家名称',
  `legal_person` varchar(50) DEFAULT NULL COMMENT '法人姓名',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `password` varchar(100) NOT NULL COMMENT '登录密码',
  `id_card` varchar(30) DEFAULT NULL COMMENT '身份证号',
  `business_license` varchar(200) DEFAULT NULL COMMENT '营业执照照片URL',
  `deposit_amount` decimal(10,2) DEFAULT '500.00' COMMENT '保证金金额',
  `deposit_paid` tinyint(1) DEFAULT '0' COMMENT '保证金是否已支付',
  `status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态：0-待审核，1-已通过，2-已拒绝',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商家表';

-- 2. 门店表
CREATE TABLE `stores` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` int unsigned NOT NULL COMMENT '商家ID',
  `name` varchar(100) NOT NULL COMMENT '门店名称',
  `address` varchar(200) DEFAULT NULL COMMENT '门店地址',
  `phone` varchar(20) DEFAULT NULL COMMENT '门店电话',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店表';

-- 3. 商家积分账户表
CREATE TABLE `merchant_points` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` int unsigned NOT NULL COMMENT '商家ID',
  `balance` int unsigned NOT NULL DEFAULT '0' COMMENT '当前积分余额',
  `total_recharge` int unsigned NOT NULL DEFAULT '0' COMMENT '累计充值积分',
  `total_consumed` int unsigned NOT NULL DEFAULT '0' COMMENT '累计消费积分',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商家积分账户表';

-- 4. 充值订单表
CREATE TABLE `recharge_orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单号',
  `merchant_id` int unsigned NOT NULL COMMENT '商家ID',
  `points` int unsigned NOT NULL COMMENT '充值积分数量',
  `amount` decimal(10,2) NOT NULL COMMENT '充值金额',
  `status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态：0-待支付，1-已支付，2-已取消',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='充值订单表';

-- 5. 用户表
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(200) DEFAULT NULL COMMENT '头像URL',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 6. 用户积分账户表
CREATE TABLE `user_points` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int unsigned NOT NULL COMMENT '用户ID',
  `balance` int unsigned NOT NULL DEFAULT '0' COMMENT '当前积分余额',
  `total_earned` int unsigned NOT NULL DEFAULT '0' COMMENT '累计获得积分',
  `total_spent` int unsigned NOT NULL DEFAULT '0' COMMENT '累计消费积分',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户积分账户表';

-- 7. 积分流水记录表
CREATE TABLE `point_logs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int unsigned NOT NULL COMMENT '用户ID',
  `merchant_id` int unsigned NOT NULL COMMENT '商家ID',
  `store_id` int unsigned DEFAULT NULL COMMENT '门店ID',
  `points` int NOT NULL COMMENT '积分变化，正数增加，负数减少',
  `type` tinyint unsigned NOT NULL COMMENT '类型：1-商家发放，2-商家核销，3-平台兑换，4-过期清零',
  `balance` int unsigned NOT NULL COMMENT '变动后余额',
  `expire_at` date NOT NULL COMMENT '积分过期时间',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_expire_at` (`expire_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分流水记录表';

-- 8. 礼品表
CREATE TABLE `gifts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '礼品名称',
  `description` varchar(500) DEFAULT NULL COMMENT '礼品描述',
  `points` int unsigned NOT NULL COMMENT '所需积分',
  `price` decimal(10,2) NOT NULL COMMENT '市场价',
  `stock` int unsigned NOT NULL DEFAULT '0' COMMENT '库存',
  `image` varchar(200) DEFAULT NULL COMMENT '礼品图片',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-下架，1-上架',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='礼品表';

-- 9. 兑换订单表
CREATE TABLE `exchange_orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单号',
  `user_id` int unsigned NOT NULL COMMENT '用户ID',
  `gift_id` int unsigned NOT NULL COMMENT '礼品ID',
  `points` int unsigned NOT NULL COMMENT '消耗积分',
  `address` varchar(200) NOT NULL COMMENT '收货地址',
  `receiver_name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `receiver_phone` varchar(20) NOT NULL COMMENT '收货人电话',
  `status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态：0-待发货，1-已发货，2-已完成，3-已取消',
  `express_no` varchar(30) DEFAULT NULL COMMENT '快递单号',
  `ship_time` datetime DEFAULT NULL COMMENT '发货时间',
  `finish_time` datetime DEFAULT NULL COMMENT '完成时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='兑换订单表';

-- 10. 管理员表
CREATE TABLE `admins` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 初始化默认管理员 (密码: 123456)
INSERT INTO `admins` (`username`, `password`, `nickname`) VALUES
('admin', '$2a$10$eWN5j3z5hGiyB0eK8XqUveYRsjWqnVt9L6X5hGiyB0eK8XqUveY', '系统管理员');
