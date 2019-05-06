import React from 'react'
import { inject, observer } from 'mobx-react'
import { Button, List, Avatar, message } from 'antd'

import emitter from 'utils/events'
import { createBacklogForm } from 'assets/config/form'
import suggestion from 'assets/images/idea.svg'
import lowPriority from 'assets/images/low_priority.svg'
import midPriority from 'assets/images/medium_priority.svg'
import highPriority from 'assets/images/high_priority.svg'
import './index.scss'


@inject('userStore')
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

  deleteBacklog = backlogId => {
    this.props.backlogStore.deleteBacklog(backlogId)
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
        <div className="backlog-layout-button">
          <Button type="default" icon="plus" onClick={this.createBacklog}>新任务</Button>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item actions={[
              // eslint-disable-next-line
              <a onClick={this.updateBacklog.bind(this, item)}>修改</a>,
              // eslint-disable-next-line
              <a onClick={this.deleteBacklog.bind(this, item._id)}>删除</a>
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

