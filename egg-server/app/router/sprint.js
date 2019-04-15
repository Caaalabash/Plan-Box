module.exports = app => {
  const { router, controller } = app

  router.get('/sprint', controller.sprint.getSprint)
  router.post('/sprint', controller.sprint.setSprint)
  router.delete('/sprint', controller.sprint.deleteSprint)
  router.put('/sprint', controller.sprint.updateSprint)
}
