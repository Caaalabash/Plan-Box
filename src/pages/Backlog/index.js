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
      case 'range':
        [payload.startTime, payload.endTime] = formData[key].map(moment => moment.valueOf())
        break
      case 'pm':
        payload.team.pm = formData[key]
        break
      case 'rd':
        payload.team.rd = formData[key]
        break
      case 'qa':
        payload.team.qa = formData[key]
        break
      default:
        payload[key] = formData[key]
        break
    }
    return payload
  }, { team: {} })
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
  // 计算属性: 弹窗标题
  get modalTitle () {
    switch (this.lastOperate) {
      case 'update': return '更新当前Sprint任务周期'
      case 'add': return '为当前Sprint添加子任务'
      default: return '创建新的Sprint任务周期'
    }
  }

  componentDidMount() {
    this.getSprintList()
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
  handleOperate = ({ key }, sprint, index) => {
    const { sprintList } = this.state
    this.lastOperate = key
    this.operateSprintIndex = index
    // 删除Sprint
    if (key === 'delete') {
      Service.deleteSprint(`?_id=${sprint._id}`).then(() => {
        this.setState({
          sprintList: sprintList.slice().splice(index, 1)
        })
      })
    }
    // 开启/关闭Sprint
    else if (key === 'begin' || key === 'close') {
      const status = key === 'begin' ? '1' : '2'
      Service.updateSprint({ _id: sprint._id, status }).then(() => {
        sprintList[index].status = +status
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
      this.formContent = taskFormConfig
      this.toggleModule(true)
    }
  }
  // 获得指定筛选下的 Sprint 周期
  getSprintList = () => {
    Service.getSprintByFilter(`?status=${this.state.defaultSprintStatus}`).then(res => {
      this.setState({ sprintList: res.data })
    })
  }
  // 更改筛选
  handleRadioChange = e => {
    this.setState({ defaultSprintStatus: e.target.value }, this.getSprintList)
  }
  // 提交表单
  handleSubmit = () => {
    const { sprintList } = this.state
    const lastIndex = this.operateSprintIndex
    const form = this.formRef.props.form

    form.validateFields(async (err, value) => {
      if (err) return
      const payload = processPayload(value)
      // 创建: sprintList 新增一条数据
      if (this.lastOperate === 'create') {
        const result = await Service.setSprint(payload)
        this.setState({ sprintList: [...sprintList, result.data] })
      }
      // 增加子任务: task数组新增一条数据, 修改总故事点
      else if (this.lastOperate === 'add') {
        const relateSprint = sprintList[lastIndex]._id
        const result = await Service.setTask({ relateSprint, ...payload })
        sprintList[lastIndex].task.push(result.data)
        sprintList[lastIndex].storyPoint += result.data.storyPoint
        this.setState({ sprintList })
      }
      // 修改
      else {
        const result = await Service.updateSprint({...payload, _id: sprintList[lastIndex]._id})
        sprintList[lastIndex] = result.data
        this.setState({ sprintList })
      }
      this.toggleModule(false)
    })
  }
  // 展开折叠面板时获取当前Sprint的子任务列表
  handleCollapseChange = async ([sprintId]) => {
    const { sprintList } = this.state
    const index = this.state.sprintList.findIndex((sprint) => sprint._id === sprintId)
    if (~index) {
      let { data } = await Service.getTaskBySprintId(sprintId)
      // 处理子任务数组的排序
      data = setSequence(data)
      sprintList[index] = { ...sprintList[index], ...{ task: data } }
      this.setState({ sprintList })
    }
  }

  render() {
    const { sprintList, modelVisible, defaultSprintStatus } = this.state

    let content = null
    if (sprintList.length) {
      // 过滤掉sprint状态与当前筛选状态不一致的数据
      content = sprintList
        .filter(sprint => {
          if (defaultSprintStatus === 'all') return true
          return sprint.status === + defaultSprintStatus
        })
        .map((sprint, index) => {
          return (
            <Collapse key={sprint._id} onChange={this.handleCollapseChange}>
              <Panel key={sprint._id} header={<SprintPanelHeader {...sprint} onOperate={e => this.handleOperate.call(this, e, sprint, index)}/>}>
                <DraggableTable header={TableHeader} data={sprint.task}/>
              </Panel>
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
