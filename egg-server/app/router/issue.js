module.exports = app => {
  const { router, controller } = app

  router.post('/issue', controller.issue.setIssue)
  router.delete('/issue', controller.issue.deleteIssue)
  router.put('/issue/status', controller.issue.updateIssueStatus)
}
