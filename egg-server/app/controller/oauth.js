class OauthController extends require('egg').Controller {
  async github(ctx) {
    const resp = await ctx.service.oauth.getGithubInfo(ctx.user.accessToken)

    if (resp.data && resp.data._id) {
      const token = this.app.jwt.sign({ userId: resp.data._id }, this.config.secret, { expiresIn: '1d' })
      ctx.cookies.set('__token', token, { signed: false, maxAge: 1000 * 3600 * 24, path: '/' })
    }
    ctx.unsafeRedirect(process.env.HOME_PAGE || 'http://localhost:3000/sprint')
  }
  async userInfo(ctx) {
    ctx.body = await ctx.service.oauth.getUserInfo(ctx.request.body)
  }
  async logout(ctx) {
    ctx.cookies.set('__token', null, { signed: false, maxAge: 1000 * 3600 * 24, path: '/' })
    ctx.body = { errno: 0, msg: '注销成功' }
  }
}

module.exports = OauthController
