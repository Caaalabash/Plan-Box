import React, { Component } from 'react'
import { Collapse, Button, Modal, Radio } from 'antd'
import Service from 'service'

import './index.scss'
import SprintPanelHeader from '../SprintPanelHeader'
import LiteForm from '../LiteForm'
import SprintFormConfig from 'assets/config/sprint-form'

const Panel = Collapse.Panel

export default class Backlog extends Component {

  constructor() {
    super()
    this.state = {
      sprintList: [],
      modelVisible: false,
      defaultSprintStatus: ''
    }
  }

  componentDidMount() {
    this.getSprintList()
  }

  recordFormRef = ref => {
    this.formRef = ref
  }

  toggleModule = status => {
    this.setState({ modelVisible: status })
  }

  handleOperate = (sprint, {key}) => {
    const { sprintList } = this.state
    // 删除Sprint 成功后从State中移除
    if (key === 'delete') {
      Service.deleteSprint(`?_id=${sprint._id}`).then(() => {
        const newActiveSprint = sprintList.filter(currentSprint => sprint._id !== currentSprint._id)
        this.setState({
          sprintList: newActiveSprint
        })
      })
    }
    // 修改Sprint状态, 找到修改Sprint在原列表的索引
    else if (key === 'begin' || key === 'close') {
      const status = key === 'begin' ? '1' : '2'
      Service.updateSprint({...sprint, status}).then(res => {
        const index = sprintList.findIndex(currentSprint => currentSprint._id === sprint._id)
        const newList = sprintList.slice(0)
        newList[index].status = + status
        this.setState({
          sprintList: newList
        })
      })
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
    const form = this.formRef.props.form
    form.validateFields((err, value) => {
      if (err) return
      const payload = {
        id: value.id,
        title: value.title,
        desc: value.desc,
        status: 0,
        startTime: value.range[0].valueOf(),
        endTime: value.range[1].valueOf(),
      }
      Service.setSprint(payload).then(res => {
        this.setState({
          sprintList: [...this.state.sprintList, res.data]
        })
        this.toggleModule(false)
      })
    })
  }

  render() {
    let content = null
    const { sprintList, modelVisible, defaultSprintStatus } = this.state
    if (sprintList.length) {
      // render时经过一次过滤, 过滤掉sprint状态与当前状态不一致的数据
      content = sprintList.filter(sprint => {
        if (defaultSprintStatus === '') return true

        return sprint.status === +defaultSprintStatus
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
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="0">未开始</Radio.Button>
            <Radio.Button value="1">进行中</Radio.Button>
            <Radio.Button value="2">已完成</Radio.Button>
          </Radio.Group>
          <Button className="create-sprint" icon="plus" onClick={this.toggleModule.bind(this, true)}>新建Sprint</Button>
        </div>
        <Modal
          title="新建一个Sprint任务周期"
          visible={modelVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModule.bind(this, false)}
        >
          <LiteForm formList={SprintFormConfig} wrappedComponentRef={this.recordFormRef}/>
        </Modal>
        {content}
      </div>
    )
  }
}
