module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const ObjectId = mongoose.Types.ObjectId

  const sprintSchema = new Schema({
    title: String,
    desc: String,
    startTime: String,
    endTime: String,
    finishedStoryPoint: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
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
    task: [{
      _id: ObjectId,
      title: String,
      team: String,
      storyPoint: Number,
    }]
  }, { toJSON: { virtuals: true } })

  sprintSchema.virtual('storyPoint').get(function() {
    return this.task.reduce((acc ,task) => acc += task.storyPoint, 0)
  })

  return mongoose.model('Sprint', sprintSchema)
}
