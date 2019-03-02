module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const taskSchema = new Schema({
    // 所属周期
    relateSprint: String,
    // 主题
    title: String,
    // 描述
    desc: String,
    // 故事点
    storyPoint: Number,
    // 紧急程度
    priority: {
      type: Number,
      default: 0,
    },
    // 排序
    sequence: {
      type: Number,
      default: 0,
    },
    // 任务状态
    status: {
      type: Number,
      default: 0,
    },
    // 任务负责人
    team: {
      pm: {
        type: String,
        default: '',
      },
      rd: {
        type: String,
        default: ''
      },
      qa:  {
        type: String,
        default: ''
      },
    },
    // 相关子任务
    issue: [{
      priority: Number,
      title: String,
      desc: String,
      time: String,
      usedTime: String,
      issueType: String,
      status: String,
      responsible: String,
    }]
  })

  return mongoose.model('Task', taskSchema)
}
