/**
 * 用户信息表
 *
 * id: 授权方唯一索引
 * name: 昵称
 * email: 邮箱
 * avatar_url: 头像地址
 * provider: 授权方
 * team:
 *   belong: 所属团队
 *   permission: 身份 guest/developer/master/owner
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const oauthSchema = new Schema({
    id: String,
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
