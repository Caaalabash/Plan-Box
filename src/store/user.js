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
   * 获取团队成员简略信息, 用于Select组件
   */
  @computed get responsibleList() {
    if (!this.team) return []
    return this.team.memberInfo.map(({ name, _id }) => ({
      label: name, value: _id
    }))
  }
  /**
   * 设置登录信息
   */
  @action
  setUser(userData) {
    this.user = userData
    localStorage.removeItem('isLogin')
  }
  /**
   * 设置团队信息
   */
  @action
  setTeam(team) {
    this.team = team
  }
  /**
   * 清空登录信息
   */
  @action
  resetUser() {
    this.user = null
    this.team = null
    localStorage.removeItem('isLogin')
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