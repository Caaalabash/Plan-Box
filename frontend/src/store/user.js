import { observable, action, computed } from 'mobx'
import Service from 'service'

import { PERMISSION_MAP } from 'utils/constant'

class UserStore {
  /**
   * 用户登录信息
   */
  @observable user = null
  /**
   * 用户团队信息(依赖登录信息)
   */
  @observable team = null
  /**
   * 是否登录
   */
  @computed get isLogin() {
    return !!this.user
  }
  /**
   * 权限
   */
  @computed get permission() {
    return this.user && this.user.team.permission
  }
  /**
   * 获取团队成员列表
   */
  @computed get teamMember() {
    return this.team ? this.team.memberInfo : []
  }
  /**
   * 获取团队成员简略信息, 用于Select组件
   */
  @computed get responsibleList() {
    if (!this.team) return []
    return this.team.memberInfo.map(({ name, _id }) => ({
      label: name, value: _id
    }))
  }
  /**
   * 获取当前权限的覆盖范围
   */
  @computed get permissionRange() {
    if (!this.permission) return []
    return PERMISSION_MAP[this.permission]
  }
  /**
   * 设置登录信息 [触发Proxy-User]
   */
  @action
  setUser(userData) {
    this.user = userData
  }
  /**
   * 设置团队信息 [触发Proxy-User]
   * @return {Object} teamId
   */
  @action
  setTeam(team) {
    this.team = team
    return { teamId: team._id }
  }
  /**
   * 清空登录信息 [触发Proxy-User]
   */
  @action
  resetUser() {
    this.user = null
    this.team = null
  }
  /**
   * 邀请成员 [触发Proxy-User]
   * @return { teamName, teamId, userId, userName }
   */
  @action
  async inviteUser(inviteUserId) {
    const resp = await Service.inviteUser(inviteUserId)
    if (!resp.errno) {
      this.team.memberInfo = [...this.team.memberInfo, resp.data]
      return {
        teamId: this.team._id,
        teamName: this.team.name,
        userName: resp.data.name,
        userId: resp.data._id
      }
    }
  }
  /**
   * 提升成员权限 [触发Proxy-User]
   * @return { permission, userId }
   */
  @action
  async setPermission(userId, permission) {
    const resp = await Service.setPermission(userId, permission)
    if (!resp.errno) {
      const userIndex = this.team.memberInfo.findIndex(user => user._id === userId)
      this.team.memberInfo[userIndex].permission = permission
      return {
        userId,
        permission,
        teamId: this.team._id
      }
    }
  }
  /**
   * 移除成员 [触发Proxy-User]
   * @return { teamId, teamName, userId, userName }
   */
  @action
  async removeMember(memberId) {
    const resp = await Service.removeMember(memberId)
    if (!resp.errno) {
      const userIndex = this.team.memberInfo.findIndex(user => user._id === memberId)
      const deleteMember = this.team.memberInfo.splice(userIndex, 1)
      return {
        teamId: this.team._id,
        teamName: this.team.name,
        userName: deleteMember[0].name,
        userId: deleteMember[0]._id
      }
    }
  }
  /**
   * 创建团队
   */
  @action
  async createTeam(payload) {
    const resp = await Service.createTeam(payload)
    if (!resp.errno) {
      const teamResp = await Service.getTeam(resp.data._id)
      if (!teamResp.errno) {
        this.setTeam(teamResp.data)
        this.user.team.permission = 'owner'
        this.user.team.belong = this.team._id
      }
    }
  }
  /**
   * 退出团队 [触发Proxy-User]
   * @return { teamId, teamName, userId, userName }
   */
  @action
  async leaveTeam() {
    const resp = await Service.leaveTeam()
    if (!resp.errno) {
      const teamId = this.team._id
      const teamName = this.team.name
      this.team = null
      this.user.team = {}
      return {
        teamId,
        teamName,
        userId: this.user._id,
        userName: this.user.name
      }
    }
  }
}

export default UserStore