module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const commonSchema = new Schema({

  })

  return mongoose.model('Common', commonSchema)
}