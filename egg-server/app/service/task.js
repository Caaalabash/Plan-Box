class TaskService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TaskModel = ctx.model.Task
  }
  /**
   * 查询某个Task相关信息, 根据_id查询
   */
  async getTask({_id}) {
    const [_, doc] = await this.toPromise(this.TaskModel.findById(_id))
    if(!doc) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '查询失败'
      }
    }
    return {
      errno: this.config.successCode,
      data: doc,
      msg: '查询成功'
    }
  }
  /**
   * 创建新的Task, 创建前检查是否存在相同title
   *
   * @todo 创建新的task同时在对应sprint task中添加部分内容
   */
  async setTask(data) {
    const [err, isExist] = await this.toPromise(this.TaskModel.findOne({title: data.title}))
    if (!isExist && !err) {
      const [_, doc] = await this.toPromise(this.TaskModel.create(data))
      if (doc) {
        return {
          errno: this.config.successCode,
          data: doc,
          msg: '创建成功'
        }
      }
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '创建失败'
      }
    } else {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '当前Task已存在'
      }
    }
  }
  /**
   * 更新某个Task, 根据_id来更新
   */
  async updateTask(data) {
    const options = {
      'new': true,
      upsert: true,
    }
    const {_id, ...update} = data
    const [e, doc] = await this.toPromise(this.TaskModel.findByIdAndUpdate(_id, update, options))
    if(!doc) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '更新失败'
      }
    }
    return {
      errno: this.config.successCode,
      data: doc,
      msg: '更新成功'
    }
  }
  /**
   * 删除某个Task, 根据_id来删除
   *
   * @todo 删除Task需要删除对应Sprint中的task
   */
  async deleteSprint({_id}) {
    const [_, doc] = await this.toPromise(this.TaskModel.findByIdAndRemove(_id))
    if(!doc) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '删除失败'
      }
    }
    return {
      errno: this.config.successCode,
      data: doc,
      msg: '删除成功'
    }
  }
}

module.exports = TaskService
