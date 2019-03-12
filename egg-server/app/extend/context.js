module.exports = {
  sendRequest(url, option = {}) {
    let options = { dataType: 'json', ...option }
    return this.curl(url, options)
  },

  $get(url, query = null, headers = null) {
    let options = { timeout: [5000, 20000] }
    query && (options.data = query)
    headers && (options.headers = headers)
    return this.sendRequest(url, options)
  },

  $post(url, body = null, headers = null) {
    let options = { method: 'POST' }
    body && (options.data = body)
    headers && (options.headers = headers)
    return this.sendRequest(url, options)
  },

  $put(url, body = null, headers = null) {
    let options = { method: 'PUT' }
    body && (options.data = body)
    headers && (options.headers = headers)
    return this.sendRequest(url, options)
  },

  $delete(url, headers = null) {
    let options = { method: 'DELETE' }
    headers && (options.headers = headers)
    return this.sendRequest(url, options)
  },
}
