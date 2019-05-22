import React from 'react'
import { Table, Tag, Button, Divider } from 'antd'
import { inject } from 'mobx-react'

import Service from 'service'
import emitter from 'utils/events'
import { createWorkOrderForm, createFeedbackForm, reviewFeedbackForm } from 'assets/config/workorder'
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
const renderAction = function (userState, { _id, feedback }) {
  const { isAdmin } = userState
  return (
    <span>
      <a onClick={() => this.deleteWorkOrder(_id)}>删除</a>
      { isAdmin && !feedback &&
        <span>
          <Divider type="vertical"/>
          <a onClick={() => this.replyWorkOrder(_id)}>回复</a>
        </span>
      }
      { feedback &&
        <span>
          <Divider type="vertical"/>
          <a onClick={() => this.reviewWorkOrder(feedback)}>查看</a>
        </span>
      }
    </span>
  )
}
const columns = function (userState) {
  return [
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
    },
    {
      title: '操作',
      key: 'action',
      render: renderAction.bind(this, userState),
    },
  ]
}

@inject('userStore')
class WorkOrder extends React.Component {

  state = {
    tableData: [],
  }

  getWorkOrder = async () => {
    const resp = await Service.getWorkOrder()
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
        this.props.userStore.ws.emit('WorkOrderNotification', {
          type: 'newWorkOrder',
          payload: create.data
        })
        done()
      }
    })
  }

  deleteWorkOrder = async (id) => {
    const { tableData } = this.state
    const res = await Service.deleteWorkOrder(id)
    if (!res.errno) {
      const deleteIndex = tableData.findIndex(ticket => ticket._id === id)
      tableData.splice(deleteIndex, 1)
      this.setState({ tableData })
    }
  }

  replyWorkOrder = async (id) => {
    const { tableData } = this.state
    emitter.emit('invokeLiteForm', {
      formTitle: '回复工单',
      formContent: createFeedbackForm(),
      onOk: async ({ feedback }, done) => {
        const resp = await Service.updateWorkOrder({ ticketId: id, feedback })
        if (!resp.errno) {
          const updateIndex = tableData.findIndex(ticket => ticket._id === id)
          tableData[updateIndex] = resp.data
          this.setState({ tableData })
        }
        this.props.userStore.ws.emit('WorkOrderNotification', {
          type: 'replyWorkOrder',
          payload: resp.data
        })
        done()
      }
    })
  }

  reviewWorkOrder = (feedback) => {
    emitter.emit('invokeLiteForm', {
      formTitle: '查看反馈',
      formContent: reviewFeedbackForm({ feedback }),
      onOk: async (params, done) => {
        done()
      }
    })
  }

  componentDidMount() {
    this.getWorkOrder()
  }

  render() {
    const { tableData } = this.state
    const userState = this.props.userStore.user || {}

    return (
      <div className="workorder-layout">
        <Button className="workorder-layout-button" icon="plus" onClick={this.createWorkOrder}>新建工单</Button>
        <Table rowKey="_id" columns={columns.call(this, userState)} dataSource={tableData}/>
      </div>
    )
  }
}

export default WorkOrder
