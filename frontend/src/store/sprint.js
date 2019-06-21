import { observable, action, computed } from 'mobx'

import Service from '../service'
import { setSequence } from 'utils/tool'
import { SEQUENCE_DEFAULT, SEQUENCE_DIFF } from 'utils/constant'

/**
 * Sprint 模块
 * 需要维护一个有三个嵌套层级的状态树
 * sprint
 *   |__task
 *          |_issue
 */
class SprintStore {
  /**
   * 全局维护一个sprintList
   * 在初始状态, 只获取sprint以及task(简略信息)
   * 展开折叠面板后, 获取task以及issue详细信息
   */
  @observable sprintList = []
  /**
   * Lane视图 Support
   * 1. chooseSprintId Lane视图中选中SprintId
   * 2. firstSprintId: 第一个SprintId
   * 3. 设定Lane视图中选中的SprintId 并获取子任务
   */
  @observable chooseSprintId = null

  @computed get firstSprintId() {
    return this.sprintList.length ? this.sprintList[0]._id : ''
  }

  @computed get currentSprint() {
    return this.sprintList.find(sprint => sprint._id === this.chooseSprintId) || {}
  }

  @computed get sprintListForSelect() {
    return this.sprintList.map(({ title, _id }) => ({
      label: title, value: _id
    }))
  }

  @action
  async setChooseSprintId(sprintId) {
    sprintId = sprintId || this.firstSprintId
    if (!sprintId) return
    this.chooseSprintId = sprintId
    await this.getTask(sprintId)
  }
  /**
   * 对于Sprint层级的操作
   * 1. setSprintList
   * 2. 新建Sprint
   * 3. 删除Sprint
   * 4. 更新Sprint
   * 5. 更新Sprint状态
   */
  @action
  async setSprintList(sprintList) {
    this.sprintList = sprintList
    this.setChooseSprintId(this.firstSprintId)
  }
  @action
  async addSprint(newSprint) {
    const resp = await Service.setSprint(newSprint)

    if (!resp.errno) {
      this.sprintList.push(resp.data)
    }
  }
  @action
  async deleteSprint(sprintId) {
    const resp = await Service.deleteSprint(sprintId)
    const sprintIndex = this.sprintList.findIndex(item => item._id === sprintId)

    if (!resp.errno && sprintIndex > -1) {
      this.sprintList.splice(sprintIndex, 1)
    }
  }
  @action
  async updateSprint(sprintId, payload) {
    const resp = await Service.updateSprint({ _id: sprintId, ...payload })
    const sprintIndex = this.sprintList.findIndex(item => item._id === sprintId)

    if (!resp.errno && sprintIndex > -1) {
      this.sprintList[sprintIndex] = resp.data
    }
  }
  @action
  async updateSprintStatus(sprintId, status) {
    const resp = await Service.updateSprint({ _id: sprintId, status })
    const sprintIndex = this.sprintList.findIndex(item => item._id === sprintId)

    if (!resp.errno && sprintIndex > -1) {
      this.sprintList[sprintIndex].status = +status
    }
  }
  /**
   * 对于Task层级的操作
   * 1. 创建Task
   * 2. 删除Task
   * 3. 获取Task
   */
  @action
  async addTask(relateSprint, payload) {
    const sprintIndex = this.sprintList.findIndex(item => item._id === relateSprint)
    const taskList = this.sprintList[sprintIndex].task || []
    const seq = taskList.length ? taskList[taskList.length - 1].sequence + SEQUENCE_DIFF : SEQUENCE_DEFAULT
    const resp = await Service.setTask({ relateSprint, ...payload, sequence: seq })

    if (!resp.errno) {
      this.sprintList[sprintIndex].task.push(resp.data)
      this.sprintList[sprintIndex].storyPoint += resp.data.storyPoint
    }
  }
  @action
  async deleteTask(relateSprint, taskId) {
    const resp = await Service.deleteTask(relateSprint, taskId)
    const sprintIndex = this.sprintList.findIndex(sprint => sprint._id === relateSprint)
    const taskIndex = this.sprintList[sprintIndex].task.findIndex(task => task._id === taskId)

    if (!resp.errno && sprintIndex > -1 && taskIndex > -1) {
      const deletedTask = this.sprintList[sprintIndex].task.splice(taskIndex, 1)[0]
      this.sprintList[sprintIndex].storyPoint -= deletedTask.storyPoint
    }
  }
  @action
  async getTask(sprintId) {
    const resp = await Service.getTaskBySprintId(sprintId)
    const sprintIndex = this.sprintList.findIndex(sprint => sprint._id === sprintId)

    if (!resp.errno && sprintIndex > -1) {
      this.sprintList[sprintIndex].task = setSequence(resp.data)
    }
  }
  /**
   * 对于Issue层级的操作, 使用currentSprint
   * 1. 创建Issue, promise返回整个Task结构
   * 2. 删除Issue
   * 3. Issue拖拽
   * 4. Issue工作日志
   */
  @action
  async createIssue(taskId, payload) {
    const resp = await Service.setIssue({ taskId, ...payload })
    const taskIndex = this.currentSprint.task.findIndex(task => task._id === taskId)

    if (!resp.errno) {
      this.currentSprint.task[taskIndex] = resp.data
    }
  }
  @action
  async deleteIssue({ taskId, issueId }) {
    const resp = await Service.deleteIssue({ taskId, issueId })
    const task = this.currentSprint.task.find(task => task._id === taskId)
    const issueIndex = task.issue.findIndex(issue => issue._id === issueId)

    if (!resp.errno ) {
      task.issue.splice(issueIndex, 1)
    }
  }
  @action
  setIssueStatus(payload) {
    Service.setIssueStatus({ taskId: payload.taskId, issueId: payload.issueId, status: payload.status })
  }
  @action
  async setIssueLog(payload) {
    const resp = await Service.setIssueLog(payload)
    const task = this.currentSprint.task.find(task => task._id === payload.taskId)
    const issue = task.issue.find(issue => issue._id === payload.issueId)

    if (!resp.errno && issue) {
      issue.log = payload.log
      issue.usedTime += payload.time
      issue.remainTime = payload.remainTime
    }
  }

}

export default new SprintStore()