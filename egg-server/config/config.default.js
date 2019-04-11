'use strict';

module.exports = appInfo => ({
  keys: appInfo.name + '_1545482886402_3794',
  security: {
    csrf: {
      enable: false
    }
  },
  middleware: ['auth', 'response'],
  auth: {
    whiteList: [
      '/api/plan-box/oauth/github'
    ]
  },
  onerror: {
    all(err, ctx) {
      ctx.body = {
        errno: 1,
        msg: '服务器错误'
      }
    }
  },
  response: {
    successCode: 0,
    errorCode: 1
  },
  secret: process.env.JWT_SECRET,
  client_id: process.env.GITHUB_ID,
  client_secret: process.env.GITHUB_SECRETID,
})
