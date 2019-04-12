/**
 * 团队表
 *
 * name: 团队名称
 * owner: 团队所有者
 * member: 团队成员
 * createTime: 创建时间
 */
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const teamSchema = new Schema({
    name: String,
    owner: String,
    member: {
      type: Array,
      default: []
    },
    createTime: { type: Date, default: Date.now },
  }, {
    timestamps: {
      createdAt: 'createTime',
    }
  })

  return mongoose.model('Team', teamSchema)
}
