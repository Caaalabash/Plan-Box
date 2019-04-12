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

}

export default new UserStore()