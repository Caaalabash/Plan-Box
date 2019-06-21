class TaskService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TaskModel = ctx.model.Task
    this.SprintModel = ctx.model.Sprint
  }
  /**
   * 获取 Task 信息
   * @param {string} id 所属SprintId
   * @return {object} 对应Sprint下所有子任务
   */
  async getTask({ id }) {
    const result = await this.toPromise(
      this.TaskModel.find({ relateSprint: id })
    )

    return { data: result }
  }
  /**
   * 创建新的 Task, 创建前检查对应 Sprint 下是否存在相同 title
   * @param {string} userId [useless userId]
   * @param {string} relateSprint 所属SprintId
   * @param {object} data 子任务payload
   * @return {object} 创建后的task文档
   */
  async setTask({ userId, relateSprint, ...data }) {
    const isExist = await this.toPromise(
      this.TaskModel.findOne({ relateSprint, title: data.title })
    )
    if (isExist) return { errorMsg: '当前Task已存在' }

    const taskDoc = await this.toPromise(
      this.TaskModel.create({ relateSprint, ...data })
    )
    await this.toPromise(
      this.SprintModel.update({_id: relateSprint}, {
        $push: {
          task: {
            _id: taskDoc._id,
            title: data.title,
            storyPoint: data.storyPoint,
            responsible: data.responsible,
          },
        }
      })
    )

    return { data: taskDoc, msg: '创建成功' }
  }
  /**
   * 更新 Task
   * @param {string} userId [useless userId]
   * @param {object} data 更新载体
   * @return {object} 更新后Task文档
   */
  async updateTask({ userId, ...data }) {
    const options = { 'new': true, 'upsert': true }
    const { _id, ...update } = data
    const shouldUpdateSprint = data.title || data.responsible || data.storyPoint

    const doc = await this.toPromise(
      this.TaskModel.findByIdAndUpdate(_id, update, options)
    )
    if(shouldUpdateSprint) {
      this.toPromise(
        this.SprintModel.updateOne({ _id: data.relateId, "task._id": data._id }, {
          $set: {
            'task.$': {
              _id,
              title: doc.title,
              storyPoint: doc.storyPoint,
              responsible: doc.responsible
            }
          }
        })
      )
    }
    return { data: doc, msg: '更新成功' }
  }
  /**
   * 删除 Task
   * @param {string} _id TaskId
   * @param {string} relateId 所属SprintId
   * @return {object} success response
   */
  async deleteTask({ _id, relateId }) {
    const deleteTaskPromise = this.toPromise(
      this.TaskModel.findOneAndDelete({ _id })
    )
    const deleteSprintPromise = this.toPromise(
      this.SprintModel.updateOne({ _id: relateId }, { $pull: { task: { _id } } })
    )
    await Promise.all([deleteTaskPromise, deleteSprintPromise])

    return { msg: '删除成功' }
  }
  /**
   * 更新 Task 顺序
   * @param {string} id TaskId
   * @param {string} sequence 新的排序值
   * @return {object} success response
   */
  async updateSequence({ id, sequence }) {
    await this.toPromise(
      this.TaskModel.updateOne({ _id: id }, { sequence })
    )

    return { msg: '' }
  }
}

module.exports = TaskService
