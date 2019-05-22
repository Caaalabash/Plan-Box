module.exports = app => {
  const { io } = app
  const { notify } = io.controller
  const nsp = io.of('/')

  nsp.route('TeamNotification', notify.distributeNotify)
  nsp.route('WorkOrderNotification', notify.distributeNotify)
}
