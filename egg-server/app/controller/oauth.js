class OauthController extends require('egg').Controller {
  async github(ctx) {
    ctx.body = await ctx.service.oauth.getGithubInfo(ctx.request.body)
  }
}

module.exports = OauthController
