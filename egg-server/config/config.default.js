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
  response: {
    successCode: 0,
    errorCode: 1
  },
  secret: process.env.JWT_SECRET,
  client_id: process.env.GITHUB_ID,
  client_secret: process.env.GITHUB_SECRETID,
})
