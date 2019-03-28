import { observable, action, computed } from 'mobx'

class UserStore {

  @observable user = null

  @computed get isLogin() {
    return !!this.user
  }

  @action
  setUser(userData) {
    this.user = userData
    localStorage.removeItem('plan-box-userinfo')
  }
  @action
  resetUser() {
    this.user = null
    localStorage.removeItem('plan-box-userinfo')
  }

}

export default new UserStore()