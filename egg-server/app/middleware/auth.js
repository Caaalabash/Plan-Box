/**
 * 鉴权中间件
 * 1. 在白名单中的请求地址, 无需鉴权
 * 2. 白名单之外的请求地址
 *   2.1 如果没有token
 *   2.2 如果token校验失败, 返回对应的提示信息
 *   2.3 校验成功, 正常请求
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
          ctx.state.userId = userId
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

// 校验token, 返回token中包含的userId信息
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
