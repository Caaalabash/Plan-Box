import React, { Component } from 'react'

import testAvatar from 'assets/images/avatar.jpeg'
import './index.scss'

export default class TaskCard extends Component {

  render() {
    const { issue } = this.props
    const issueProgress = '0%'

    return (
      <div className="task" draggable>
        <div className="task-inner-content">
          <span className="task-title">{issue.title}</span>
          <span className="task-desc">{issue.desc}</span>
          <span className="task-owner">{issue.responsible}</span>
          <span className="task-progress">{issueProgress}</span>
        </div>
        <img src={testAvatar} alt="经办人" className="task-avatar"/>
        <span className="task-total">{issue.time}</span>
      </div>
    )
  }

}
