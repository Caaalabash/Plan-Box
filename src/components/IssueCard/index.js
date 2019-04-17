import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon } from 'antd'

import './index.scss'

@inject('userStore')
@observer
class IssueCard extends Component {

  render() {
    const { issue, column, belong, onDragStart, onDragEnd } = this.props
    const responsibleInfo = this.props.userStore.teamMember.find(member => member._id === issue.responsible)
    const issueProgress = '0%'

    return (
      <div
        className="issue"
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        data-column={column}
        data-belong={belong}
        data-id={issue._id}
        draggable
      >
        <div className="issue-inner-content">
          <span className="issue-title">{issue.title}</span>
          <span className="issue-desc">{issue.desc}</span>
          <span className="issue-owner">{ responsibleInfo ? responsibleInfo.name : '[该成员已不在团队内]' }</span>
          <span className="issue-progress">{issueProgress}</span>
        </div>
        {
          responsibleInfo
            ? <img src={responsibleInfo.avatar_url} alt="经办人" className="issue-avatar"/>
            : <Icon type="user-delete" title="该用户已不在当前团队" className="issue-avatar"/>
        }
        <span className="issue-total">{issue.time}</span>
      </div>
    )
  }

}

export default IssueCard
