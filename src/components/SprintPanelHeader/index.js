import React from 'react'
import { Icon, Menu, Dropdown } from 'antd'

import './index.scss'

export default function SprintPanelHeader(props) {
  const {onOperate, ...sprint} = props

  const menu = (
    <Menu onClick={onOperate.bind(this, sprint._id)}>
      <Menu.Item key="update">修改</Menu.Item>
      <Menu.Item key="delete">删除</Menu.Item>
      <Menu.Item key="add">增加任务</Menu.Item>
    </Menu>
  )
  return (
    <div className="sprint-meta">
      <div className="sprint-header">
        <div className="meta">
          <span className="sprint-title">{sprint.title}</span>
          <span className="sprint-subtitle">{sprint.task.length}个问题</span>
          <span className="sprint-status">活跃</span>
        </div>
        <div className="story-point">
          <span className="point unfinished" title={`未完成的StoryPoint：${sprint.storyPoint - sprint.finishedStoryPoint}`}>{sprint.storyPoint - sprint.finishedStoryPoint}</span>
          <span className="point finished" title={`已完成的StoryPoint：${sprint.finishedStoryPoint}`}>{sprint.finishedStoryPoint}</span>
          <span className="point total" title={`总计StoryPoint：${sprint.storyPoint}`}>{sprint.storyPoint}</span>
        </div>
        <Dropdown className="sprint-manage" overlay={menu}>
          <Icon type="ellipsis"/>
        </Dropdown>
      </div>
      <div className="sprint-range">
        {new Date(+sprint.startTime).toLocaleString('zh')}
        <span className="dot">•</span>
        {new Date(+sprint.endTime).toLocaleString('zh')}
      </div>
    </div>
  )
}
