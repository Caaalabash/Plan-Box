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
}()
