module.exports = app => {
  const { router, controller } = app

  router.get('/task', controller.sprint.getTask)
  router.post('/task', controller.sprint.setTask)
  router.delete('/task', controller.sprint.deleteTask)
  router.put('/task', controller.sprint.updateTask)
}
