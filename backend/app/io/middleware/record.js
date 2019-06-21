module.exports = app => {
  app.socketMap = new Map()

  return async ({ socket, query }, next) => {
    const userId = query._id
    userId && app.socketMap.set(userId, socket)
    await next()
    userId && app.socketMap.delete(userId)
  }
}