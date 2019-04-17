/**
 * 返回结果处理中间件
 * 1. 对于成功的请求, 返回结果应该为 { errno: 0, data: 需要的数据, msg: '提示信息' }
 * 2. 对于失败的请求, 返回结果应该为 { errno: 1, msg: '提示信息' }
 *
 * 区分方式为: 凡是错误请求, 必定含有String类型的errorMsg
 *           凡是正确请求, 可能含有data/msg属性
 */
const defaultResponse = {
  data: {},
  msg: '',
}

module.exports = (options) => {
  return async function processResponse(ctx, next) {
    await next()
    const { errorMsg } = ctx.body || {}

    if (typeof errorMsg === 'string') {
      ctx.body = {
        errno: options.errorCode,
        msg: errorMsg
      }
    } else {
      ctx.body = {
        ...defaultResponse,
        ...ctx.body,
        errno: options.successCode,
      }
    }
  }
}

