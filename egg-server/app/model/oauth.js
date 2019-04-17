/**
 * 用户信息表
 *
 * id: Github ID
 * name: Github NickName
 * company: Github Company
 * blog: Github Blog
 * location: Github Location
 * email: Github Email
 * bio: Github Intro
 * avatar_url: Github Avatar
 * createTime: Github Account CreateTime
 * updateTime: Last Login TIme
 * team: {
 *   belong: Belong Team _id
 *   permission: guest / developer / master / owner
 * }
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const oauthSchema = new Schema({
    id: String,
    name: String,
    company: String,
    blog: String,
    location: String,
    email: String,
    bio: String,
    avatar_url: String,
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    team: {
      belong: { type: String, default: '' },
      permission: { type: String, default: '' },
    },
  }, {
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime'
    }
  })

  return mongoose.model('Oauth', oauthSchema)
}
