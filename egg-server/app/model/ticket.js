module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ticketSchema = new Schema({
    userId: String,
    title: String,
    content: String,
    type: String,
    feedback: String,
    status: {
      type: Number,
      default: 0
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    updateTime: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime'
    }
  })

  return mongoose.model('Ticket', ticketSchema)
}
