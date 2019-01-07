class SprintController extends require('egg').Controller {
  async getSprintByFilter(ctx) {
    ctx.body = await ctx.service.sprint.getSprintByFilter(ctx.query)
  }

  async getSprint(ctx) {
    ctx.body = await ctx.service.sprint.getSprint(ctx.query)
  }

  async setSprint(ctx) {
    ctx.body = await ctx.service.sprint.setSprint(ctx.request.body)
  }

  async updateSprint(ctx) {
    ctx.body = await ctx.service.sprint.updateSprint(ctx.request.body)
  }

  async deleteSprint(ctx) {
    ctx.body = await ctx.service.sprint.deleteSprint(ctx.query)
  }
}

module.exports = SprintController
