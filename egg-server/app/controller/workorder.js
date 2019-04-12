class WorkOrderController extends require('egg').Controller {
  async getWorkOrder(ctx) {
    ctx.body = await ctx.service.workorder.getWorkOrder(ctx.request.body)
  }

  async setWorkOrder(ctx) {
    ctx.body = await ctx.service.workorder.setWorkOrder(ctx.request.body)
  }

  async deleteWorkOrder(ctx) {
    ctx.body = await ctx.service.workorder.deleteWorkOrder({ ...ctx.request.body, ...ctx.params })
  }

  async updateWorkOrder(ctx) {
    ctx.body = await ctx.service.workorder.updateWorkOrder(ctx.request.body)
  }
}

module.exports = WorkOrderController
