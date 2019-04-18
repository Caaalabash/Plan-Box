class IssueService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TaskModel = ctx.model.Task
  }
  /**
   * 创建 Issue
   * @param {string} userId [useless userId]
   * @param {string} taskId 所属TaskId
   * @param {object} data Issue内容
   * @return {object} success response
   */
  async setIssue({ userId, taskId, ...data }) {
    const doc = await this.toPromise(
      this.TaskModel.findOneAndUpdate({ _id: taskId }, { $push: { issue: data } }, { 'new': true })
    )

    return { msg: '创建成功', data: doc }
  }
  /**
   * 删除 Issue
   * @param {string} taskId 所属TaskId
   * @param {string} issueId 对应IssueId
   * @return {object} success response
   */
  async deleteIssue({ taskId, issueId }) {
    await this.toPromise(
      this.TaskModel.findOneAndUpdate({ _id: taskId }, { $pull: { issue: { _id: issueId } } })
    )

    return { msg: '删除成功' }
  }
  /**
   * 更新 Issue 状态
   * @param {string} taskId 所属TaskId
   * @param {string} issueId 所属IssueId
   * @param {status} status 设定的Issue状态
   */
  async updateIssueStatus({ taskId, issueId, status }) {
    await this.toPromise(
      this.TaskModel.findOneAndUpdate({ _id: taskId, 'issue._id': issueId }, { $set: { 'issue.$.status': status } })
    )

    return { msg: '修改成功' }
  }
  /**
   * 登记Issue工作日志
   * @param {string} taskId 所属TaskId
   * @param {string} issueId 所属IssueId
   * @param {string} log 工作日志
   * @param {number} time 耗费时间
   * @return {status} success response
   */
  async updateIssueLog({ taskId, issueId, log, time }) {
    await this.toPromise(
      this.TaskModel.findOneAndUpdate(
        { _id: taskId, 'issue._id': issueId },
        {
          $set: { 'issue.$.log': log },
          $inc: { 'issue.$.usedTime': time }
        }
      )
    )

    return { msg: '日志登记成功' }
  }
}

module.exports = IssueService