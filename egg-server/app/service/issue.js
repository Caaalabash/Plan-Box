class IssueService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TaskModel = ctx.model.Task
  }
  /**
   * 创建子任务, 实质是更新taskModel
   */
  async setIssue({ taskId, ...data }) {
    const [e, doc] = await this.toPromise(
      this.TaskModel.updateOne({ _id: taskId }, { $push: { issue: data } })
    )

    if (e) return { errorMsg: '创建失败' }
    return { msg: '创建成功', data: doc }
  }
  /**
   * 删除子任务, 实质是更新taskModel
   */
  async deleteIssue({ taskId, _id }) {
    const [e, ] = await this.toPromise(
      this.TaskModel.updateOne({_id: taskId}, { $pull: { issue: { _id } } })
    )

    if (e) return { errorMsg: '删除失败' }
    return { msg: '删除成功' }
  }
  /**
   * 更新Issue状态
   */
  async updateIssueStatus({ taskId, issueId, status }) {
    const [e, ] = await this.toPromise(
      this.TaskModel.updateOne({ _id: taskId, 'issue._id': issueId }, { $set: { 'issue.$.status': status } })
    )
    if (e) return { errorMsg: '修改失败' }
    return { msg: '修改成功' }
  }
}

module.exports = IssueService