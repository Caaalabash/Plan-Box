class SprintService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise = ctx.helper.to
    this.SprintModel = ctx.model.Sprint
    this.TaskModel = ctx.model.Task
  }
  /**
   * 查找多个 Sprint
   * @param {string} status 筛选条件
   * @return {object} 所有Sprint信息
   */
  async getSprintByFilter({ status }) {
    const query = status !== 'all' ? { status } : {}
    const result = await this.toPromise(
      this.SprintModel.find(query)
    )

    if (!result) return { errorMsg: '未查询相应的Sprint' }
    return { data: result }
  }
  /**
   * 查询某个 Sprint
   * @param {string} _id SprintId
   * @return {object} Sprint信息
   */
  async getSprint({ _id }) {
    const result = await this.toPromise(
      this.SprintModel.findById(_id)
    )

    return { data: result, msg: '查询成功' }
  }
  /**
   * 创建 Sprint
   * @param {object} data Sprint载体
   * @return {object} Sprint信息
   */
  async setSprint(data) {
    const checkResult = await this.toPromise(
      this.SprintModel.findOne({ title: data.title })
    )
    if (checkResult) return { errorMsg: '当前Sprint已存在' }

    const createResult = await this.toPromise(
      this.SprintModel.create(data)
    )
    return { data: createResult, msg: '创建成功' }
  }
  /**
   * 更新 Sprint 信息
   * @param {string} _id SprintId
   * @param {object} update 更新载体
   * @return {object} 更新后文档
   */
  async updateSprint({ _id, ...update }) {
    const options = { 'new': true, 'upsert': true }
    const updateResult = await this.toPromise(
      this.SprintModel.findByIdAndUpdate(_id, update, options)
    )

    return { data: updateResult, msg: '更新成功' }
  }
  /**
   * 删除 Sprint
   * @param {string} _id SprintId
   * @return {object} success response
   */
  async deleteSprint({ id }) {
    const deleteTask = this.toPromise(
      this.TaskModel.deleteMany({ relateSprint: id })
    )
    const deleteSprint = this.toPromise(
      this.SprintModel.findByIdAndRemove(id)
    )
    await Promise.all([deleteTask, deleteSprint])

    return { msg: '删除成功' }
  }
}

module.exports = SprintService
