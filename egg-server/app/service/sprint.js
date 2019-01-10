class SprintService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.SprintModel = ctx.model.Sprint
  }
  /**
   * 查找某个范围内的所有Sprint任务周期, 仅能根据status查询
   *
   */
  async getSprintByFilter({ status }) {
    let query = status !== 'all' ? { status } : {}
    const [_, doc] = await this.toPromise(this.SprintModel.find(query))
    if (!doc) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '未查询相应的Sprint',
      }
    }
    return {
      errno: this.config.successCode,
      data: doc,
      msg: '',
    }
  }
  /**
   * 查询某个Sprint任务周期, 根据_id查询
   *
   * @description 通过_id查找单个文档时, 使用findById而不是findOne({_id: id})
   * @description 因为findOne({_id: undefined})返回任意文档而findById(undefined)会被转换为findOne({_id: null})
   **/
  async getSprint({_id}) {
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
  /**
   * 创建新的Sprint任务周期, 需要检查一下title字段是否已经存在
   */
  async setSprint(data) {
    const [err, isExist] = await this.toPromise(this.SprintModel.findOne({title: data.title}))
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
   * 更新某个Sprint任务周期, 根据_id来更新
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
  }
  /**
   * 删除某个Sprint任务周期, 根据_id来删除
   *
   * @description findByIdAndRemove(id)相当于findOneAndRemove({_id: id})
   */
  async deleteSprint({_id}) {
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

module.exports = SprintService
