import React, { Component } from 'react'
import { Collapse, Button, Modal } from 'antd'
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
      activeSprint: [],
      modelVisible: false,
    }
  }

  componentDidMount() {
    Service.getSprintByFilter().then(res => {
      this.setState({
        activeSprint: res.data,
      })
    })
  }

  handleOperate = (_id, {key}) => {
    if (key === 'delete') {
      Service.deleteSprint(`?_id=${_id}`).then(() => {
        const newActiveSprint = this.state.activeSprint.filter(sprint => sprint._id !== _id)
        this.setState({
          activeSprint: newActiveSprint
        })
      })
    }
  }

  toggleModule = status => {
    this.setState({ modelVisible: status })
  }

  handleSubmit = () => {
    const form = this.formRef.props.form
    form.validateFields((err, value) => {
      if (err) return
      const payload = {
        id: value.id,
        title: value.title,
        desc: value.desc,
        status: 1,
        startTime: value.range[0].valueOf(),
        endTime: value.range[1].valueOf(),
      }
      Service.setSprint(payload).then(res => {
        this.setState({
          activeSprint: [...this.state.activeSprint, res.data]
        })
        this.toggleModule(false)
      })
    })

  }

  recordFormRef = ref => {
    this.formRef = ref
  }

  render() {
    let content = null
    const { activeSprint, modelVisible } = this.state
    if (activeSprint.length) {
      content = activeSprint.map(sprint => {
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
        <Button className="create-sprint" icon="plus" onClick={this.toggleModule.bind(this, true)}>新建Sprint</Button>
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
