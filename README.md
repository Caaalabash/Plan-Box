## 毕业设计: 基于React的敏捷团队协作工具 [![Build Status](https://travis-ci.org/Caaalabash/Plan-Box.svg?branch=master)](https://travis-ci.org/Caaalabash/Plan-Box)

~~线上地址: [Plan-Box](https://team.calabash.top)~~

**毕业了, 下线!**

### 功能描述

参考主流敏捷团队协作工具实现了如下几个模块, 如果熟悉`Scrum`的话应该不会陌生嗷

- [x] Team 团队模块

- [x] Sprint 任务周期模块

- [x] Backlog 任务池模块

- [x] Lane 泳道模块

- [x] WorkOrder 工单模块

偏向技术方面的功能如下:

- [x] GitHub授权登录: 使用`egg-passport-github`

- [x] 拖拽表格/拖拽卡片: 使用`HTML5 Drag & Drop`

- [x] 根据配置自动生成`Antd`表单

- [x] 部分模块使用`socket.io`做数据同步

  - [x] 工单模块: 使用`HTML5 Notification API`进行通知

  - [x] 团队模块: 使用`Antd Notification`组件进行通知, 并实时同步

  - [ ] 泳道模块

- [x] 自定义右键菜单

### 涉及技术

+ 前端:

  + React
  + Mobx
  + Sass
  + Antd
  + axios
  + Webpack

+ 后端:

  + egg.js
  + mongodb
  + socket.io
  + passport
  + jwt

+ 其他:

  + Travis CI
  + Docker

### 项目运行效果

第三方登录

![第三方登录效果](https://static.calabash.top//blog-media/file/file-1559031805826.png)

团队模块

![团队模块效果](https://static.calabash.top//blog-media/file/file-1559031837992.png)

任务池模块

![任务池模块效果](https://static.calabash.top//blog-media/file/file-1559031883849.png)

任务周期模块

![任务周期模块效果](https://static.calabash.top//blog-media/file/file-1559031912111.png)

泳道模块效果

![泳道模块效果](https://static.calabash.top//blog-media/file/file-1559031954450.png)

工单模块效果

![工单模块](https://static.calabash.top//blog-media/file/file-1559031985812.png)
