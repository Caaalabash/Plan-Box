/**
 * 工单表
 *
 * userId: 提交用户
 * title: 问题概括
 * content: 问题详情
 * type: 问题分类: bug / feature / suggestion
 * status: 问题状态 0: 待处理  1: 处理中  2: 已关闭
 * feedback: 管理员反馈
 * createTime: 创建日期
 * updateTime: 更新日期
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ticketSchema = new Schema({
    userId: String,
    title: String,
    content: String,
    type: String,
    feedback: String,
    status: { type: Number, default: 0 },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now }
  }, {
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime'
    }
  })

  return mongoose.model('Ticket', ticketSchema)
}
