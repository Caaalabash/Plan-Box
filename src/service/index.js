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
  getSprintByFilter(query = '') {
    return this.get(`sprint/filter${query}`)
  }
}()
