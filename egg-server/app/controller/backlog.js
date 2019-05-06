class BacklogController extends require('egg').Controller {
  async getBacklogs(ctx) {
    ctx.body = await ctx.service.backlog.getBacklogs(ctx.request.body)
  }

  async createBacklog(ctx) {
    ctx.body = await ctx.service.backlog.createBacklog(ctx.request.body)
  }

  async deleteBacklog(ctx) {
    ctx.body = await ctx.service.backlog.deleteBacklog(ctx.request.body)
  }

  async updateBacklog(ctx) {
    ctx.body = await ctx.service.backlog.updateBacklog(ctx.request.body)
  }
}

module.exports = BacklogController