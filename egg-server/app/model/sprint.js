/**
 * Sprint排期表
 *
 * title: 开发周期主要任务
 * desc: 开发周期描述
 * startTime: 开发周期开始时间(时间戳)
 * endTime: 开发周期截止时间(时间戳)
 * finishedStoryPoint: 开发周期结束后完成的故事点
 * status: 开发周期状态 0 / 1 / 2  === 未开始 / 进行中 / 已完成
 * team: {
 *   pm: 负责产品
 *   rd: 负责开发
 *   qa: 负责测试
 * }
 * task: {
 *   title: 子任务名称
 *   team: 子任务负责人
 *   storyPoint: 子任务故事点
 * }
 * storyPoint(virtual): 总故事点
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const ObjectId = mongoose.Types.ObjectId

  const sprintSchema = new Schema({
    title: String,
    desc: String,
    startTime: String,
    endTime: String,
    finishedStoryPoint: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    team: {
      pm: { type: String, default: '' },
      rd: { type: String, default: '' },
      qa: { type: String, default: '' },
    },
    task: [{
      _id: ObjectId,
      title: String,
      team: String,
      storyPoint: Number,
    }]
  }, { toJSON: { virtuals: true } })

  sprintSchema.virtual('storyPoint').get(function() {
    return this.task.reduce((acc, task) => acc += task.storyPoint, 0)
  })

  return mongoose.model('Sprint', sprintSchema)
}
