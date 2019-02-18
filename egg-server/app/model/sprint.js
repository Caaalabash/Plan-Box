module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const ObjectId = mongoose.Types.ObjectId

  const sprintSchema = new Schema({
    // 主题
    title: String,
    // 描述
    desc: String,
    // 开始时间
    startTime: String,
    // 截止时间
    endTime: String,
    // 已完成故事点
    finishedStoryPoint: {
      type: Number,
      default: 0,
    },
    // 任务周期状态
    status: {
      type: Number,
      default: 0,
    },
    // 团队负责人情况
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
    // 周期子任务
    task: [{
      _id: ObjectId,
      title: String,
      team: String,
      storyPoint: Number,
    }]
  }, { toJSON: { virtuals: true } })

  // 当前周期总故事点
  sprintSchema.virtual('storyPoint').get(function() {
    return this.task.reduce((acc ,task) => acc += task.storyPoint, 0)
  })

  return mongoose.model('Sprint', sprintSchema)
}
