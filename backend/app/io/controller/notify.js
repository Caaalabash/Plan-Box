class NotifyController extends require('egg').Controller {
  constructor(ctx) {
    super(ctx)
    this.nsp = ctx.app.io.of('/')
    this.toPromise =  ctx.helper.to
    this.socketMap = ctx.app.socketMap
    this.OauthModel = ctx.model.Oauth
  }
  /**
   * 处理团队通知
   */
  distributeNotify() {
    const { type, ...args } = this.ctx.args[0]
    this[type].call(this, args)
  }
  /**
   * 团队数据同步 [供内部使用]
   * @params {string} teamId 团队ID
   * @params {string} range 广播范围: all / others / self
   * @params {object} socket 指定socket
   */
  async syncTeamData(teamId, range = 'all', socket) {
    const teamInfo = await this.service.team.getTeamInfo(teamId)
    socket = socket || this.ctx.socket

    switch (range) {
      case 'all':
        this.nsp.to(teamId).emit('SyncTeamData', teamInfo)
        break
      case 'others':
        socket.to(teamId).emit('SyncTeamData', teamInfo)
        break
      case 'self':
        socket.emit('SyncTeamData', teamInfo)
        break
    }
  }
  /**
   * 工单数据 [供内部使用]
   * @description 一般需要同步管理员socket, 以及提交用户socket
   * @params {string} userId 用户id
   * @params {string} adminId 管理员id
   */
  async syncWorkOrderData(userId, adminId) {
    const workOrderList = await Promise.all(
      [userId, adminId].map(id => this.service.workorder.getWorkOrder({ id }))
    )
    ;[this.ctx.socket, this.socketMap.get(adminId)].forEach((socket, index) =>
      socket && socket.emit('SyncWorkOrderData', workOrderList[index])
    )
  }
  /**
   * 加入团队房间 [供内部使用]
   */
  async joinTeam({ teamId }) {
    this.ctx.socket.join(teamId)
  }
  /**
   * 邀请成员加入团队 [供内部使用]
   */
  async inviteUser({ teamId, teamName, userId, userName }) {
    const socket = this.socketMap.get(userId)
    // 通知其余成员
    this.ctx.socket.to(teamId).emit('TeamNotification', {
      message: '新成员加入！',
      description: `用户：【${userName}】加入团队！！！`
    })
    // 通知被邀请人
    if (socket) {
      socket.join(teamId)
      socket.emit('TeamNotification', {
        message: '您被邀请加入团队！',
        description: `您被邀请加入团队: 【${teamName}】！！！`
      })
    }
    // 向除自身外的成员同步团队数据
    this.syncTeamData(teamId, 'others')
  }
  /**
   * 移除成员 [供内部使用]
   */
  async removeMember({ teamId, teamName, userId, userName }) {
    const socket = this.socketMap.get(userId)
    // 通知被移除成员
    if (socket) {
      socket.leave(teamId)
      socket.emit('TeamNotification', {
        message: '您被移出团队！',
        description: `您被移出【${teamName}】团队！！！`
      })
      socket.emit('SyncTeamData', null)
    }
    // 通知其余成员
    this.ctx.socket.to(teamId).emit('TeamNotification', {
      message: '成员被移出！',
      description: `用户：【${userName}】被移出了团队！！！`
    })
    // 向除自身外的成员同步团队数据
    this.syncTeamData(teamId, 'others')
  }
  /**
   * 调整成员的权限, 通知被操作者, 同步数据 [供内部使用]
   */
  async setPermission({ teamId, userId, permission }) {
    const socket = this.socketMap.get(userId)
    // 通知被操作成员
    if (socket) {
      socket.emit('TeamNotification', {
        message: '您的权限发生了变化！',
        description: `您的权限已变动成：【${permission}】！！！`
      })
      this.syncTeamData(teamId, 'self', socket)
    }
  }
  /**
   * 主动退出团队, 向其余团队成员广播, 并同步数据 [供内部使用]
   */
  async leaveTeam({ teamId, userId, userName }) {
    const socket = this.socketMap.get(userId)

    if (socket) {
      socket.leave(teamId)
    }
    this.nsp.to(teamId).emit('TeamNotification', {
      message: '成员退出！',
      description: `用户：【${userName}】退出了团队！！！`
    })
    this.syncTeamData(teamId, 'all')
  }
  /**
   * 回复工单
   */
  async replyWorkOrder({ payload }) {
    const socket = this.socketMap.get(payload.userId)

    if (socket) {
      socket.emit('WorkOrderNotification', {
        message: '您的工单得到反馈！',
        description: `工单【${payload.title}】得到管理员回复！！！`,
      })
    }
  }
  /**
   * 新工单
   */
  async newWorkOrder({ payload }) {
    const { _id } = await this.toPromise(
      this.OauthModel.findOne({ isAdmin: true }, { _id: 1 })
    )
    const socket = this.socketMap.get(_id.toString())

    if (socket) {
      socket.emit('WorkOrderNotification', {
        message: '您有新的工单等待处理！',
        description: `工单【${payload.title}】需要您的处理！！！`,
      })
    }
  }
}

module.exports = NotifyController