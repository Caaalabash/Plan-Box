import React from 'react'
import { Collapse, Modal, Drawer, Radio, Button } from 'antd'
import { inject, observer } from 'mobx-react'

import emitter from 'utils/events'
import IssueCard from 'components/IssueCard'
import LiteForm from 'components/LiteForm'
import Empty from 'components/Empty'
import {
  restrictDropDistance,
  parseQueryParams,
  getParentDom,
  getDataset,
  addClass,
  removeClass,
  hasClass
} from 'utils/tool'
import {
  createIssueForm,
  createIssueLogForm
} from 'assets/config/form'
import './index.scss'

const Panel = Collapse.Panel
const RadioGroup = Radio.Group
const overClass = 'dragover'
const column = [0, 1, 2, 3, 4]
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

@inject('sprintStore')
@inject('userStore')
@observer
class Lane extends React.Component {

  formContent = null
  formTitle = null
  dragged = null
  over = null
  taskId = null
  modalPayload = null

  state = {
    dropArr: {},
    modalVisible: false,
    drawerVisible: false,
  }

  onCloseDrawer = () => this.toggleVisible('drawerVisible', false)

  handleBtnClick = () => this.toggleVisible('drawerVisible', true)

  toggleVisible = (key, value) => this.setState({ [key]: value })

  onRadioChange = async e => {
    await this.props.sprintStore.setChooseSprintId(e.target.value)
    this.setState({ drawerVisible: false })
  }

  handleDragStart = e => {
    this.dragged = getParentDom(e.target, 'className', 'issue')
    const belong = getDataset(this.dragged, 'belong')
    const columnIndex = getDataset(this.dragged, 'column')

    this.setState({
      dropArr: { ...this.state.dropArr, ...{ [belong]: restrictDropDistance(columnIndex) } }
    })
  }

  handleDragOver = e => {
    e.preventDefault()

    const { dropArr } = this.state
    const over = getParentDom(e.target, 'className', 'task-column')
    const overIndex = getDataset(over, 'columnKey')
    const belong = getDataset(this.dragged, 'belong')
    const overBelong = getDataset(over, 'belong')

    if (overBelong !== belong) return
    if (!~dropArr[belong].indexOf(overIndex)) return

    if (!this.over) {
      addClass(over, overClass)
      this.over = over
    } else {
      const lastIndex = getDataset(this.over, 'columnKey')
      if (lastIndex !== overIndex) {
        removeClass(this.over, overClass)
        this.over = over
        !hasClass(this.over, overClass) && addClass(this.over, overClass)
      }
    }
  }

  handleDragEnd = async e => {
    const { sprintStore } = this.props
    e.preventDefault()
    // 重置样式
    this.setState({ dropArr: {} })
    if (!this.over || !this.dragged) return
    removeClass(this.over, overClass)
    // 操作dom
    this.dragged.dataset.column = this.over.dataset.columnKey
    this.over.appendChild(this.dragged)
    // 更新状态
    sprintStore.setIssueStatus({
      taskId: getDataset(this.dragged, 'belong'),
      issueId: getDataset(this.dragged, 'id'),
      status: getDataset(this.over, 'columnKey')
    })
    // 重置状态
    this.over = null
    this.dragged = null
  }

  handleSubmit = () => {
    const { sprintStore } = this.props
    const form = this.formRef.props.form
    form.validateFields(async (e, value) => {
      if (e) return
      else if (this.modalPayload) {
        await sprintStore.setIssueLog({ ...this.modalPayload, ...value })
      } else {
        await sprintStore.createIssue(this.taskId, value)
      }
      this.toggleVisible('modalVisible', false)
    })
  }

  handleContextMenu = (e, taskId) => {
    e.preventDefault()
    e.customMenu = [
      {
        title: '创建Issue',
        handler: () => {
          this.modalPayload = null
          this.formContent = createIssueForm(this.props.userStore.responsibleList)
          this.formTitle = 'Issue - 创建'
          this.toggleVisible('modalVisible', true)
        }
      }
    ]
    this.taskId = taskId
    emitter.emit('contextmenu', e)
  }

  createIssueLog = ({ issue, taskId }) => {
    this.modalPayload = { issueId: issue._id, taskId }
    this.formContent = createIssueLogForm(issue)
    this.formTitle = 'Issue - 登记工作日志'
    this.toggleVisible('modalVisible', true)
  }

  componentDidMount() {
    emitter.on('issueLog', payload => {
      this.createIssueLog(payload)
    })
    emitter.on('deleteIssue', payload => {
      this.props.sprintStore.deleteIssue(payload)
    })
    const { relateId } = parseQueryParams(this.props.history.location.search)
    this.props.sprintStore.setChooseSprintId(relateId)
  }

  render() {
    const { modalVisible, dropArr, drawerVisible } = this.state
    const { sprintStore } = this.props
    const currentSprint = sprintStore.currentSprint
    const createHeader = task => (
      <div className="pane-header" onContextMenu={e => this.handleContextMenu.call(this, e, task._id)}>
        <span>{task.title}</span>
      </div>
    )

    return (
      <div className="lane-layout">
        <div className="lane-layout-button">
          <Button type="default" onClick={this.handleBtnClick}>切换Sprint</Button>
        </div>
        {
          currentSprint.task && currentSprint.task.length
            ? currentSprint.task.map(task => (
              <Collapse
                defaultActiveKey={task._id}
                key={task._id}
                className='lane-layout-collapse'
              >
                <Panel header={createHeader(task)} key={task._id}>
                  <ul className="task-header">
                    <li className="task-progress">待开发</li>
                    <li className="task-progress">开发中</li>
                    <li className="task-progress">待测试</li>
                    <li className="task-progress">测试中</li>
                    <li className="task-progress">已完成</li>
                  </ul>
                  <div className="task-content">
                    {
                      column.map(index => {
                        const canDrop = ~(dropArr[task._id] || '').indexOf(index.toString()) ? 'can-drop' : ''
                        return (
                          <div
                            className={`${canDrop} task-column`}
                            key={index}
                            data-belong={task._id}
                            data-column-key={index}
                            onDragOver={this.handleDragOver}
                          >
                            {
                              task.issue && task.issue
                                .filter(issue => +issue.status === index)
                                .map(issue =>
                                  <IssueCard
                                    key={issue._id}
                                    issue={issue}
                                    column={index}
                                    belong={task._id}
                                    onDragStart={this.handleDragStart}
                                    onDragEnd={this.handleDragEnd}
                                  />
                                )
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </Panel>
              </Collapse>
            ))
            : <Empty description="当前Sprint下无子任务"/>
        }
        <Drawer
          title="选择Sprint周期"
          placement="right"
          closable={true}
          onClose={this.onCloseDrawer}
          visible={drawerVisible}
        >
          {
            sprintStore.sprintList.length
              ? <RadioGroup onChange={this.onRadioChange} value={sprintStore.currentSprint._id}>
                {
                  sprintStore.sprintList.map(sprint =>
                    <Radio style={radioStyle} value={sprint._id} key={sprint._id}>{ sprint.title }</Radio>
                  )
                }
                </RadioGroup>
              : <Empty description="没有找到Sprint"/>
          }
        </Drawer>
        <Modal
          title={this.formTitle}
          destroyOnClose
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleVisible.bind(this, 'modalVisible', false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
        </Modal>
      </div>
    )
  }

}

export default Lane
