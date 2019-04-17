'use strict';

module.exports = appInfo => ({
  keys: appInfo.name + '_1545482886402_3794',
  security: {
    csrf: {
      enable: false
    },
    domainWhiteList: [
      'http://team.calabash.top/',
      'http://localhost:3000/'
    ]
  },
  middleware: ['auth', 'response'],
  auth: {
    whiteList: [
      '/api/plan-box/oauth/github',
      '/api/plan-box/oauth/github/callback',
      '/api/plan-box/oauth/github/userInfo'
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
  passportGithub: {
    key: process.env.GITHUB_ID,
    secret: process.env.GITHUB_SECRETID,
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:7001/api/plan-box/oauth/github/callback'
  },
})
