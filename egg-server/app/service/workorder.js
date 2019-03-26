class WorkorderService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TicketModel = ctx.model.Ticket
  }
  /**
   * 创建工单, 不做重复性校验
   */
  async setWorkOrder(data) {
    const [e, doc] = await this.toPromise(this.TicketModel.create(data))

    if (e) return { errorMsg: '提交失败' }
    return { msg: '提交成功', data: doc }
  }
  /**
   * 删除工单, 校验userId(ctx.query), _id(ctx.params)
   */
  async deleteWorkOrder({ userId, _id }) {
    const [e, ] = await this.toPromise(this.TicketModel.findOneAndRemove({ _id, userId }))

    if (e) return { errorMsg: '删除失败' }
    return { msg: '删除成功' }
  }
  /**
   * 修改工单, 每次都全量更新
   *
   * 管理员可修改内容: feedback, status, type
   * 用户可修改内容: title, content, type
   * updateTime 自动更新
   */
  async updateWorkOrder({ _id, feedback, status, type, title, content }) {
    const [e, doc] = await this.toPromise(this.TicketModel.findOneAndUpdate({ _id },
      { $set: { feedback, status, type, title, content} },
      { 'new': true })
    )

    if (e) return { errorMsg: '修改失败' }
    return { msg: '修改成功', data: doc }
  }
  /**
   * 获取工单, 判断是否为管理员, 先简单通过传递值判断
   */
  async getWorkOrder({ isAdmin = false, userId }){
    const query = isAdmin ? { } : { userId }
    const [e, doc] = await this.toPromise(this.TicketModel.find(query))

    if (e) return { errorMsg: '查询失败' }
    return { data: doc }
  }
}

module.exports = WorkorderService