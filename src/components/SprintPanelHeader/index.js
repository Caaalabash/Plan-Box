import React from 'react'
import { Icon, Menu, Dropdown } from 'antd'

import './index.scss'

const UNBEGIN = 0
const ACTIVE = 1
const FINISHED = 2

export default function SprintPanelHeader(props) {
  const { onOperate, ...sprint } = props
  const statusLabel = sprint.status === UNBEGIN
    ? '未开始'
    : sprint.status === ACTIVE ? '活跃' : '关闭'
  const handleClick = e => {
    e.domEvent && e.domEvent.stopPropagation()
    onOperate(e.key)
  }

  const menu = (
    <Menu onClick={ handleClick }>
      <Menu.Item key="update">修改</Menu.Item>
      <Menu.Item key="delete">删除</Menu.Item>
      { sprint.status !== FINISHED && <Menu.Item key="add">增加任务</Menu.Item> }
      { sprint.status === UNBEGIN && <Menu.Item key="begin">开始Sprint</Menu.Item> }
      { sprint.status === ACTIVE && <Menu.Item key="close">关闭Sprint</Menu.Item> }
    </Menu>
  )

  return (
    <div className="sprint-meta">
      <div className="sprint-header">
        <div className="meta">
          <span className="sprint-title">{ sprint.title }</span>
          <span className="sprint-subtitle">{ sprint.task.length }个问题</span>
          <span className="sprint-status">{ statusLabel }</span>
        </div>
        <div className="story-point">
          <span className="point unfinished" title={`未完成的StoryPoint：${sprint.storyPoint - sprint.finishedStoryPoint}`}>{ sprint.storyPoint - sprint.finishedStoryPoint }</span>
          <span className="point finished" title={`已完成的StoryPoint：${sprint.finishedStoryPoint}`}>{ sprint.finishedStoryPoint }</span>
          <span className="point total" title={`总计StoryPoint：${sprint.storyPoint}`}>{ sprint.storyPoint }</span>
        </div>
        <Dropdown className="sprint-manage" overlay={menu}>
          <Icon type="ellipsis"/>
        </Dropdown>
      </div>
      <div className="sprint-range">
        { new Date(+sprint.startTime).toLocaleString('zh') }
        <span className="dot">•</span>
        { new Date(+sprint.endTime).toLocaleString('zh') }
      </div>
    </div>
  )
}
