import React from 'react'
import { Table, Tag, Button } from 'antd'
import { inject } from 'mobx-react'

import Service from 'service'
import emitter from 'utils/events'
import { createWorkOrderForm } from 'assets/config/workorder'
import './index.scss'

const renderWorkorderType = type => {
  let color
  switch (type) {
    case 'bug': color = 'volcano'; break
    case 'feature': color = 'green'; break
    default: color = 'geekblue';
  }
  return (
    <Tag color={color} key={type}>{type}</Tag>
  )
}
const renderWorkorderStatus = status => {
  let label
  switch (status) {
    case 0: label = '待处理'; break
    case 1: label = '处理中'; break
    default: label = '已关闭';
  }
  return (
    <span>{label}</span>
  )
}
const columns = [
  {
    title: '问题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '问题内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '问题分类',
    key: 'type',
    dataIndex: 'type',
    render: renderWorkorderType,
  },
  {
    title: '问题状态',
    dataIndex: 'status',
    key: 'status',
    render: renderWorkorderStatus,
  }
]

@inject('userStore')
class WorkOrder extends React.Component {

  isAdmin = true

  state = {
    tableData: [],
  }

  getWorkOrder = async () => {
    const resp = await Service.getWorkOrder({ isAdmin: this.isAdmin })
    if (!resp.errno) {
      this.setState({ tableData: resp.data })
    }
  }

  createWorkOrder = () => {
    emitter.emit('invokeLiteForm', {
      formTitle: '新建工单',
      formContent: createWorkOrderForm(),
      onOk: async (params, done) => {
        const create = await Service.setWorkOrder(params)
        if (!create.errno) {
          this.setState({ tableData: [...this.state.tableData, create.data] })
        }
        done()
      }
    })
  }

  componentDidMount() {
    const { userStore } = this.props
    if (!userStore.isLogin) return

    this.isAdmin = userStore.user.isAdmin
    this.getWorkOrder()
  }

  render() {
    const { tableData } = this.state

    return (
      <div className="workorder-layout">
        <Button className="workorder-layout-button" icon="plus" onClick={this.createWorkOrder}>新建工单</Button>
        <Table columns={columns} dataSource={tableData}/>
      </div>
    )
  }
}

export default WorkOrder
