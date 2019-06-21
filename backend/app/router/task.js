module.exports = app => {
  const { router, controller } = app

  router.get('/task', controller.task.getTask)
  router.post('/task', controller.task.setTask)
  router.delete('/task', controller.task.deleteTask)
  router.put('/task', controller.task.updateTask)
  router.post('/task/sequence', controller.task.updateSequence)
}
