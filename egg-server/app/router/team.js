module.exports = app => {
  const { router, controller } = app

  router.get('/team/:teamId', controller.team.getTeam)
  router.post('/team', controller.team.createTeam)
  router.post('/team/member', controller.team.inviteTeamMember)
  router.post('/team/permission', controller.team.setPermission)
  router.post('/team/autocomplete', controller.team.autoComplete)
}
