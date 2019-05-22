import { observable, action } from 'mobx'
import webSocket from 'socket.io-client'
import { notification } from 'antd'
import UserStore from './user'

/**
 * 使用SocketProxy拓展UserStore模块
 * @description
 *   1. 对于WebSocket的状态在SocketProxy中处理, 例如isConnect
 *   2. 通过Proxy对UserStore方法调用进行拦截, 正常调用后向Websocket发送通知
 */
class SocketProxy extends UserStore {
  ws = null
  wsPath = '/'

  @observable
  isConnect = false

  @action
  syncTeamData(payload) {
    this.team = payload
    if (payload) {
      const { permission } = payload.memberInfo.find(member => member._id === this.user._id)
      this.user.team.belong = payload._id
      this.user.team.permission = permission
    } else {
      this.user.team.belong = ''
      this.user.team.permission = ''
    }
  }
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
    this.ws.on('TeamNotification', ({ message, description }) => {
      notification.info({ message, description })
    })
    this.ws.on('WorkOrderNotification', ({ message, description }) => {
      Notification.requestPermission().then(status => {
        if (status === 'granted') {
          new Notification(message, {
            body: description,
            tag: 'WorkOrderNotification',
            icon: 'https://team.calabash.top/favicon.ico'
          })
        }
      })
    })
    this.ws.on('SyncTeamData', data => {
      this.syncTeamData(data)
    })
  },
  resetUser() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnect = false
  },
  setTeam(data) {
    this.ws.emit('TeamNotification', {
      type: 'joinTeam',
      ...data
    })
  },
  inviteUser(data) {
    this.ws.emit('TeamNotification', {
      type: 'inviteUser',
      ...data
    })
  },
  setPermission(data) {
    this.ws.emit('TeamNotification', {
      type: 'setPermission',
      ...data
    })
  },
  removeMember(data) {
    this.ws.emit('TeamNotification', {
      type: 'removeMember',
      ...data
    })
  },
  leaveTeam(data) {
    this.ws.emit('TeamNotification', {
      type: 'leaveTeam',
      ...data
    })
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