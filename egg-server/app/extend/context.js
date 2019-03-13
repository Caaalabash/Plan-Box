module.exports = {
  sendRequest(url, option) {
    return this.curl(url, { dataType: 'json', contentType: 'json', ...option })
  },

  $get(url, query = null, headers = null) {
    const options = { timeout: [5000, 20000] }
    query && (options.data = query)
    headers && (options.headers = headers)

    return this.sendRequest(url, options)
  },

  $post(url, body = null, headers = null) {
    const options = { method: 'POST' }
    body && (options.data = body)
    headers && (options.headers = headers)

    return this.sendRequest(url, options)
  },

  $put(url, body = null, headers = null) {
    const options = { method: 'PUT' }
    body && (options.data = body)
    headers && (options.headers = headers)

    return this.sendRequest(url, options)
  },

  $delete(url, headers = null) {
    const options = { method: 'DELETE' }
    headers && (options.headers = headers)

    return this.sendRequest(url, options)
  },
}
