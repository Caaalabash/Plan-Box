import { observable, action, computed } from 'mobx'

class UserStore {

  @observable user = null

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
  @computed get isLogin() {
    return !!this.user
  }

}

class Store {
  constructor() {
    this.userStore = new UserStore()
  }
}

export default new Store()
