/**
 * 团队表
 *
 * name: 团队名称
 * owner: 团队所有者
 * master: 团队管理者
 * developer: 开发者
 * guest: 访客
 * createTime: 创建时间
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const teamSchema = new Schema({
    name: String,
    owner: [{ userId: String, name: String }],
    master: [{ userId: String, name: String }],
    developer: [{ userId: String, name: String }],
    guest: [{ userId: String, name: String }],
    createTime: { type: Date, default: Date.now },
  }, {
    timestamps: {
      createdAt: 'createTime',
    }
  })

  return mongoose.model('Team', teamSchema)
}
