class NotifyController extends require('egg').Controller {
  constructor(ctx) {
    super(ctx)
    this.nsp = ctx.app.io.of('/')
    this.socketMap = ctx.app.socketMap
  }
  /**
   * 对于有团队的用户, 加入对应的房间
   */
  async joinTeam() {
    const { ctx } = this
    const teamId = ctx.args[0]

    ctx.socket.join(teamId)
  }
  /**
   * 邀请用户的同步操作
   */
  async inviteUser() {
    const { ctx } = this
    const { teamId, userName } = ctx.args[0]

    this.nsp.to(teamId).emit('handleInviteUser', { userName })
  }
  /**
   * 设定权限的同步操作
   */
  async setPermission() {
    const { ctx } = this
    const { userId, permission } = ctx.args[0]
    const socket = this.socketMap.get(userId)

    if (socket) {
      socket.emit('handleSetPermission', { permission })
    }
  }
}

module.exports = NotifyController