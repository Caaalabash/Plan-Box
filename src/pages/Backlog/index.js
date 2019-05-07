import React from 'react'
import { inject, observer } from 'mobx-react'
import { Button, List, Avatar, message, Popconfirm } from 'antd'

import emitter from 'utils/events'
import { createBacklogForm, completeTaskForm } from 'assets/config/backlog'
import suggestion from 'assets/images/idea.svg'
import lowPriority from 'assets/images/low_priority.svg'
import midPriority from 'assets/images/medium_priority.svg'
import highPriority from 'assets/images/high_priority.svg'
import './index.scss'

@inject('userStore')
@inject('sprintStore')
@inject('backlogStore')
@observer
class Backlog extends React.Component {

  priorityList = [suggestion, lowPriority, midPriority, highPriority]

  componentDidMount() {

  }

  createBacklog = () => {
    const teamId = this.props.userStore.team && this.props.userStore.team._id
    if (!teamId) {
      message.info('请先创建或加入一个团队')
      return
    }
    emitter.emit('invokeLiteForm', {
      formTitle: '创建子任务',
      formContent: createBacklogForm(),
      onOk: async (params, done) => {
        await this.props.backlogStore.createBacklog({ ...params, teamId })
        done()
      }
    })
  }

  updateBacklog = backlog => {
    emitter.emit('invokeLiteForm', {
      formTitle: '更新子任务',
      formContent: createBacklogForm(backlog),
      onOk: async (params, done) => {
        await this.props.backlogStore.updateBacklog(backlog._id, params)
        done()
      }
    })
  }

  moveIntoSprint = ({ _id, title, desc, priority }) => {
    const responsibleList = this.props.userStore.responsibleList
    const sprintList = this.props.sprintStore.sprintListForSelect
    const baseInfo = { title, desc, priority }

    emitter.emit('invokeLiteForm', {
      formTitle: '补全子任务',
      formContent: completeTaskForm(responsibleList, sprintList),
      onOk: async ({ relateSprint, ...payload }, done) => {
        await Promise.all([
          this.props.backlogStore.deleteBacklog(_id),
          this.props.sprintStore.addTask(relateSprint, { ...payload, ...baseInfo })
        ])
        done()
      }
    })
  }

  deleteBacklog = backlogId => {
    this.props.backlogStore.deleteBacklog(backlogId)
  }

  render() {
    const { backlog }= this.props.backlogStore
    const { team } = this.props.userStore

    const list = backlog.map(item => {
      item.priorityAsset = this.priorityList[item.priority]
      if (team) {
        item.userInfo = team.memberInfo.find(member => member._id === item.userId)
      }
      return item
    })

    return (
      <div className='backlog-layout'>
        <div className="backlog-layout-operate">
          <Button type="default" icon="plus" onClick={this.createBacklog}>新任务</Button>
        </div>
        <List
          className="backlog-layout-list"
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item actions={[
              <span className="list-item" onClick={this.updateBacklog.bind(this, item)}>修改</span>,
              <Popconfirm title="确定要删除这个子任务吗?" onConfirm={this.deleteBacklog.bind(this, item._id)} okText="确认" cancelText="取消">
                <span className="list-item">删除</span>
              </Popconfirm>,
              <span className="list-item" onClick={this.moveIntoSprint.bind(this, item)}>添加进子任务</span>
            ]}>
              <List.Item.Meta
                avatar={<Avatar src={item.priorityAsset} />}
                title={item.title}
                description={item.desc}
              />
              <img className="backlog-layout-avatar" src={item.userInfo.avatar_url} alt="用户头像"/>
            </List.Item>
          )}
        />
      </div>
    )
  }
}

export default Backlog

