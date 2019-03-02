class IssueService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.response =  ctx.helper.response
    this.TaskModel = ctx.model.Task
  }

  async setIssue({ taskId, ...data }) {
    const [, task] = await this.toPromise(this.TaskModel.findById(taskId))
    if (!task) this.response(this.config.errorCode, {}, '所属Task已不存在')

    const [e, doc] = await this.toPromise(this.TaskModel.updateOne({_id: taskId}, {
      $push: {
        issue: data
      }
    }))
    if (e) return this.response(this.config.errorCode, {}, '创建失败')
    return this.response(this.config.successCode, doc, '创建成功')
  }

  async deleteIssue({ taskId, _id }) {
    const [e,] = await this.toPromise(this.SprintModel.updateOne({_id: taskId}, {
      $pull: {
        issue: { _id }
      }
    }))
    if (e) return this.response(this.config.errorCode, {}, '删除失败')
    return this.response(this.config.successCode, {}, '删除成功')
  }

  async updateIssue({ taskId, ...data }) {
    const [e, doc] = await this.toPromise(this.SprintModel.updateOne({_id: taskId}, {
      $set: {
        "issue.$": data
      }
    }))
    if (e) return this.response(this.config.errorCode, doc, '修改失败')
    return this.response(this.config.successCode, {}, '修改成功')
  }
}

module.exports = IssueService