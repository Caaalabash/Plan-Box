class TaskService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TaskModel = ctx.model.Task
  }
  /**
   * 查询某个Task相关信息, 根据_id/id查询
   */
  async getTask({_id, id}) {
    if(id) {
      const [_, doc] = await this.toPromise(this.TaskModel.findOne({id}))
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
    } else {
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
  }
  /**
   * 创建新的Task
   *
   * @todo 创建新的task同时在对应sprint task中添加部分内容
   */
  async setTask(data) {
    const [err, isExist] = await this.toPromise(this.TaskModel.findOne({id: data.id}))
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
   * 更新某个Task, 根据_id/id来更新, 处于sprint task中的字段应该禁止更新
   */
  async updateTask(data) {
    const options = {
      'new': true,
      upsert: true,
    }
    const {_id, ...update} = data
    if(_id) {
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
    } else {
      const [_, doc] = await this.toPromise(this.TaskModel.findOneAndUpdate({id: data.id}, data, options))
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
  }
  /**
   * 删除某个Task, 根据_id/id来删除
   *
   * @todo 删除Task需要删除对应Sprint中的task
   */
  async deleteSprint({_id, id}) {
    if(id) {
      const [_, doc] = await this.toPromise(this.TaskModel.findOneAndRemove({id}))
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
    } else {
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
}

module.exports = TaskService
