module.exports = app => {
  const { router, controller } = app

  router.get('/workorder', controller.workorder.getWorkOrder)
  router.post('/workorder', controller.workorder.setWorkOrder)
  router.delete('/workorder/:ticketId', controller.workorder.deleteWorkOrder)
  router.put('/workorder', controller.workorder.updateWorkOrder)
}
