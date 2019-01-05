module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const taskSchema = new Schema({
    relateSprint: String,
    priority: Number,
    sequence: Number,
    id: String,
    title: String,
    desc: String,
    storyPoint: Number,
    team: {
      pm: String,
      rd: String,
      qa: String,
    },
    issue: [{
      priority: Number,
      id: String,
      title: String,
      desc: String,
      storyPoint: Number,
      time: String,
      usedTime: String,
      issueType: String,
      status: String,
      team: {
        pm: String,
        rd: String,
        qa: String,
      },
    }]
  })

  return mongoose.model('Task', taskSchema)
}