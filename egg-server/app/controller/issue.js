class IssueController extends require('egg').Controller {
  async setIssue(ctx) {
    ctx.body = await ctx.service.issue.setIssue(ctx.request.body)
  }

  async updateIssueStatus(ctx) {
    ctx.body = await ctx.service.issue.updateIssueStatus(ctx.request.body)
  }

  async deleteIssue(ctx) {
    ctx.body = await ctx.service.issue.deleteIssue(ctx.query)
  }
}

module.exports = IssueController