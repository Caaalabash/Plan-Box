class TeamController extends require('egg').Controller {

  async getTeam(ctx) {
    ctx.body = await ctx.service.team.getTeam(ctx.query)
  }

  async createTeam(ctx) {
    ctx.body = await ctx.service.team.createTeam(ctx.request.body)
  }

}

module.exports = TeamController
