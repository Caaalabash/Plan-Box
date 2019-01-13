class TaskService extends require('egg').Service {
  constructor(ctx) {
    super(ctx)
    this.toPromise =  ctx.helper.to
    this.TaskModel = ctx.model.Task
    this.SprintModel = ctx.model.Sprint
  }
  /**
   * 查询某个Task相关信息, 根据_id查询
   */
  async getTask({_id}) {
    const findResult = await this.toPromise(this.TaskModel.findById(_id))
    if(!findResult[1]) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '查询失败'
      }
    }
    return {
      errno: this.config.successCode,
      data: findResult[1],
      msg: '查询成功'
    }
  }
  /**
   * 创建新的Task, 创建前检查是否存在相同title
   *
   * @description 1. 检查是否存在重复子任务 2. 检查所属周期是否存在 3. 创建Task文档 4. 更新Sprint文档
   */
  async setTask({relateId, ...data}) {
    const [, isExist] = await this.toPromise(this.TaskModel.findOne({title: data.title}))
    if (isExist) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '当前Task已存在'
      }
    }
    const [, sprintDoc] = await this.toPromise(this.SprintModel.findById(relateId))
    if (!sprintDoc) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '所属Sprint已不存在'
      }
    }
    const [, taskDoc] = await this.toPromise(this.TaskModel.create(data))
    if (!taskDoc) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '创建失败'
      }
    }
    const [updateErr, ] = await this.toPromise(this.SprintModel.update({_id: relateId}, {
      $push: {
        task: {
          _id: taskDoc._id,
          title: data.title,
          storyPoint: data.storyPoint,
          team: data.team.rd,
        },
      }
    }))
    if (!updateErr) {
      return {
        errno: this.config.successCode,
        data: taskDoc,
        msg: '创建成功'
      }
    }
  }
  /**
   * 更新某个Task, 根据_id来更新
   */
  async updateTask(data) {
    const options = {
      'new': true,
      'upsert': true,
    }
    const shouldUpdateSprint = data.title || (data.team && data.team.rd) || data.storyPoint
    const {_id, ...update} = data
    const [, doc] = await this.toPromise(this.TaskModel.findByIdAndUpdate(_id, update, options))
    if(shouldUpdateSprint) {
      this.toPromise(this.SprintModel.updateOne({_id: data.relateId, "task._id": data._id}, {
        $set: {
          "task.$": {
            _id: _id,
            title: doc.title,
            storyPoint: doc.storyPoint,
            team: doc.team.rd
          }
        }
      }))
    }
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
   * @description 删除Task文档的同时, 删除Sprint对应周期中的Task
   */
  async deleteTask({_id, relateId}) {
    const deleteTaskPromise = this.toPromise(this.TaskModel.findOneAndDelete({_id}))
    const deleteSprintPromise = this.toPromise(this.SprintModel.updateOne({_id: relateId}, {
      $pull: {
        task: {
          _id
        }
      }
    }))
    const [taskResult, sprintResult] = await Promise.all([deleteTaskPromise, deleteSprintPromise])
    if(taskResult[0] || sprintResult[0]) {
      return {
        errno: this.config.errorCode,
        data: {},
        msg: '删除失败'
      }
    }
    return {
      errno: this.config.successCode,
      data: {},
      msg: '删除成功'
    }
  }
}

module.exports = TaskService
