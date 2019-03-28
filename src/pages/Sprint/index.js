import React, { Component } from 'react'
import { Collapse, Button, Modal, Radio } from 'antd'
import { inject, observer } from 'mobx-react'
import Service from 'service'

import SprintPanelHeader from 'components/SprintPanelHeader'
import LiteForm from 'components/LiteForm'
import DraggableTable from 'components/DraggableTable'
import Empty from 'components/Empty'

import { createSprintFormConfig, taskFormConfig } from 'assets/config/form'
import { translatePriority } from 'utils/tool'
import './index.scss'

const Panel = Collapse.Panel
const TableHeader = [
  { title: '子任务', key: 'title' },
  { title: '任务描述', key: 'desc' },
  { title: '故事点', key: 'storyPoint' },
  { title: '优先级', key: 'priority', handler: translatePriority },
  { title: '负责人', key: 'team', handler: obj => obj.rd }
]

const processPayload = formData =>
  Object.keys(formData).reduce((payload, key) => {
    switch (key) {
      case 'range': [payload.startTime, payload.endTime] = formData[key].map(moment => moment.valueOf()); break
      case 'pm': payload.team.pm = formData[key]; break
      case 'rd': payload.team.rd = formData[key]; break
      case 'qa': payload.team.qa = formData[key]; break
      default: payload[key] = formData[key]; break
    }
    return payload
  }, { team: {} })

@inject('sprintStore')
@observer
class Sprint extends Component {

  formContent = []
  operate = 'create'
  operateSprint = null
  state = {
    modalVisible: false,
    filter: 'all'
  }
  
  get modalTitle () {
    switch (this.operate) {
      case 'update': return '更新当前Sprint任务周期'
      case 'add': return '为当前Sprint添加子任务'
      default: return '创建新的Sprint任务周期'
    }
  }
  
  handleRadioChange = e => this.setState({ filter: e.target.value })

  toggleModal = status => this.setState({ modalVisible: status })

  handleCollapseChange = async ([sprintId]) => this.props.sprintStore.getTask(sprintId)

  onDrop = sequence => Service.updateSequence({ sequence })

  onDeleteTask = (_id, relateId) => this.props.sprintStore.deleteTask(_id, relateId)

  handleBtnClick = () => {
    this.operate = 'create'
    this.formContent = createSprintFormConfig()
    this.toggleModal(true)
  }

  handleSprintOperate = (key, sprint) => {
    this.operate = key
    this.operateSprint = sprint

    if (key === 'delete') {
      this.props.sprintStore.deleteSprint(sprint._id)
    }
    else if (key === 'begin' || key === 'close') {
      const status = key === 'begin' ? '1' : '2'
      this.props.sprintStore.updateSprintStatus(sprint._id, status)
    }
    else {
      this.formContent = key === 'update'
        ? createSprintFormConfig(sprint)
        : taskFormConfig
      this.toggleModal(true)
    }
  }

  handleSubmit = () => {
    const form = this.formRef.props.form
    const _id = this.operateSprint._id

    form.validateFields(async (err, value) => {
      if (err) return
      const payload = processPayload(value)

      if (this.operate === 'create') {
        this.props.sprintStore.addSprint(payload)
      }
      else if (this.operate === 'add') {
        this.props.sprintStore.addTask(_id, payload)
      }
      // 修改
      else {
        this.props.sprintStore.updateSprint(_id, payload)
      }
      this.toggleModal(false)
    })
  }

  componentDidMount() {
    this.props.sprintStore.initSprintList()
  }
  
  render() {
    const { modalVisible, filter } = this.state
    const renderList = this.props.sprintStore.sprintList.filter(sprint => {
      if (filter === 'all') return true
      return sprint.status === +filter
    })
    const content = renderList && renderList.length
      ? renderList.map(sprint =>
        <Collapse key={sprint._id} onChange={this.handleCollapseChange}>
          <Panel
            key={sprint._id}
            header={<SprintPanelHeader {...sprint} onOperate={e => this.handleSprintOperate.call(this, e, sprint)}/>}>
            {
              sprint.task.length
                ? <DraggableTable header={TableHeader} data={sprint.task} belong={sprint._id} onDrop={this.onDrop} onDelete={this.onDeleteTask}/>
                : <Empty description='暂无子任务'/>
            }
          </Panel>
        </Collapse>)
      : <Empty />

    return (
      <div className="sprint-layout">
        <div className="sprint-operate">
          <Radio.Group
            className="filter-sprint"
            defaultValue={filter}
            buttonStyle="solid"
            onChange={this.handleRadioChange}
          >
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="0">未开始</Radio.Button>
            <Radio.Button value="1">进行中</Radio.Button>
            <Radio.Button value="2">已完成</Radio.Button>
          </Radio.Group>
          <Button className="create-sprint" icon="plus" onClick={this.handleBtnClick}>新建Sprint</Button>
        </div>
        {content}
        <Modal
          title={this.modalTitle}
          destroyOnClose
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModal.bind(this, false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
        </Modal>
      </div>
    )
  }
}

export default Sprint