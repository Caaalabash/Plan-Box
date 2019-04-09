module.exports = app => {
  const { router, controller } = app

  router.get('/team', controller.team.getTeam)
  router.post('/team', controller.team.createTeam)
}
