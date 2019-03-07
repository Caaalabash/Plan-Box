import React from 'react'
import { Collapse, Modal } from 'antd'

import Service from 'service'
import emitter from 'utils/events'
import TaskCard from 'components/TaskCard'
import LiteForm from 'components/LiteForm'
import { restrictDropDistance, parseQueryParams, getParentDom, getDataset, addClass, removeClass, hasClass } from 'utils/tool'
import { issueFormConfig } from 'assets/config/form'
import './index.scss'

const Panel = Collapse.Panel

export default class Lane extends React.Component {

  state = {
    dropArr: {},
    taskList: [],
    open: null,
    relateId: null,
    modelVisible: false,
  }
  dragged = null
  over = null
  overClass = 'dragover'
  taskId = null
  formContent = issueFormConfig
  columnIndex = [0, 1, 2, 3, 4]

  componentDidMount() {
    const { relateId, open } = parseQueryParams(this.props.history.location.search)

    Service.getTaskBySprintId(relateId).then(tasks => {
      this.setState({
        taskList: tasks,
        open,
        relateId,
      })
    })
  }
  // 拖动开始: 记录被拖动元素, 给可释放区域添加 can-drop 类名
  handleDragStart = e => {
    this.dragged = getParentDom(e.target, 'className', 'issue')
    const belong = getDataset(this.dragged, 'belong')
    const columnIndex = getDataset(this.dragged, 'column')

    this.setState({
      dropArr: { ...this.state.dropArr, ...{ [belong]: restrictDropDistance(columnIndex) } }
    })
  }
  // 经过可释放区域: 添加样式 dragover
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
      addClass(over, this.overClass)
      this.over = over
    } else {
      const lastIndex = getDataset(this.over, 'columnKey')
      if (lastIndex !== overIndex) {
        removeClass(this.over, this.overClass)
        this.over = over
        !hasClass(this.over, this.overClass) && addClass(this.over, this.overClass)
      }
    }
  }
  // 释放
  handleDragEnd = e => {
    e.preventDefault()
    // 重置样式
    this.setState({ dropArr: {} })
    if (!this.over || !this.dragged) return
    removeClass(this.over, this.overClass)
    // 操作dom
    this.dragged.dataset.column = this.over.dataset.columnKey
    this.over.appendChild(this.dragged)
    // 更新状态
    Service.setIssueStatus({
      taskId: getDataset(this.dragged, 'belong'),
      issueId: getDataset(this.dragged, 'id'),
      status: getDataset(this.over, 'columnKey')
    })
    // 重置状态
    this.over = null
    this.dragged = null
  }

  toggleModule = status => {
    this.setState({ modelVisible: status })
  }
  handleSubmit = () => {
    const form = this.formRef.props.form
    form.validateFields(async (e, value) => {
      if (e) return
      await Service.setIssue({ taskId: this.taskId, ...value})
      this.toggleModule(false)
    })
  }
  handleContextMenu = (e, taskId) => {
    e.preventDefault()
    e.customMenu = [
      {
        title: '创建Issue',
        handler: () => {
          this.toggleModule(true)
        }
      }
    ]
    this.taskId = taskId
    emitter.emit('contextmenu', e)
  }

  render() {
    const { taskList, open, modelVisible, dropArr } = this.state
    const createHeader = task => (
      <div className="pane-header" onContextMenu={e => this.handleContextMenu.call(this, e, task._id)}>
        <span>{task.title}</span>
      </div>
    )
    return (
      <div className="lane-layout">
        {
          open && <Collapse defaultActiveKey={[open]}>
            {
              taskList.length && taskList.map(task => (
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
                      this.columnIndex.map(index => {
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
                              task.issue
                                .filter(issue => +issue.status === index)
                                .map(issue =>
                                  <TaskCard
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
              ))
            }
          </Collapse>
        }
        <Modal
          title="创建子任务"
          destroyOnClose
          visible={modelVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModule.bind(this, false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
        </Modal>
      </div>
    )
  }

}
