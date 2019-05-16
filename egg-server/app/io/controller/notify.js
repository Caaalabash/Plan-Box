class NotifyController extends require('egg').Controller {
  constructor(ctx) {
    super(ctx)
    this.nsp = ctx.app.io.of('/')
  }
  async joinTeam() {
    const { ctx } = this
    const teamId = ctx.args[0]

    ctx.socket.join(teamId)
  }
  async inviteUser() {
    const { ctx } = this
    const { teamId, userName } = ctx.args[0]

    this.nsp.to(teamId).emit('newTeamMember', { userName })
  }
}

module.exports = NotifyController