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
    this.ws = webSocket(this.wsPath, { path: '/socket', query: { _id: this.user._id } })

    this.ws.on('connect', () => {
      this.isConnect = true
    })
    this.ws.on('disconnect', () => {
      this.ws.close()
      this.ws = null
      this.isConnect = false
    })
    this.ws.on('handleInviteUser', data => {
      notification.info({
        message: '新成员加入！',
        description: `用户：【${data.userName}】加入团队！！！`
      })
    })
    this.ws.on('handleSetPermission', data => {
      notification.info({
        message: '您的权限发生了变化！',
        description: `您的权限已变动成：【${data.permission}】，刷新页面哦！`
      })
    })
  },
  setTeam() {
    this.ws.emit('setTeam', this.team._id)
  },
  resetUser() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnect = false
  },
  inviteUser(data) {
    this.ws.emit('inviteUser', { teamId: this.team._id, userName: data.name })
  },
  setPermission({ enhanceUserId, permission }) {
    this.ws.emit('setPermission', { userId: enhanceUserId, permission })
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