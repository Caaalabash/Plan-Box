import React, { Component } from 'react'
import { Collapse, Button, Modal, Radio } from 'antd'
import Service from 'service'

import SprintPanelHeader from 'components/SprintPanelHeader'
import LiteForm from 'components/LiteForm'
import DraggableTable from 'components/DraggableTable'
import { createSprintFormConfig, taskFormConfig } from 'assets/config/sprint-form'
import { translatePriority, setSequence } from 'utils/tool'
import './index.scss'

const Panel = Collapse.Panel
const TableHeader = [
  {
    title: '子任务',
    key: 'title',
  },
  {
    title: '任务描述',
    key: 'desc',
  },
  {
    title: '故事点',
    key: 'storyPoint',
  },
  {
    title: '优先级',
    key: 'priority',
    handler: translatePriority
  },
  {
    title: '负责人',
    key: 'team',
    handler: obj => obj.rd
  }
]

const processPayload = formData => {
  return Object.keys(formData).reduce((payload, key) => {
    switch (key) {
      case 'range': [payload.startTime, payload.endTime] = formData[key].map(moment => moment.valueOf()); break
      case 'pm': payload.team.pm = formData[key]; break
      case 'rd': payload.team.rd = formData[key]; break
      case 'qa': payload.team.qa = formData[key]; break
      default: payload[key] = formData[key]; break
    }
    return payload
  }, { team: {} })
}

export default class Sprint extends Component {

  state = {
    sprintList: [], // 所有Sprint列表
    modelVisible: false, // 弹窗显示隐藏
    defaultSprintStatus: 'all' // 筛选情况
  }
  formContent = [] // 动态表单内容
  curOperate = 'create' // 操作记录
  operateSprintIndex = -1 // 操作的上一个sprint索引
  // 计算属性: 弹窗标题
  get modalTitle () {
    switch (this.curOperate) {
      case 'update': return '更新当前Sprint任务周期'
      case 'add': return '为当前Sprint添加子任务'
      default: return '创建新的Sprint任务周期'
    }
  }
  // 获得指定筛选下的 Sprint 周期
  getSprintList = async status => {
    const sprintStatus = status || this.state.defaultSprintStatus
    const { data } = await Service.getSprintByFilter(`?status=${sprintStatus}`)
    this.setState({ sprintList: data })
  }
  // Mount时获取数据
  componentDidMount() {
    this.getSprintList()
  }
  // 更改筛选
  handleRadioChange = e => {
    this.setState({ defaultSprintStatus: e.target.value })
    this.getSprintList(e.target.value)
  }
  // 记录表单引用
  recordFormRef = ref => {
    this.formRef = ref
  }
  // 切换弹窗状态
  toggleModule = status => {
    status !== this.state.modelVisible && this.setState({ modelVisible: status })
  }
  // 新建按钮处理函数
  handleBtnClick = () => {
    this.formContent = createSprintFormConfig()
    this.curOperate = 'create'
    this.toggleModule(true)
  }
  // 展开折叠面板时获取当前Sprint的子任务列表
  handleCollapseChange = async ([sprintId]) => {
    const { sprintList } = this.state
    const index = sprintList.findIndex(sprint => sprint._id === sprintId)
    if (~index) {
      let { data } = await Service.getTaskBySprintId(sprintId)
      sprintList[index] = { ...sprintList[index], ...{ task: setSequence(data) } }
      this.setState({ sprintList })
    }
  }
  // 拖拽表单的drop事件触发时, 调用排序接口
  onDrop(sequence) {
    Service.updateSequence({ sequence })
  }
  // 处理菜单点击事件
  handleOperate = (key, sprint, index) => {
    const { sprintList } = this.state
    this.curOperate = key
    this.operateSprintIndex = index
    // 删除Sprint
    if (key === 'delete') {
      Service.deleteSprint(`?_id=${sprint._id}`).then(() => {
        sprintList.splice(index, 1)
        this.setState({ sprintList })
      })
    }
    // 更改Sprint状态
    else if (key === 'begin' || key === 'close') {
      const status = key === 'begin' ? '1' : '2'
      Service.updateSprint({ _id: sprint._id, status }).then(() => {
        sprintList[index].status = +status
        this.setState({ sprintList })
      })
    }
    // 修改Sprint, 打开弹窗
    else if (key === 'update') {
      this.formContent = createSprintFormConfig(sprint)
      this.toggleModule(true)
    }
    // 添加子任务, 打开弹窗
    else if (key === 'add') {
      this.formContent = taskFormConfig
      this.toggleModule(true)
    }
  }
  // 提交表单
  handleSubmit = () => {
    const { sprintList } = this.state
    const form = this.formRef.props.form
    let operateSprint = sprintList[this.operateSprintIndex]

    form.validateFields(async (err, value) => {
      if (err) return
      const payload = processPayload(value)
      // 创建: sprintList 新增一条数据
      if (this.curOperate === 'create') {
        const result = await Service.setSprint(payload)
        this.setState({ sprintList: [...sprintList, result.data] })
      }
      // 增加子任务: task数组新增一条数据, 修改总故事点
      else if (this.curOperate === 'add') {
        const result = await Service.setTask({ relateSprint: operateSprint._id, ...payload })
        const nextSequence = operateSprint.task.length + 1
        operateSprint.task.push({ ...result.data, sequence: nextSequence })
        operateSprint.storyPoint += result.data.storyPoint
        this.setState({ sprintList })
      }
      // 修改
      else {
        const result = await Service.updateSprint({...payload, _id: operateSprint._id})
        operateSprint = result.data
        this.setState({ sprintList })
      }
      this.toggleModule(false)
    })
  }

  render() {
    const { sprintList, modelVisible, defaultSprintStatus } = this.state

    let content = null
    if (sprintList.length) {
      // 过滤掉sprint状态与当前筛选状态不一致的数据
      content = sprintList
        .filter((sprint, index) => {
          if (defaultSprintStatus === 'all') return true
          return (sprint.status === +defaultSprintStatus)
        })
        .map((sprint, index) => {
          return (
            <Collapse key={sprint._id} onChange={this.handleCollapseChange}>
              <Panel
                key={sprint._id}
                header={<SprintPanelHeader {...sprint} onOperate={e => this.handleOperate.call(this, e, sprint, index)}/>}
              >
                {
                  sprint.task.length
                    ? <DraggableTable header={TableHeader} data={sprint.task} belong={sprint._id} onDrop={this.onDrop}/>
                    : '暂无子任务'
                }
              </Panel>
            </Collapse>
          )
        })
    } else {
      content = <div>nothing</div>
    }

    return (
      <div className="sprint-layout">
        <div className="sprint-operate">
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
        {content}
        <Modal
          title={this.modalTitle}
          destroyOnClose
          visible={modelVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModule.bind(this, false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={this.recordFormRef}/>
        </Modal>
      </div>
    )
  }
}
