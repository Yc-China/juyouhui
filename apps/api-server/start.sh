#!/bin/bash
# 聚优惠一键启动脚本
# 自动安装依赖、启动服务

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}   聚优惠服务端一键启动脚本${NC}"
echo -e "${YELLOW}=========================================${NC}"

# 进入 server 目录
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
SERVER_DIR="$SCRIPT_DIR/server"
cd "$SERVER_DIR"

echo ""
echo -e "${GREEN}✓ 当前工作目录: $PWD${NC}"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ 错误: 未找到 Node.js，请先安装 Node.js${NC}"
  echo "下载地址: https://nodejs.org/"
  exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ 错误: 未找到 npm，请先安装 Node.js${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"
echo -e "${GREEN}✓ npm 版本: $(npm -v)${NC}"

# 检查是否已经安装依赖
if [ ! -d "node_modules" ]; then
  echo ""
  echo -e "${YELLOW}正在安装依赖，请稍候...${NC}"
  if npm install; then
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
  else
    echo -e "${RED}❌ 依赖安装失败，请检查网络连接${NC}"
    exit 1
  fi
else
  echo ""
  echo -e "${GREEN}✓ 依赖已安装，跳过安装步骤${NC}"
fi

echo ""
echo -e "${GREEN}启动服务...${NC}"
echo ""

# 启动服务
node app.js
