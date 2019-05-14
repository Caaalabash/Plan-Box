module.exports = app => {
  return async (ctx, next) => {
    console.log('ws')
    await next()
  }
}