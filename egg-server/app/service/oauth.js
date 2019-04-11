class OauthService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.OauthModel = ctx.model.Oauth
  }
  /**
   * Github登录, 获取个人信息更新数据库
   * @param {string} code GITHUB校验码
   * @return {object} 用户信息
   */
  async getGithubInfo({ code }) {
    const { data } = await this.ctx.$post(`https://github.com/login/oauth/access_token`, {
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      code
    })
    if (data.error) return { errorMsg: '授权失败' }
    const userInfoRes = await this.ctx.$get(`https://api.github.com/user?access_token=${data.access_token}`)
    const userInfo = JSON.parse(JSON.stringify(userInfoRes.data))
    const update = ['name', 'bio', 'location', 'company', 'blog', 'email', 'avatar_url'].reduce((obj, key) => {
      obj[key] = userInfo[key] || ''
      return obj
    }, {})

    const options = { 'new': true, 'upsert': true }
    const doc =  await this.toPromise(
      this.OauthModel.findOneAndUpdate({ id: userInfo.id }, update, options)
    )

    return { data: doc }
  }
  /**
   * 获取个人信息
   * @param {string} userId 用户Id
   * @return {object} 用户信息
   */
  async getUserInfo({ userId }) {
    const doc = await this.toPromise(
      this.OauthModel.findById(userId)
    )

    return { data: doc }
  }
  /**
   * 设定团队 [TEAM SERVICE 使用]
   * @param {string} userId 用户Id
   * @param {string} belong 目标TEAM Id
   * @param {string} permission 用户身份
   * @return {none}
   */
  async setTeamInfo(userId, belong, permission = '') {
    await this.toPromise(
      this.OauthModel.findOneAndUpdate({ _id: userId }, { team: { belong, permission } }, { 'new': true } )
    )
  }
  /**
   * 获取用户TEAM信息 [TEAM SERVICE 使用]
   * @param {string} userId 用户Id
   * @return {object} team 用户TEAM信息
   */
  async getTeamInfo(userId) {
    const doc = await this.toPromise(
      this.OauthModel.findOne({ _id: userId })
    )

    return doc.team || {}
  }
}

module.exports = OauthService
