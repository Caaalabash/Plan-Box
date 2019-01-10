module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const taskSchema = new Schema({
    relateSprint: String,
    title: String,
    desc: String,
    storyPoint: Number,
    priority: {
      type: Number,
      default: 0,
    },
    sequence: {
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
    issue: [{
      priority: Number,
      title: String,
      desc: String,
      storyPoint: Number,
      time: String,
      usedTime: String,
      issueType: String,
      status: String,
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
    }]
  })

  return mongoose.model('Task', taskSchema)
}
