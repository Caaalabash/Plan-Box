class WorkorderService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TicketModel = ctx.model.Ticket
  }
  /**
   * 创建工单
   * @param {object} data 工单载体
   * @return {object} success response
   */
  async setWorkOrder(data) {
    const doc = await this.toPromise(
      this.TicketModel.create(data)
    )

    return { msg: '提交成功', data: doc }
  }
  /**
   * 删除工单
   * @param {string} orderId 用户
   * @return {object} success response
   */
  async deleteWorkOrder({ orderId }) {
    await this.toPromise(
      this.TicketModel.findOneAndRemove({ _id: orderId })
    )

    return { msg: '删除成功' }
  }
  /**
   * 修改工单, 每次都全量更新
   * @param {object} payload 工单载体
   * @return {object} success response
   */
  async updateWorkOrder({ userId, feedback, status, type, title, content }) {
    const doc = await this.toPromise(
      this.TicketModel.findOneAndUpdate({ _id: userId }, { $set: { feedback, status, type, title, content} }, { 'new': true })
    )

    return { msg: '修改成功', data: doc }
  }
  /**
   * 获取工单
   * @param {boolean} isAdmin 是否为管理员
   * @param {string} userId 用户Id
   * @return {object} 当前身份下能获得的全部工单
   */
  async getWorkOrder({ isAdmin = false, userId }){
    const query = isAdmin ? { } : { userId }
    const doc = await this.toPromise(
      this.TicketModel.find(query)
    )

    return { data: doc }
  }
}

module.exports = WorkorderService