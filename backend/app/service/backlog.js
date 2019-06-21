class BacklogService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.BacklogModel = ctx.model.Backlog
  }
  /**
   * 获得指定团队的所有backlogs, 其中userId字段信息交由前端处理
   * @param {string} teamId 团队Id
   * @return {object} 所有backlogs
   */
  async getBacklogs({ teamId }) {
    const doc = await this.toPromise(
      this.BacklogModel.find({ teamId })
    )

    return { data: doc }
  }
  /**
   * 获得指定团队的所有backlogs [Oauth Service使用]
   * @param {string} teamId 团队Id
   * @return {object} 所有backlogs
   */
  async getBacklogInfo(teamId) {
    return await this.toPromise(this.BacklogModel.find({ teamId }))
  }
  /**
   * 创建一个backlog, payload中包含中间件处理的userId
   * @param {object} payload
   * @return {object} 创建成功的文档
   */
  async createBacklog(payload) {
    const doc = await this.toPromise(
      this.BacklogModel.create(payload)
    )

    return { msg: '创建成功', data: doc }
  }
  /**
   * 删除一个backlog
   * @param {string} backlogId
   * @return {object} success response
   */
  async deleteBacklog({ backlogId }) {
    await this.toPromise(
      this.BacklogModel.findOneAndRemove({ _id: backlogId })
    )

    return { msg: '删除成功' }
  }
  /**
   * 更新backlog的title/desc/priority, 并不仅限于创建者更新
   * @param {string} userId [useless params]
   * @param {string} backlogId backlog索引
   * @param {object} payload 更新载体
   * @return {status} success response
   */
  async updateBacklog({ userId, backlogId, ...payload }) {
    const { title, desc, priority } = payload
    const doc = await this.toPromise(
      this.BacklogModel.findOneAndUpdate({ _id: backlogId }, { title, desc, priority }, { 'new': true })
    )

    return { msg: '更新成功', data: doc }
  }
}

module.exports = BacklogService