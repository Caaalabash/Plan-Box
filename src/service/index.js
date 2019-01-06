import BaseModule from './default'

export default class apiManager extends BaseModule {
  constructor() {
    super()
  }
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
}