'use strict';

module.exports = appInfo => ({
  keys: appInfo.name + '_1545482886402_3794',
  security: {
    csrf: {
      enable: false
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  successCode: 0,
  errorCode: 1
})
