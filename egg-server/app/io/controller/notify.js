class NotifyController extends require('egg').Controller {
  async joinTeam() {
    const { ctx } = this
    const msg = ctx.args[0]
    console.log('joinTeam', msg)
  }
}

module.exports = NotifyController