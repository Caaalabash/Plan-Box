/**
 * 用户信息表
 *
 * name: Github NickName
 * email: Github Email
 * avatar_url: Github Avatar
 * provider: Github for now
 * team:
 *   belong: Belong Team _id
 *   permission: guest / developer / master / owner
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const oauthSchema = new Schema({
    name: String,
    email: String,
    avatar_url: String,
    provider: { type: String, default: 'Github' },
    team: {
      belong: { type: String, default: '' },
      permission: { type: String, default: '' },
    },
  })

  return mongoose.model('Oauth', oauthSchema)
}
