/**
 * 任务池表
 *
 * title: 任务名称
 * desc: 任务描述
 * priority: 任务优先级
 * teamId: 所属团队id
 * userId: 创建用户id
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const backlogSchema = new Schema({
    title: String,
    desc: String,
    priority: { type: Number, default: 0 },
    teamId: String,
    userId: String
  })

  return mongoose.model('Backlog', backlogSchema)
}
