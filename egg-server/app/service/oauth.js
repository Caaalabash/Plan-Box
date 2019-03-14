class OauthService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.response =  ctx.helper.response
    this.OauthModel = ctx.model.Oauth
  }

  async getGithubInfo({ code }) {
    if (!code) return
    const { data } = await this.ctx.$post(`https://github.com/login/oauth/access_token`, {
      client_id: process.env.GITHUB_ID,
      client_secret: process.env.GITHUB_SECRETID,
      code
    })

    if (data.error) return this.response(this.config.errorCode, data, '授权失败')
    const userInfoRes = await this.ctx.$get(`https://api.github.com/user?access_token=${data.access_token}`)
    const userInfo = JSON.parse(JSON.stringify(userInfoRes.data))

    const options = {
      'new': true,
      'upsert': true,
    }
    const update = ['name', 'bio', 'location', 'company', 'blog', 'email', 'avatar_url'].reduce((obj, key) => {
      obj[key] = userInfo[key] || ''
      return obj
    }, {})
    const [, doc] = await this.toPromise(this.OauthModel.findOneAndUpdate({ id: userInfo.id }, update, options))

    return this.response(this.config.successCode, doc, '')
  }
}

module.exports = OauthService
