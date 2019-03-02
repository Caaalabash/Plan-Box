import React, { Component } from 'react'

import testAvatar from 'assets/images/avatar.jpeg'
import './index.scss'

export default class TaskCard extends Component {

  render() {
    const { issue, column, belong, onDragStart, onDragEnd } = this.props
    const issueProgress = '0%'

    return (
      <div className="issue" onDragStart={onDragStart} onDragEnd={onDragEnd} data-column={column} data-belong={belong} draggable>
        <div className="issue-inner-content">
          <span className="issue-title">{issue.title}</span>
          <span className="issue-desc">{issue.desc}</span>
          <span className="issue-owner">{issue.responsible}</span>
          <span className="issue-progress">{issueProgress}</span>
        </div>
        <img src={testAvatar} alt="经办人" className="issue-avatar"/>
        <span className="issue-total">{issue.time}</span>
      </div>
    )
  }

}
