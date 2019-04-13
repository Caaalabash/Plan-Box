import BaseModule from './default'

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
  getSprintByFilter(query = '?status=all') {
    return this.get(`sprint/filter${query}`)
  }
  // Task
  getTaskBySprintId(sprintId) {
    return this.get(`task?id=${sprintId}`)
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
  getWorkOrder({ isAdmin = false }) {
    return this.get(`workorder?isAdmin=${isAdmin}`)
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
  /**
   * Team 模块请求
   **/
  getTeam(teamId) {
    return this.get(`team/${teamId}`)
  }
  createTeam(payload) {
    return this.post('team', payload)
  }
  inviteUser(inviteUserId) {
    return this.post('team/member', { inviteUserId })
  }
  setPermission(enhanceUserId, permission) {
    return this.post('team/permission', { enhanceUserId, permission })
  }
  matchMember(name) {
    return this.post('team/autocomplete', { name })
  }
  removeMember(memberId) {
    return this.delete(`team/member/${memberId}`)
  }
  leaveTeam() {
    return this.post('team/leave')
  }
}()
