module.exports = app => {
  const { router, controller } = app

  router.post('/oauth/github', controller.oauth.github)
}
