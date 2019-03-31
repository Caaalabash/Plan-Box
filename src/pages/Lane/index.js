import React from 'react'
import { Collapse, Modal, Drawer, Radio, Button } from 'antd'
import { inject, observer } from 'mobx-react'

import Service from 'service'
import emitter from 'utils/events'
import TaskCard from 'components/TaskCard'
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
import { issueFormConfig } from 'assets/config/form'
import './index.scss'

const Panel = Collapse.Panel
const RadioGroup = Radio.Group
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

@inject('sprintStore')
@observer
class Lane extends React.Component {

  dragged = null
  over = null
  taskId = null
  overClass = 'dragover'
  formContent = issueFormConfig
  columnIndex = [0, 1, 2, 3, 4]
  state = {
    relateId: null,
    dropArr: {},
    taskList: [],
    open: null,
    modalVisible: false,
    drawerVisible: false,
  }

  onCloseDrawer = () => this.toggleVisible('drawerVisible', false)

  onRadioChange = e => {
    const sprint = this.props.sprintStore.sprintList.find(item => item._id === e.target.value)

    if (sprint) {
      this.setState({
        relateId: e.target.value,
        taskList: sprint.task || [],
        drawerVisible: false
      })
    }
  }

  handleBtnClick = () => this.toggleVisible('drawerVisible', true)

  initLane = async() => {
    const { sprintStore } = this.props
    if (!sprintStore.sprintList.length) await sprintStore.initSprintList()
    if (!sprintStore.sprintList.length) return

    const firstSprint = sprintStore.sprintList[0]
    this.setState({
      taskList: firstSprint.task,
    })
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

  toggleVisible = (key, value) => this.setState({ [key]: value })

  handleSubmit = () => {
    const form = this.formRef.props.form
    form.validateFields(async (e, value) => {
      if (e) return
      await Service.setIssue({ taskId: this.taskId, ...value})
      this.toggleVisible('modalVisible', false)
    })
  }

  handleContextMenu = (e, taskId) => {
    e.preventDefault()
    e.customMenu = [
      {
        title: '创建Issue',
        handler: () => {
          this.toggleVisible('modalVisible', true)
        }
      }
    ]
    this.taskId = taskId
    emitter.emit('contextmenu', e)
  }

  componentDidMount() {
    const { relateId, open } = parseQueryParams(this.props.history.location.search)

    if (relateId && open) {
      Service.getTaskBySprintId(relateId).then(resp => {
        this.setState({
          relateId,
          open,
          taskList: resp.data
        })
      })
    } else {
      this.initLane()
    }
  }

  render() {
    const { taskList, open, modalVisible, dropArr, drawerVisible, relateId } = this.state
    const { sprintStore } = this.props
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
          taskList.length
            ? taskList.map(task => (
              <Collapse defaultActiveKey={[open]} key={task._id} className='lane-layout-collapse'>
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
                              task.issue && task.issue
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
              ? <RadioGroup onChange={this.onRadioChange} value={relateId}>
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
          title="创建子任务"
          destroyOnClose
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleVisible.bind(this, false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
        </Modal>
      </div>
    )
  }

}

export default Lane
