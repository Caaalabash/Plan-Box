'use strict';

module.exports = appInfo => ({
  keys: appInfo.name + '_1545482886402_3794',
  security: {
    csrf: {
      enable: false
    }
  },
  auth: {
    whiteList: [
      '/api/plan-box/oauth/github'
    ]
  },
  middleware: ['auth'],
  jwt: {
    secret: process.env.JWT_SECRET
  },
  successCode: 0,
  errorCode: 1
})
