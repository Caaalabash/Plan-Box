import React, { Component } from 'react'

import './index.scss'
import testAvatar from 'assets/mock/avatar.jpeg'

export default class TaskCard extends Component {

  render() {
    const { taskTitle, taskDesc, taskOwner, taskTotalTime, taskUseTime } = this.props
    const taskProgress = (taskUseTime / taskTotalTime * 100).toFixed(1) + '%'

    return (
      <div className="task" draggable>
        <div className="task-inner-content">
          <span className="task-title">{taskTitle}</span>
          <span className="task-desc">{taskDesc}</span>
          <span className="task-owner">{taskOwner}</span>
          <span className="task-progress">{taskProgress}</span>
        </div>
        <img src={testAvatar} alt="经办人" className="task-avatar"/>
        <span className="task-total">{taskTotalTime}</span>
      </div>
    )
  }

}
