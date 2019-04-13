import { observable, action, computed } from 'mobx'
import Service from 'service'

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
   * 设置登录信息, 并获取团队信息
   */
  @action
  async setUser(userData) {
    this.user = userData
    if (this.user.team && this.user.team.belong) {
      const team = await Service.getTeam(this.user.team.belong)
      if (!team.errno) this.team = team.data
    }
    localStorage.removeItem('plan-box-userinfo')
  }
  /**
   * 清空登录信息
   */
  @action
  resetUser() {
    this.user = null
    this.team = null
    localStorage.removeItem('plan-box-userinfo')
  }
  /**
   * 邀请成员
   */
  @action
  async inviteUser(inviteUserId) {
    const resp = await Service.inviteUser(inviteUserId)
    if (!resp.errno) this.team.memberInfo.push(resp.data)
  }
  /**
   * 提升成员权限
   */
  async setPermission(enhanceUserId, permission) {
    const resp = await Service.setPermission(enhanceUserId, permission)
    if (!resp.errno) {
      const userIndex = this.team.memberInfo.findIndex(user => user._id === enhanceUserId)
      this.team.memberInfo[userIndex].permission = permission
    }
  }
  /**
   * 移除成员
   */
  async removeMember(memberId) {
    const resp = await Service.removeMember(memberId)
    if (!resp.errno) {
      const userIndex = this.team.memberInfo.findIndex(user => user._id === memberId)
      this.team.memberInfo.splice(userIndex, 1)
    }
  }
  /**
   * 创建团队
   */
  async createTeam(payload) {
    const resp = await Service.createTeam(payload)
    if (!resp.errno) {
      const teamResp = await Service.getTeam(resp.data._id)
      if (!teamResp.errno) {
        this.team = teamResp.data
        this.user.team.permission = 'owner'
        this.user.team.belong = this.team._id
      }
    }
  }
  /**
   * 退出团队
   */
  async leaveTeam() {
    const resp = await Service.leaveTeam()
    if (!resp.errno) {
      this.team = null
      this.user.team = {}
    }
  }
}

export default new UserStore()