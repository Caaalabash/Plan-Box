/**
 * 用户信息表
 *
 * name: Github NickName
 * email: Github Email
 * avatar_url: Github Avatar
 * team: {
 *   belong: Belong Team _id
 *   permission: guest / developer / master / owner
 * }
 * provider: Github for now
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const oauthSchema = new Schema({
    name: String,
    email: String,
    avatar_url: String,
    team: {
      belong: { type: String, default: '' },
      permission: { type: String, default: '' },
    },
    provider: { type: String, default: 'Github' }
  })

  return mongoose.model('Oauth', oauthSchema)
}
