class IssueController extends require('egg').Controller {
  async setIssue(ctx) {
    ctx.body = await ctx.service.issue.setIssue(ctx.request.body)
  }

  async updateIssue(ctx) {
    ctx.body = await ctx.service.issue.updateIssue(ctx.request.body)
  }

  async deleteIssue(ctx) {
    ctx.body = await ctx.service.issue.deleteIssue(ctx.query)
  }
}

module.exports = IssueController