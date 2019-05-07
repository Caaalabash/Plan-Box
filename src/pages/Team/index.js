import React from 'react'
import {
  Table,
  Tag,
  Button,
  Divider,
  Popconfirm,
  message
} from 'antd'
import { inject, observer } from 'mobx-react'

import Service from 'service'
import emitter from 'utils/events'
import { createTeamForm, setPermissionForm, autoCompleteForm } from 'assets/config/team'
import './index.scss'

const renderPermission = permission => {
  let color
  switch (permission) {
    case 'developer': color = 'volcano'; break
    case 'master': color = 'green'; break
    case 'owner': color = 'purple'; break
    default: color = 'geekblue';
  }
  return (
    <Tag color={color} key={permission}>{permission}</Tag>
  )
}
const columns = [
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '权限',
    dataIndex: 'permission',
    key: 'permission',
    render: renderPermission
  }
]

@inject('userStore')
@observer
class Team extends React.Component {

  isSelect = false

  state = {
    selectedRowKeys: [],
  }

  createTeam = () => {
    emitter.emit('invokeLiteForm', {
      formTitle: '创建团队',
      formContent: createTeamForm(),
      onOk: async (params, done) => {
        await this.props.userStore.createTeam(params)
        done()
      }
    })
  }

  inviteUser = () => {
    emitter.emit('invokeLiteForm', {
      formTitle: '邀请成员',
      formContent: autoCompleteForm({
        onSearch: this.handleSearch,
        onSelect: this.handleSelect,
        optionLabelProp: 'info'
      }),
      onOk: async ({ inviteUserId } , done) => {
        if (!this.isSelect) {
          message.info('请从下拉框中选择')
          return
        }
        await this.props.userStore.inviteUser(inviteUserId)
        done()
      }
    })
  }

  setPermission = () => {
    const permissionList = this.props.userStore.permissionRange.map(item => ({ label: item, value: item }))

    emitter.emit('invokeLiteForm', {
      formTitle: '设定成员权限',
      formContent: setPermissionForm(permissionList),
      onOk: async ({ permission }, done) => {
        await Promise.all(this.state.selectedRowKeys.map( id => this.props.userStore.setPermission(id, permission) ))
        done()
      }
    })
  }

  removeMember = async () => {
    await Promise.all(this.state.selectedRowKeys.map( id => this.props.userStore.removeMember(id) ))
    this.setState({ selectedRowKeys: [] })
  }

  leaveTeam = () => this.props.userStore.leaveTeam()

  handleSearch = async (name) => {
    const resp = await Service.matchMember(name)
    if (!resp.errno) {
      emitter.emit('autoCompleteDataChange', resp.data)
    }
  }

  handleSelect = () => this.isSelect = true

  onSelectChange = selectedRowKeys => this.setState({ selectedRowKeys })

  render() {
    const { selectedRowKeys } = this.state
    const { teamMember, permission, permissionRange } = this.props.userStore
    const leaveTeamTitle = permission === 'owner'
      ? '团队所有者将移交给某位Master，否则团队将直接解散。'
      : '您将直接退出该团队。'

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: !(permissionRange).includes(record.permission),
      }),
    }
    return (
      <div className="team-layout">
        <section className="team-layout-operate">
          <Button className="add" icon="user-add" disabled={!permission} onClick={this.inviteUser}>邀请成员</Button>
          <Divider type="vertical"/>
          <Button className="delete" icon="delete" disabled={!selectedRowKeys.length} onClick={this.removeMember}>移除成员</Button>
          <Divider type="vertical"/>
          <Button className="add" icon="sort-descending" disabled={!selectedRowKeys.length} onClick={this.setPermission}>设置权限</Button>
          {
            permission
              ?
                <Popconfirm title={leaveTeamTitle} onConfirm={this.leaveTeam} okText="确认" cancelText="取消">
                  <Button className="leave" icon="logout" >退出团队</Button>
                </Popconfirm>
              : <Button className="create" icon="form" onClick={this.createTeam}>创建团队</Button>
          }
        </section>
        <Table rowKey="_id" rowSelection={rowSelection} columns={columns} dataSource={teamMember}/>
      </div>
    )
  }
}

export default Team

