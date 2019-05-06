import { observable, action } from 'mobx'
import Service from 'service'

class BacklogStore {
  /**
   * 任务池
   */
  @observable backlog = []

  /**
   * 设置任务池数据
   */
  @action
  async setBacklog(data) {
    this.backlog = data
  }
  /**
   * 添加任务进任务池
   */
  @action
  async createBacklog(data) {
    const resp = await Service.createBacklog(data)
    if (!resp.errno) {
      this.backlog.push(resp.data)
    }
  }
  /**
   * 删除某个任务
   */
  @action
  async deleteBacklog(backlogId) {
    const resp = await Service.deleteBacklog(backlogId)
    const backlogIndex = this.backlog.findIndex(item => item._id === backlogId)
    if (!resp.errno) {
      this.backlog.splice(backlogIndex, 1)
    }
  }
  /**
   * 更新某个任务
   */
  @action
  async updateBacklog(backlogId, payload) {
    const resp = await Service.updateBacklog(backlogId, payload)
    const backlogIndex = this.backlog.findIndex(item => item._id === backlogId)
    if (!resp.errno) {
      this.backlog[backlogIndex] = resp.data
    }
  }
}

export default new BacklogStore()