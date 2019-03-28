import { observable, action } from 'mobx'

import Service from '../service'
import { setSequence } from 'utils/tool'

/**
 * 基于ES6 proxy 建议尽情修改数据
 */

class SprintStore {
  @observable sprintList = []

  /**
   * get all sprint
   */
  @action
  async initSprintList() {
    const resp = await Service.getSprintByFilter()
    if (!resp.errno) this.sprintList = resp.data
  }
  /**
   * create sprint
   */
  @action
  async addSprint(newSprint) {
    const resp = await Service.setSprint(newSprint)
    if (!resp.errno) this.sprintList.push(newSprint)
  }
  /**
   * delete sprint
   */
  @action
  async deleteSprint(_id) {
    const resp = await Service.deleteSprint(`?id=${_id}`)
    if (!resp.errno) {
      const index = this.sprintList.findIndex(item => item._id === _id)
      if (index > -1) this.sprintList.splice(index, 1)
    }
  }
  /**
   * update sprint
   */
  @action
  async updateSprint(_id, payload) {
    const resp = await Service.updateSprint({...payload, _id})
    if (!resp.errno) {
      const index = this.sprintList.findIndex(item => item._id === _id)
      if (index > -1) {
        this.sprintList[index] = resp.data
      }
    }
  }
  /**
   * update sprint status
   */
  @action
  async updateSprintStatus(_id, status) {
    const resp = await Service.updateSprint({ _id, status })
    if (!resp.errno) {
      const index = this.sprintList.findIndex(item => item._id === _id)
      if (index > -1) this.sprintList[index].status = +status
    }
  }
  /**
   * add sprint task
   */
  @action
  async addTask(relateSprint, payload) {
    const resp = await Service.setTask({ relateSprint, ...payload })
    if (!resp.errno) {
      const index = this.sprintList.findIndex(item => item._id === relateSprint)
      if (index > -1) {
        const nextSequence = this.sprintList[index].task.length + 1
        this.sprintList[index].task.push({...resp.data, sequence: nextSequence })
        this.sprintList[index].storyPoint += resp.data.storyPoint
      }
    }
  }
  /**
   * delete sprint task
   */
  @action
  async deleteTask(_id, relateId) {
    const resp = await Service.deleteTask(`?_id=${_id}&relateId=${relateId}`)
    if (!resp.errno) {
      const sprintIndex = this.sprintList.findIndex(sprint => sprint._id === relateId)
      const taskIndex = this.sprintList[sprintIndex].task.findIndex(task => task._id === _id)
      if (sprintIndex > -1 && taskIndex > -1) {
        this.sprintList[sprintIndex].task.splice(taskIndex, 1)
        this.sprintList[sprintIndex].storyPoint -= this.sprintList[sprintIndex].task[taskIndex].storyPoint
      }
    }
  }
  /**
   * get sprint task
   */
  @action
  async getTask(_id) {
    const resp = await Service.getTaskBySprintId(_id)
    if (!resp.errno) {
      const index = this.sprintList.findIndex(sprint => sprint._id === _id)
      if (index > -1) {
        this.sprintList[index].task = setSequence(resp.data)
      }
    }

  }
}

export default new SprintStore()