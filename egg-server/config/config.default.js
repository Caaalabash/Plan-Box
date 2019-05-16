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
        msg: '服务器错误',
        errMsg: err.message
      }
    }
  },
  response: {
    successCode: 0,
    errorCode: 1
  },
  secret: process.env.JWT_SECRET || 'Plan_Box',
  /**
   * 测试环境下提供 Plan-Box-Dev Oauth App支持
   */
  passportGithub: {
    key: process.env.GITHUB_ID || 'a764a9105c803decd727',
    secret: process.env.GITHUB_SECRETID || '7055c9a2c96aa26686f64bd38cbcc3f2cef43c01',
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:7001/api/plan-box/oauth/github/callback',
    scope: 'read:user'
  },
  io: {
    init: {
      path: '/socket'
    },
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
      }
    }
  }
})
