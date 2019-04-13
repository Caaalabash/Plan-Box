class TeamService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.permissionMap = ctx.helper.permissionMap
    this.TeamModel = ctx.model.Team
  }
  /**
   * 获得 Team 信息
   * @param {string} teamId 团队Id
   * @return {object} 团队信息
   */
  async getTeam({ teamId }) {
    const result = await this.toPromise( this.TeamModel.findOne({ _id: teamId }) )
    const memberList = result.member.concat(result.owner)
    const memberInfo = await this.service.oauth.getAllMemberInfo(memberList)
    const payload = {
      _id: result._id,
      name: result.name,
      owner: result.owner,
      memberInfo,
    }

    return { data: payload }
  }
  /**
   * 创建 Team
   * @param {string} name 团队名称
   * @param {string} userId 所有者Id
   * @return {object} 团队信息
   */
  async createTeam({ name, userId }) {
    const { belong } = await this.service.oauth.getTeamInfo(userId)
    if (belong) return { errorMsg: '只能创建一个TEAM' }

    const result = await this.toPromise( this.TeamModel.create({ name, owner: userId }) )
    await this.service.oauth.setTeamInfo(userId, result._id, 'owner')

    return { data: result, msg: '创建成功' }
  }
  /**
   * 邀请成员
   * @param {string} userId 邀请人Id
   * @param {string} inviteUserId 被邀请人Id
   * @return {object} 团队信息
   */
  async inviteTeamMember({ userId, inviteUserId }) {
    const { permission, belong } = await this.service.oauth.getTeamInfo(userId)
    if (!['master', 'owner'].includes(permission)) return { errorMsg: '权限不足' }

    await Promise.all([
      this.service.oauth.setTeamInfo(inviteUserId, belong, 'guest'),
      this.toPromise(
        this.TeamModel.findOneAndUpdate({ _id: belong }, { $push: { member: inviteUserId } }, { 'new': true })
      )
    ])
    const resp = await this.service.oauth.getAllMemberInfo([inviteUserId])

    return { msg: '邀请成功', data: resp[0] }
  }
  /**
   * 邀请成员 - 自动补全
   * @param {string} name 部分用户名
   * @return {object} 匹配到的用户信息
   */
  async matchMember({ name }) {
    const reg = new RegExp(name)
    const match = await this.service.oauth.matchUser(reg)

    return { data: match }
  }
  /**
   * 提升成员权限
   * @param {string} userId 操作人Id
   * @param {string} enhanceUserId 被提升者Id
   * @param {string} permission 权限
   *
   * owner 可以设置权限: guest / developer / master
   * master 可以设置权限: guest / developer
   */
  async setPermission({ userId, enhanceUserId, permission }) {
    const [userTeamInfo, enhanceUserTeamInfo] = await Promise.all([
      this.service.oauth.getTeamInfo(userId),
      this.service.oauth.getTeamInfo(enhanceUserId)
    ])
    if (!this.permissionMap[userTeamInfo.permission].includes(enhanceUserTeamInfo.permission)) return { errorMsg: '权限不足' }

    await this.service.oauth.setTeamInfo(enhanceUserId, userTeamInfo.belong, permission)

    return { msg: '更改成功' }
  }
  /**
   * 移除成员, 仅限所有者
   * @param {string} userId 操作者Id
   * @param {string} memberId 被移除整者Id
   * @return {object} success response
   */
  async deleteTeamMember({ userId, memberId }) {
    const { permission, belong } = await this.service.oauth.getTeamInfo(userId)
    if (permission !== 'owner') return { errorMsg: '权限不足' }

    await Promise.all([
      this.service.oauth.setTeamInfo(memberId, '', ''),
      this.toPromise( this.TeamModel.findOneAndUpdate({ _id: belong }, { $pull: { member: memberId } }) )
    ])

    return { msg: '移除成功' }
  }
}

module.exports = TeamService
