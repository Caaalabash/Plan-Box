class TaskController extends require('egg').Controller {
  async getTask(ctx) {
    ctx.body = await ctx.service.task.getTask(ctx.request.body)
  }

  async setTask(ctx) {
    ctx.body = await ctx.service.task.setTask(ctx.request.body)
  }

  async updateTask(ctx) {
    ctx.body = await ctx.service.task.updateTask(ctx.request.body)
  }

  async deleteTask(ctx) {
    ctx.body = await ctx.service.task.deleteTask(ctx.request.body)
  }

  async updateSequence(ctx) {
    ctx.body = await ctx.service.task.updateSequence(ctx.request.body)
  }
}

module.exports = TaskController
