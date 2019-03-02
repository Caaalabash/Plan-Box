module.exports = app => {
  const { router, controller } = app

  router.post('/issue', controller.issue.setIssue)
  router.put('/issue', controller.issue.updateIssue)
  router.delete('/issue', controller.issue.deleteIssue)
}
