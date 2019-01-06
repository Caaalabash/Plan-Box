class SprintService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.SprintModel = ctx.model.Sprint
  }
  /**
   * 查询某个Sprint任务周期, 根据_id/id查询
   *
   * @description 通过_id查找单个文档时, 使用findById而不是findOne({_id: id})
   * @description 因为findOne({_id: undefined})返回任意文档而findById(undefined)会被转换为findOne({_id: null})
   * @description 根据这个特点, 将_id查选放在else中, 防止_id/id都没有的情况
   **/
  async getSprint({_id, id}) {
    if(id) {
      const [_, doc] = await this.toPromise(this.SprintModel.findOne({id}))
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
      const [_, doc] = await this.toPromise(this.SprintModel.findById(_id))
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
   * 创建新的Sprint任务周期
   */
  async setSprint(data) {
    const [err, isExist] = await this.toPromise(this.SprintModel.findOne({id: data.id}))
    if (!isExist && !err) {
      const [_, doc] = await this.toPromise(this.SprintModel.create(data))
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
        msg: '当前Sprint已存在'
      }
    }
  }
  /**
   * 更新某个Sprint任务周期, 根据_id/id来更新
   *
   * @description findByIdAndUpdate(id)相当于findOneAndUpdate({_id: id})
   * @description 默认情况下返回原始文档, 如果文档不存在也不会创建它
   */
  async updateSprint(data) {
    const options = {
      'new': true,
      upsert: true,
    }
    const {_id, ...update} = data
    if(_id) {
      const [e, doc] = await this.toPromise(this.SprintModel.findByIdAndUpdate(_id, update, options))
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
      const [_, doc] = await this.toPromise(this.SprintModel.findOneAndUpdate({id: data.id}, data, options))
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
   * 删除某个Sprint任务周期, 根据_id/id来删除
   *
   * @description findByIdAndRemove(id)相当于findOneAndRemove({_id: id})
   */
  async deleteSprint({_id, id}) {
    if(id) {
      const [_, doc] = await this.toPromise(this.SprintModel.findOneAndRemove({id}))
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
      const [_, doc] = await this.toPromise(this.SprintModel.findByIdAndRemove(_id))
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

module.exports = SprintService