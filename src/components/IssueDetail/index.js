import React, { Component } from 'react'
import { Drawer, Tag, Progress, Button } from 'antd'
import { inject } from 'mobx-react'

import emitter from 'utils/events'
import './index.scss'

@inject('userStore')
class IssueDetail extends Component {

  issueStatus = ['待开发', '开发中', '待测试', '测试中', '已完成']
  issueStatusColor = ['green', 'cyan', 'blue', 'geekblue', 'purple']
  issuePriority = ['建议', '重要', '紧急', '致命']
  issuePriorityColor = ['lime', 'blue', 'purple', 'red']

  state = {
    drawerVisible: false,
    issue: null
  }

  handleClick = () => {
    this.setState({ drawerVisible: false })
  }

  logIssue = () => {
    this.setState({ drawerVisible: false })
    const { taskId, ...issue } = this.state.issue || {}
    emitter.emit('issueLog', { issue, taskId })
  }

  deleteIssue = () => {
    this.setState({ drawerVisible: false })
    const { _id, taskId } = this.state.issue || {}
    emitter.emit('deleteIssue', { issueId: _id, taskId })
  }

  componentDidMount() {
    emitter.on('issueDetail', payload => {
      this.setState({
        drawerVisible: true,
        issue: payload
      })
    })
  }

  render() {
    const { drawerVisible, issue } = this.state
    const isBug = issue && issue.issueType === 'bug'
    const zoom = issue && Math.round(50 / Math.max(issue.time, issue.usedTime))
    const responsibleInfo = issue && this.props.userStore.teamMember.find(member => member._id === issue.responsible)

    return (
      <Drawer
        className="issue-detail"
        title="Issue - 详细信息"
        placement="right"
        closable={true}
        onClose={this.handleClick}
        visible={drawerVisible}
      >
        {
          issue && (<div className="issue-detail-container">
            <div className="issue-detail-meta">
              <p className="head">Issue标题：</p>
              <div className="content">{ issue.title }</div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue描述：</p>
              <div className="content">{ issue.desc || '暂无描述' }</div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue类型：</p>
              <div className="content">
                <Tag color={isBug ? 'red' : 'blue'}>{ issue.issueType }</Tag>
              </div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue状态：</p>
              <div className="content">
                <Tag color={this.issueStatusColor[issue.status]}>{ this.issueStatus[issue.status] }</Tag>
              </div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue优先级：</p>
              <div className="content">
                <Tag color={this.issuePriorityColor[issue.priority]}>{ this.issuePriority[issue.priority] }</Tag>
              </div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue时间消耗：</p>
              <div className="content">
                <Progress className="progress" percent={issue.time * zoom} size="small" status="active" format={() => `预估用时${issue.time}h`}/>
                <Progress className="progress" percent={issue.usedTime * zoom} size="small" status="exception" format={() => `实际用时${issue.usedTime}h`}/>
              </div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue工作日志：</p>
              <div className="content">{ issue.log }</div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue经办人：</p>
              <div className="content">
                <p className="head">经办人姓名：</p>
                <div className="content">{ responsibleInfo.name || '[该成员已不在团队内]' }</div>
                <p className="head">经办人邮箱：</p>
                <div className="content">{ responsibleInfo.email || '[暂无邮箱]' }</div>
              </div>
            </div>
            <div className="issue-detail-meta">
              <p className="head">Issue操作：</p>
              <div className="content">
                <Button className="operate" block onClick={this.logIssue}>登记工作日志</Button>
                <Button type="danger" block onClick={this.deleteIssue}>删除</Button>
              </div>
            </div>
          </div>)
        }
      </Drawer>
    )
  }

}

export default IssueDetail
