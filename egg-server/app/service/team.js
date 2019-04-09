class TeamService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TeamModel = ctx.model.Team
  }
  /**
   * 根据 Team _id 获得对应团队信息
   */
  async getTeam({ id }) {
    const [e, result] = await this.toPromise( this.TeamModel.findOne({ _id: id }) )

    if(e || !result) return { errorMsg: '' }
    return { data: result }
  }
  async createTeam({ name, owner }) {
    const [e, result] = await this.toPromise( this.TeamModel.create({ name, owner }) )

    if(e || !result) return { errorMsg: '创建失败' }
    return { data: result, msg: '创建成功' }
  }
}

module.exports = TeamService
