#!/bin/bash

# 输出脚本接收的镜像tag参数并设置为环境变量
echo $1
export PLAN_BOX_TAG=$1

# 删除旧容器
docker rm -f $(docker ps -a |  grep "plan"  | awk '{print $1}')
# 删除旧镜像
docker rmi $(docker images |  grep "plan"  | awk '{print $3}')
# 首先运行后端服务
cd /mynode/plan-box-ci/deploy
docker-compose up -d

# 重启Nginx
nginx -s reload