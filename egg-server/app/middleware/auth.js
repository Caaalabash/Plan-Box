module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const token = ctx.cookies.get('__token', { signed: false })
    const url = ctx.request.url
    const shouldVerify = !options.whiteList.includes(url)

    // 如果在白名单内, 则代表不需要校验token
    if (shouldVerify) {
      // 如果没有token
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
  const secret = app.config.jwt.secret
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
