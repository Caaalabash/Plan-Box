module.exports = app => {
  const { router, controller } = app

  router.post('/oauth/github', controller.oauth.github)
  router.get('/oauth/userInfo', controller.oauth.userInfo)
  router.get('/oauth/logout', controller.oauth.logout)
}
