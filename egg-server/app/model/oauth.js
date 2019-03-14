module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const ObjectId = mongoose.Types.ObjectId

  const oauthSchema = new Schema({
    id: String,
    name: String,
    company: String,
    blog: String,
    location: String,
    email: String,
    bio: String,
    avatar_url: String,
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

  return mongoose.model('Oauth', oauthSchema)
}
