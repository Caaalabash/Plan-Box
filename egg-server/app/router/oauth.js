module.exports = app => {
  const { router, controller } = app

  const github = app.passport.authenticate('github', {
    successRedirect: '/api/plan-box/oauth/github/userInfo'
  })
  router.get('/oauth/github', github)
  router.get('/oauth/github/callback', github)
  router.get('/oauth/github/userInfo', controller.oauth.github)
  router.get('/oauth/userInfo', controller.oauth.userInfo)
  router.get('/oauth/logout', controller.oauth.logout)
}
