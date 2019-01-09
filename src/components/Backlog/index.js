import React, { Component } from 'react'
import { Collapse, Button, Modal, Radio } from 'antd'
import Service from 'service'
import SprintPanelHeader from '../SprintPanelHeader'
import LiteForm from '../LiteForm'
import { createSprintFormConfig } from 'assets/config/sprint-form'

import './index.scss'

const Panel = Collapse.Panel
const processPayload = formData => {
  return Object.keys(formData).reduce((payload, key) => {
    switch (key) {
      case 'range':
        [payload.startTime, payload.endTime] = formData[key].map(moment => moment.valueOf())
        break
      case  'pm':
        payload.team = {}
        payload.team.pm = formData[key]
        break
      default:
        payload[key] = formData[key]
        break
    }
    return payload
  }, {})
}

export default class Backlog extends Component {

  state = {
    sprintList: [],
    modelVisible: false,
    defaultSprintStatus: 'all'
  }
  formContent = []
  lastOperate = 'create'
  operateSprintIndex = -1

  componentDidMount() {
    this.getSprintList()
  }

  // 计算属性
  get modalTitle () {
    switch (this.lastOperate) {
      case 'update': return '更新当前Sprint任务周期'
      case 'add': return '为当前Sprint添加子任务'
      default: return '创建新的Sprint任务周期'
    }
  }
  // 记录表单引用
  recordFormRef = ref => {
    this.formRef = ref
  }
  // 切换弹窗状态
  toggleModule = status => {
    // 避免额外的render
    if(status === this.state.modelVisible) return
    this.setState({ modelVisible: status })
  }
  // 新建按钮处理函数
  handleBtnClick = () => {
    this.formContent = createSprintFormConfig()
    this.lastOperate = 'create'
    this.toggleModule(true)
  }
  // 处理菜单点击事件
  handleOperate = (sprint, {key}) => {
    const { sprintList } = this.state
    this.lastOperate = key
    this.operateSprintIndex = sprintList.findIndex(currentSprint => currentSprint._id === sprint._id)
    // 删除Sprint 成功后从State中移除
    if (key === 'delete') {
      Service.deleteSprint(`?_id=${sprint._id}`).then(() => {
        this.setState({
          sprintList: sprintList.filter(currentSprint => sprint._id !== currentSprint._id)
        })
      })
    }
    // 修改Sprint状态, 找到修改Sprint在原列表的索引
    else if (key === 'begin' || key === 'close') {
      const status = key === 'begin' ? '1' : '2'
      Service.updateSprint({_id: sprint._id, status}).then(res => {
        sprintList[this.operateSprintIndex].status = +status
        this.setState({
          sprintList,
        })
      })
    }
    // 修改Sprint, 打开弹窗
    else if (key === 'update') {
      this.formContent = createSprintFormConfig(sprint)
      this.toggleModule(true)
    }
    // 添加子任务, 打开弹窗
    else if (key === 'add') {
      this.toggleModule(true)
    }
  }

  getSprintList = () => {
    Service.getSprintByFilter(`?status=${this.state.defaultSprintStatus}`).then(res => {
      this.setState({
        sprintList: res.data,
      })
    })
  }

  handleRadioChange = e => {
    this.setState({
      defaultSprintStatus: e.target.value
    }, this.getSprintList)
  }

  handleSubmit = () => {
    const { sprintList } = this.state
    const form = this.formRef.props.form

    form.validateFields((err, value) => {
      if (err) return
      const payload = processPayload(value)
      if (this.lastOperate === 'create') {
        Service.setSprint(payload).then(res => {
          this.setState({ sprintList: [...sprintList, res.data] })
          this.toggleModule(false)
        })
      } else {
        Service.updateSprint({...payload, _id: sprintList[this.operateSprintIndex]._id}).then(res => {
          sprintList[this.operateSprintIndex] = res.data
          this.setState({ sprintList })
          this.toggleModule(false)
        })
      }
    })
  }

  render() {
    const { sprintList, modelVisible, defaultSprintStatus } = this.state

    let content = null
    if (sprintList.length) {
      // 过滤掉sprint状态与当前筛选状态不一致的数据
      content = sprintList.filter(sprint => {
        if (defaultSprintStatus === 'all') return true
        return sprint.status === + defaultSprintStatus
      }).map(sprint => {
        return (
          <Collapse defaultActiveKey={['1']} key={sprint._id}>
            <Panel header={<SprintPanelHeader {...sprint} onOperate={this.handleOperate}/>} />
          </Collapse>
        )
      })
    } else {
      content = <div>nothing</div>
    }

    return (
      <div className="backlog-layout">
        <div className="backlog-operate">
          <Radio.Group
            className="filter-sprint"
            defaultValue={defaultSprintStatus}
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
        <Modal
          title={this.modalTitle}
          visible={modelVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModule.bind(this, false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={this.recordFormRef}/>
        </Modal>
        {content}
      </div>
    )
  }
}
