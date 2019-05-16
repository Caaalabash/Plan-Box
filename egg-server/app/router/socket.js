module.exports = app => {
  const { io } = app
  const { notify } = io.controller
  const nsp = io.of('/')

  nsp.route('joinTeam', notify.joinTeam)
  nsp.route('inviteUser', notify.inviteUser)
}
