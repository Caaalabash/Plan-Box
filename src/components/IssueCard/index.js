import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon } from 'antd'

import emitter from 'utils/events'
import './index.scss'

@inject('userStore')
@observer
class IssueCard extends Component {

  openContextMenu = (e, issue, taskId) => {
    e.preventDefault()

    e.customMenu = [
      {
        title: '登记工作日志',
        handler: () => emitter.emit('issueLog', { issue, taskId })
      },
      {
        title: '删除Issue',
        handler: () => emitter.emit('deleteIssue', { issueId: issue._id, taskId })
      }
    ]
    emitter.emit('contextmenu', e)
  }

  render() {
    const { issue, column, belong, onDragStart, onDragEnd } = this.props
    const responsibleInfo = this.props.userStore.teamMember.find(member => member._id === issue.responsible)
    const issueProgress = Math.round(issue.usedTime / issue.time * 100) + '%'
    const remain = issue.time - issue.usedTime

    return (
      <div
        className="issue"
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        data-column={column}
        data-belong={belong}
        data-id={issue._id}
        draggable
        onContextMenu={ e => this.openContextMenu.call(this, e, issue, belong)}
      >
        <div className="issue-inner-content">
          <span className="issue-title">{ issue.title }</span>
          <span className="issue-desc">{ issue.desc }</span>
          <span className="issue-owner">{ responsibleInfo ? responsibleInfo.name : '[该成员已不在团队内]' }</span>
          <span className="issue-progress">{ issueProgress }</span>
        </div>
        {
          responsibleInfo
            ? <img src={responsibleInfo.avatar_url} alt="经办人" className="issue-avatar"/>
            : <Icon type="user-delete" title="该用户已不在当前团队" className="issue-avatar"/>
        }
        <span className="issue-total">{ remain }h</span>
      </div>
    )
  }

}

export default IssueCard
