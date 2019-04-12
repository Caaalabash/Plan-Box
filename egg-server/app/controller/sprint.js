class SprintController extends require('egg').Controller {
  async getSprintByFilter(ctx) {
    ctx.body = await ctx.service.sprint.getSprintByFilter(ctx.request.body)
  }

  async getSprint(ctx) {
    ctx.body = await ctx.service.sprint.getSprint(ctx.request.body)
  }

  async setSprint(ctx) {
    ctx.body = await ctx.service.sprint.setSprint(ctx.request.body)
  }

  async updateSprint(ctx) {
    ctx.body = await ctx.service.sprint.updateSprint(ctx.request.body)
  }

  async deleteSprint(ctx) {
    ctx.body = await ctx.service.sprint.deleteSprint(ctx.request.body)
  }
}

module.exports = SprintController
