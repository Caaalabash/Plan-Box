class OauthService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.response =  ctx.helper.response
  }

  async getGithubInfo(code) {
    if (!code) return
    const { data } = await this.ctx.$post(`https://github.com/login/oauth/access_token`, { client_id: process.env.GITHUB_ID, client_secret: process.env.GITHUB_SECRETID, code }, { Accept: 'application/json' })
    if (data.error) return this.response(this.config.errorCode, {}, '授权失败')

    const userInfo = await this.ctx.$get(`https://api.github.com/user?access_token=${data.access_token}`)
    return this.response(this.config.successCode, userInfo.data, '授权成功')
  }
}

module.exports = OauthService
