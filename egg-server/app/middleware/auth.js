/**
 * 鉴权中间件
 * 1. 在白名单中的请求地址, 无需鉴权
 * 2. 白名单之外的请求地址
 *   2.1 如果没有token
 *   2.2 如果token校验失败, 返回对应的提示信息
 *   2.3 校验成功, 正常请求, 处理所有参数, 将其挂载到ctx.request.body下
 */
module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const url = ctx.request.url
    const shouldVerify = !options.whiteList.includes(url)

    if (shouldVerify) {
      const token = ctx.cookies.get('__token', { signed: false })

      if (!token) {
        ctx.body = { errno: 1, msg: '请登录再进行操作' }
      } else {
        const userId = verifyToken(app, token)
        if (userId) {
          processParams(ctx, userId)
          await next()
        } else {
          ctx.body = { errno: 1, msg: '您的登录状态已过期，请重新登录' }
        }
      }
    } else {
      await next()
    }
  }
}

/**
 * 校验 token
 * @param {object} app context
 * @param {string} token 用户token
 * @return {string|null} 用户Id
 */
function verifyToken(app, token) {
  const verify = app.jwt.verify
  const secret = app.config.secret
  let userId = null
  try {
    const payload = verify(token, secret)
    const current = Math.floor(Date.now() / 1000)
    if (current <= payload.exp) userId = payload.userId
  } catch(err) {
    console.log(err)
  }
  return userId
}
/**
 * 统一处理所有参数 ctx.request.body, ctx.query
 * @description 无法在中间件中获得ctx.params! (Controller之前)
 * @param {object} ctx context
 * @param {string} userId token中携带的userId
 * @return none
 */
function processParams(ctx, userId) {
  ctx.request.body = {
    userId,
    ...ctx.query,
    ...ctx.request.body
  }
}