class OauthController extends require('egg').Controller {
  async github(ctx) {
    const userInfo = await ctx.service.oauth.getGithubInfo(ctx.request.body)
    const token = this.app.jwt.sign({ id: userInfo.data.id }, this.config.jwt.secret, { expiresIn: 60 * 60 })

    if (!userInfo.code) {
      ctx.cookies.set('__token', token, {
        signed: false,
        maxAge: 3600,
        path: '/',
      })
    }
    ctx.body = userInfo
  }
}

module.exports = OauthController
