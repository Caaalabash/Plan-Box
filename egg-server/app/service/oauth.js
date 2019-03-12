class OauthService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.response =  ctx.helper.response
  }

  async getGithubInfo() {
    return this.response(this.config.successCode, process.env.GITHUB_SECRETID, '创建成功')
  }
}

module.exports = OauthService
