/**
 * 团队表
 *
 * name: 团队名称
 * owner: 团队所有者
 * member: 团队成员
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
  })

  return mongoose.model('Team', teamSchema)
}
