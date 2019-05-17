import { observable } from 'mobx'
import webSocket from 'socket.io-client'
import { notification } from 'antd'
import UserStore from './user'

class SocketProxy extends UserStore {
  constructor() {
    super()
  }
  ws = null
  wsPath = process.env.NODE_ENV === 'development' ? '/' : 'https://team.calabash.top/'

  @observable
  isConnect = false
}

const handlerMap = {
  setUser() {
    this.ws = webSocket(this.wsPath, { path: '/socket' })
    this.ws.on('connect', () => {
      this.isConnect = true
    })
    this.ws.on('newTeamMember', data => {
      notification.open({
        message: '新成员加入！',
        description: `用户：【${data.userName}】加入团队！！！`
      })
    })
    this.ws.on('disconnect', () => {
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
      this.isConnect = false
    })
  },
  setTeam() {
    this.ws && this.ws.emit('joinTeam', this.team._id)
  },
  resetUser() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnect = false
  },
  inviteUser(data) {
    this.ws && this.ws.emit('inviteUser', { teamId: this.team._id, userName: data.name })
  }
}

export default new Proxy(new SocketProxy(), {
  get(target, propKey) {
    const result = Reflect.get(target, propKey)
    const webSocketHandler = handlerMap[propKey]
    if (typeof result !== 'function' || !webSocketHandler) {
      return result
    }
    return async (...args) => {
      const res = await result.apply(target, args)
      webSocketHandler.call(target, res)
    }
  },
})
