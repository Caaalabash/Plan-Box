module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const sprintSchema = new Schema({
    id: String,
    title: String,
    desc: String,
    startTime: String,
    endTime: String,
    storyPoint: {
      type: Number,
      default: 0,
    },
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
      id: String,
      title: String,
    }]
  })

  return mongoose.model('Sprint', sprintSchema)
}
