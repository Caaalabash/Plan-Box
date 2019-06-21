class TeamController extends require('egg').Controller {

  async getTeam(ctx) {
    ctx.body = await ctx.service.team.getTeam({ ...ctx.request.body, ...ctx.params })
  }

  async createTeam(ctx) {
    ctx.body = await ctx.service.team.createTeam(ctx.request.body)
  }

  async inviteTeamMember(ctx) {
    ctx.body = await this.service.team.inviteTeamMember(ctx.request.body)
  }

  async setPermission(ctx) {
    ctx.body = await this.service.team.setPermission(ctx.request.body)
  }

  async autoComplete(ctx) {
    ctx.body = await this.service.team.matchMember(ctx.request.body)
  }

  async deleteTeamMember(ctx) {
    ctx.body = await this.service.team.deleteTeamMember({ ...ctx.request.body, ...ctx.params })
  }

  async leave(ctx) {
    ctx.body = await this.service.team.leave(ctx.request.body)
  }
}

module.exports = TeamController
