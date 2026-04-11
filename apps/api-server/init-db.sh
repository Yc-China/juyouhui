#!/bin/bash
# 聚优惠数据库初始化脚本
# 自动创建数据库并导入表结构

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}   聚优惠数据库初始化脚本${NC}"
echo -e "${YELLOW}=========================================${NC}"

# 默认配置
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"3306"}
DB_USER=${DB_USER:-"root"}
DB_PASS=${DB_PASS:-""}
DB_NAME=${DB_NAME:-"juyouhui"}
SQL_FILE=${SQL_FILE:-"$(dirname "$0")/docs/schema.sql"}

# 从配置文件读取（如果存在）
if [ -f "$(dirname "$0")/server/config/database.js" ]; then
  echo -e "${GREEN}✓ 读取数据库配置文件...${NC}"
  # 提取配置信息（简单提取，可能不适用所有情况）
  CONFIG_HOST=$(grep -o "host: *'[^']*'" "$(dirname "$0")/server/config/database.js" | cut -d"'" -f2)
  CONFIG_PORT=$(grep -o "port: *[0-9]*" "$(dirname "$0")/server/config/database.js" | cut -d" " -f2)
  CONFIG_USER=$(grep -o "user: *'[^']*'" "$(dirname "$0")/server/config/database.js" | cut -d"'" -f2)
  CONFIG_PASS=$(grep -o "password: *'[^']*'" "$(dirname "$0")/server/config/database.js" | cut -d"'" -f2)
  CONFIG_NAME=$(grep -o "database: *'[^']*'" "$(dirname "$0")/server/config/database.js" | cut -d"'" -f2)
  
  [ ! -z "$CONFIG_HOST" ] && DB_HOST=$CONFIG_HOST
  [ ! -z "$CONFIG_PORT" ] && DB_PORT=$CONFIG_PORT
  [ ! -z "$CONFIG_USER" ] && DB_USER=$CONFIG_USER
  [ ! -z "$CONFIG_PASS" ] && DB_PASS=$CONFIG_PASS
  [ ! -z "$CONFIG_NAME" ] && DB_NAME=$CONFIG_NAME
fi

echo ""
echo "当前数据库配置:"
echo "  主机: $DB_HOST"
echo "  端口: $DB_PORT"
echo "  用户: $DB_USER"
echo "  密码: ${DB_PASS:+(已设置)}${DB_PASS:+(为空)}"
echo "  数据库: $DB_NAME"
echo ""

# 检查 SQL 文件是否存在
if [ ! -f "$SQL_FILE" ]; then
  echo -e "${RED}❌ 错误: SQL文件不存在: $SQL_FILE${NC}"
  exit 1
fi

echo -e "${YELLOW}即将初始化数据库，这会删除已有数据！确认继续吗？(y/n) [n]: ${NC}"
read -r confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "已取消"
  exit 0
fi

echo ""
echo -e "${GREEN}开始初始化数据库...${NC}"

# 构建 MySQL 命令参数
MYSQL_CMD="mysql"
if [ ! -z "$DB_HOST" ]; then
  MYSQL_CMD="$MYSQL_CMD -h$DB_HOST"
fi
if [ ! -z "$DB_PORT" ]; then
  MYSQL_CMD="$MYSQL_CMD -P$DB_PORT"
fi
if [ ! -z "$DB_USER" ]; then
  MYSQL_CMD="$MYSQL_CMD -u$DB_USER"
fi
if [ ! -z "$DB_PASS" ]; then
  MYSQL_CMD="$MYSQL_CMD -p$DB_PASS"
fi

# 执行 SQL 文件
echo "正在执行 SQL 脚本..."
if $MYSQL_CMD < "$SQL_FILE"; then
  echo ""
  echo -e "${GREEN}=========================================${NC}"
  echo -e "${GREEN}✅ 数据库初始化完成！${NC}"
  echo -e "${GREEN}=========================================${NC}"
  echo ""
  echo "默认管理员账号: admin"
  echo "默认管理员密码: 123456"
  echo ""
else
  echo ""
  echo -e "${RED}❌ 数据库初始化失败！${NC}"
  echo "请检查你的 MySQL 配置是否正确"
  exit 1
fi
