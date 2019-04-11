class TeamService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TeamModel = ctx.model.Team
  }
  /**
   * 获得 Team 信息
   * @param {string} teamId 团队Id
   * @return {object} 团队信息
   */
  async getTeam({ teamId }) {
    const result = await this.toPromise( this.TeamModel.findOne({ _id: teamId }) )

    return { data: result }
  }
  /**
   * 创建 Team
   * @param {string} name 团队名称
   * @param {object} owner 所有者信息
   * @return {object} 团队信息
   */
  async createTeam({ name, owner }) {
    const result = await this.toPromise( this.TeamModel.create({ name, owner }) )
    await this.service.oauth.setTeamInfo(owner[0].userId, result._id, 'owner')

    return { data: result, msg: '创建成功' }
  }
}

module.exports = TeamService
