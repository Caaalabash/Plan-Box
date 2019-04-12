import React from 'react'
import {
  Table,
  Tag,
  Button,
  Modal,
  AutoComplete,
  Divider
} from 'antd'
import { inject, observer } from 'mobx-react'

import Service from 'service'
import './index.scss'

const Option = AutoComplete.Option
const columns = [
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: '权限',
    dataIndex: 'permission',
    key: 'permission',
    render: permission => {
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
  }
]
const createForm = [
  {
    key: 'name',
    label: '团队名称',
    initialValue: '',
    rules: [
      { required: true, message: '请输入团队名称' }
    ],
    componentOptions: {
      type: 'input',
    },
  }
]

@inject('userStore')
@observer
class Team extends React.Component {
  modalTitle = null
  selectUserId = null
  state = {
    modalVisible: false,
    selectedRowKeys: [],
    autoCompleteData: [],
  }

  inviteUser = () => {
    this.modalTitle = '邀请成员'
    this.toggleModalVisible(true)
  }

  removeMember = () => {

  }

  handleSearch = async (name) => {
    const resp = await Service.matchMember(name)
    if (!resp.errno) this.setState({ autoCompleteData: resp.data || [] })
  }

  handleSelect = val => this.selectUserId = val

  toggleModalVisible = status => this.setState({ modalVisible: status })

  onSelectChange = selectedRowKeys => this.setState({ selectedRowKeys })

  componentDidMount() {

  }

  render() {
    const { modalVisible, selectedRowKeys, autoCompleteData } = this.state
    const { memberInfo = [] } = this.props.userStore.team || {}
    const rowSelection = { selectedRowKeys, onChange: this.onSelectChange }

    const renderData = autoCompleteData.length
      ? autoCompleteData.map(user => (
        <Option key={user._id} value={user._id} disabled={user.belong} info={user.name + '---' + user.email}>
          <span>{user.name}</span>
          <Divider type="vertical"/>
          <span>{user.email}</span>
        </Option>
      ))
      : [<Option key='none' value='none' disabled>暂无匹配用户</Option>]


    return (
      <div className="team-layout">
        <section className="team-layout-operate">
          <Button className="add" icon="user-add" onClick={this.inviteUser}>邀请成员</Button>
          <Divider type="vertical"/>
          <Button className="delete" icon="delete" disabled={!selectedRowKeys.length} onClick={this.removeMember}>移除成员</Button>
        </section>
        <Table rowKey="_id" rowSelection={rowSelection} columns={columns} dataSource={memberInfo}/>
        <Modal
          title={this.modalTitle}
          destroyOnClose
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModalVisible.bind(this, false)}
        >
          <AutoComplete dataSource={renderData} onSearch={this.handleSearch} onSelect={this.handleSelect} optionLabelProp="info"/>
        </Modal>
      </div>
    )
  }
}

export default Team

