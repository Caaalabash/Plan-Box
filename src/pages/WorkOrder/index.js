import React from 'react'
import { Table, Tag, Button, Modal } from 'antd'
import { inject } from 'mobx-react'

import './index.scss'
import Service from 'service'
import LiteForm from 'components/LiteForm'

const columns = [{
  title: '问题',
  dataIndex: 'title',
  key: 'title',
}, {
  title: '问题内容',
  dataIndex: 'content',
  key: 'content',
}, {
  title: '提交时间',
  dataIndex: 'createTime',
  key: 'createTime',
}, {
  title: '问题分类',
  key: 'type',
  dataIndex: 'type',
  render: type => {
    let color
    switch (type) {
      case 'bug': color = 'volcano'; break
      case 'feature': color = 'green'; break
      default: color = 'geekblue';
    }
    return (
      <Tag color={color} key={type}>{type}</Tag>
    )
  },
}, {
  title: '问题状态',
  dataIndex: 'status',
  key: 'status',
  render: status => {
    let label
    switch (status) {
      case 0: label = '待处理'; break
      case 1: label = '处理中'; break
      default: label = '已关闭';
    }
    return (
      <span>{label}</span>
    )
  },
}]

@inject('userStore')
class WorkOrder extends React.Component {
  userId = null
  isAdmin = true
  formContent = [
    {
      key: 'title',
      label: '主要问题',
      initialValue: '',
      rules: [
        { required: true, message: '请输入主要问题' }
      ],
      componentOptions: {
        type: 'input',
      },
    },
    {
      key: 'content',
      label: '问题描述',
      initialValue: '',
      rules: [
        { required: true, message: '请输入问题描述' }
      ],
      componentOptions: {
        type: 'input',
      },
    },
    {
      key: 'type',
      label: '问题分类',
      initialValue: 'feature',
      rules: [],
      componentOptions: {
        type: 'select',
        list: [
          { label: 'feature', value: 'feature' },
          { label: 'bug', value: 'bug' },
          { label: 'suggestion', value: 'suggestion' },
        ]
      },
    },
  ]
  state = {
    tableData: [],
    modalVisible: false,
  }

  getWorkOrder = async () => {
    const data = await Service.getWorkOrder({ isAdmin: this.isAdmin })
    if (!data.code) {
      this.setState({ tableData: data.data })
    }
  }
  toggleModalVisible = status => {
    this.setState({ modalVisible: status })
  }
  handleSubmit = () => {
    const form = this.formRef.props.form

    form.validateFields(async (err, value) => {
      if (err) return
      const create = await Service.setWorkOrder(value)
      if (!create.code) {
        this.setState({
          tableData: [...this.state.tableData, create.data]
        })
        this.toggleModalVisible(false)
      }
    })
  }

  componentDidMount() {
    const userStore = this.props.userStore
    if (!userStore.isLogin) return

    this.userId = userStore.user._id
    this.isAdmin = userStore.user.isAdmin
    this.getWorkOrder()
  }

  render() {
    const { modalVisible, tableData } = this.state
    return (
      <div className="workorder-layout">
        <Button className="workorder-layout-button" icon="plus" onClick={this.toggleModalVisible.bind(this, true)}>新建工单</Button>
        <Table columns={columns} dataSource={tableData}/>
        <Modal
          title='新建工单'
          destroyOnClose
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModalVisible.bind(this, false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
        </Modal>
      </div>
    )
  }
}

export default WorkOrder
