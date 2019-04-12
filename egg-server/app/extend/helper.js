module.exports = {
  /**
   * 将 mongodb 操作 promise 化
   * 对于数据库异常直接抛出错误交由 onerror 插件处理
   */
  to: promise => promise.then(data => data).catch(() => {
    throw new Error('DB_ERROR')
  }),
  /**
   * permission-map
   * @param {string}
   */
  permissionMap: {
    'guest': [],
    'developer': ['guest'],
    'master': ['guest', 'developer'],
    'owner': ['guest', 'developer', 'master']
  }
}
