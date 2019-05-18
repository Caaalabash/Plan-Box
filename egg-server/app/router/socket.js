module.exports = app => {
  const { io } = app
  const { notify } = io.controller
  const nsp = io.of('/')

  nsp.route('setTeam', notify.joinTeam)
  nsp.route('inviteUser', notify.inviteUser)
  nsp.route('setPermission', notify.setPermission)
}
