import BaseModule from './default'
import { setSequence } from 'utils/tool'

export default new class apiManager extends BaseModule {
  // Sprint
  getSprint(query) {
    return this.get(`sprint${query}`)
  }
  setSprint(data) {
    return this.post('sprint', data)
  }
  updateSprint(data) {
    return this.put('sprint', data)
  }
  deleteSprint(query) {
    return this.delete(`sprint${query}`)
  }
  getSprintByFilter(query = '') {
    return this.get(`sprint/filter${query}`)
  }
  // Task
  getTaskBySprintId(sprintId) {
    return this.get(`task?id=${sprintId}`).then(res => setSequence(res.data))
  }
  setTask(data) {
    return this.post('task', data)
  }
  updateTask(data) {
    return this.put('task', data)
  }
  deleteTask(query) {
    return this.delete(`task${query}`)
  }
  updateSequence(data) {
    return this.post('task/sequence', data)
  }
  // Issue
  setIssue(data) {
    return this.post('issue', data)
  }
  setIssueStatus(data) {
    return this.put('issue/status', data)
  }
  // oauth
  getGithubInfo(data) {
    return this.post('oauth/github', data)
  }
  getUserInfo() {
    return this.get('oauth/userInfo')
  }
  logout() {
    return this.get('oauth/logout')
  }
  // 工单
  getWorkOrder({ isAdmin = false, _id }) {
    return this.get(`workorder?isAdmin=${isAdmin}&userId=${_id}`)
  }
  setWorkOrder(data) {
    return this.post('workorder', data)
  }
  updateWorkOrder(data) {
    return this.put('workorder', data)
  }
  deleteWorkOrder(userId, _id) {
    return this.delete(`workorder/${_id}?userId=${userId}`)
  }
}()
