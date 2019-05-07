/**
 * 子任务表
 *
 * relateSprint: 所属任务周期
 * title: 子任务标题
 * desc: 子任务描述
 * storyPoint: 子任务故事点
 * priority: 子任务优先级
 * sequence: 子任务排序
 * status: 子任务状态
 * responsible: Task经办人,
 * issue:
 *   priority: issue优先级
 *   title: issue名称
 *   desc: issue描述
 *   time: 预估时间 (小时)
 *   usedTime: 耗费时间(小时)
 *   remainTime: 剩余时间(小时)
 *   issueType: Issue类型 issue or bug
 *   status: issue状态
 *   responsible: issue经办人
 *   log: Issue工作日志
 *
 * Task & Issue status:
 * 0: 待开发  1: 开发中  2: 待测试  3: 测试中  4: 已完成
 *
 * Task & Issue priority:
 * 0: 建议  1: 重要  2: 紧急  3: 致命
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const taskSchema = new Schema({
    relateSprint: String,
    title: String,
    desc: String,
    storyPoint: Number,
    priority: { type: Number, default: 0 },
    sequence: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    responsible: String,
    issue: [{
      priority: Number,
      title: String,
      desc: String,
      time: { type: Number, default: 0 },
      usedTime: { type: Number, default: 0 },
      remainTime: { type: Number, default: 0 },
      issueType: { type: String, default: 'issue' },
      status: String,
      responsible: String,
      log: String
    }]
  })

  return mongoose.model('Task', taskSchema)
}
