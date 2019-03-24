class WorkOrderController extends require('egg').Controller {
  async getWorkorder(ctx) {
    ctx.body = await ctx.service.workorder.getWorkorder(ctx.query)
  }

  async setWorkorder(ctx) {
    ctx.body = await ctx.service.workorder.setWorkorder(ctx.request.body)
  }

  async deleteWorkorder(ctx) {
    ctx.body = await ctx.service.workorder.getWorkorder({ ...ctx.query, ...ctx.params })
  }

  async updateWorkorder(ctx) {
    ctx.body = await ctx.service.workorder.updateWorkorder(ctx.request.body)
  }
}

module.exports = WorkOrderController
