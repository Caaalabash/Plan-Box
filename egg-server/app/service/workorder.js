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
   * @param {string} ticketId 工单Id
   * @param {string} userId 用户Id
   * @return {object} success response
   */
  async deleteWorkOrder({ ticketId, userId }) {
    await this.toPromise(
      this.TicketModel.findOneAndRemove({ _id: ticketId, userId })
    )

    return { msg: '删除成功' }
  }
  /**
   * 增加工单反馈
   * @param {string} feedback 工单反馈
   * @param {string} ticketId 工单索引
   * @return {object} success response
   */
  async updateWorkOrder({ ticketId, feedback }) {
    const finished = 2
    const doc = await this.toPromise(
      this.TicketModel.findOneAndUpdate({ _id: ticketId }, { $set: { feedback, status: finished } }, { 'new': true })
    )

    return { msg: '修改成功', data: doc }
  }
  /**
   * 获取工单
   * @param {string} userId 用户Id
   * @return {object} 当前身份下能获得的全部工单
   */
  async getWorkOrder({ userId }){
    const isAdmin = await this.service.oauth.getUserProp(userId, 'isAdmin')
    const query = isAdmin ? {} : { userId }
    const doc = await this.toPromise(
      this.TicketModel.find(query)
    )

    return { data: doc }
  }
}

module.exports = WorkorderService