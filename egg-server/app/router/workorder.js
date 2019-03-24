module.exports = app => {
  const { router, controller } = app

  router.get('/workorder', controller.workorder.getWorkorder)
  router.post('/workorder', controller.workorder.setWorkorder)
  router.delete('/workorder/:id', controller.workorder.deleteWorkorder)
  router.put('/workorder', controller.workorder.updateWorkorder)
}
