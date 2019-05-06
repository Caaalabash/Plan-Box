module.exports = app => {
  const { router, controller } = app

  router.get('/backlogs', controller.backlog.getBacklogs)
  router.post('/backlog', controller.backlog.createBacklog)
  router.delete('/backlog/:backlogId', controller.backlog.deleteBacklog)
  router.put('/backlog', controller.backlog.updateBacklog)
}
