module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const sprintSchema = new Schema({
    id: String,
    title: String,
    desc: String,
    startTime: String,
    endTime: String,
    storyPoint: Number,
    finishedStoryPoint: Number,
    status: String,
    team: {
      pm: String,
      rd: String,
      qa: String,
    },
    task: [{
      id: String,
      title: String,
    }]
  })

  return mongoose.model('Sprint', sprintSchema)
}
