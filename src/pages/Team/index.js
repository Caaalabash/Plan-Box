import React from 'react'
import {
  Table,
  Tag,
  Button,
  Modal,
  AutoComplete,
  Divider,
  message
} from 'antd'
import { inject, observer } from 'mobx-react'

import Service from 'service'
import { PERMISSION_MAP } from 'utils/constant'
import LiteForm from 'components/LiteForm'
import './index.scss'

const Option = AutoComplete.Option
const SET_PERMISSION = 'SET_PERMISSION'
const INVITE_MEMBER = 'INVITE_MEMBER'
const DELETE_MEMBER = 'DELETE_MEMBER'
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
const permissionForm = permission => {
  const list = PERMISSION_MAP[permission].map(item => ({ label: item, value: item }))

  return [
    {
      key: 'permission',
      label: '权限',
      initialValue: 'guest',
      rules: [],
      componentOptions: {
        type: 'select',
        list
      },
    }
  ]
}

@inject('userStore')
@observer
class Team extends React.Component {
  operate = null
  selectUserId = null
  formRef = null
  formContent = null
  state = {
    modalVisible: false,
    selectedRowKeys: [],
    autoCompleteData: [],
  }
  get modalTitle () {
    switch (this.operate) {
      case INVITE_MEMBER: return '邀请成员'
      case DELETE_MEMBER: return '删除成员'
      case SET_PERMISSION: return '设定权限'
      default: return ''
    }
  }

  inviteUser = () => {
    this.operate = INVITE_MEMBER
    this.toggleModalVisible(true)
  }

  setPermission = () => {
    this.formContent = permissionForm(this.props.userStore.permission)
    this.operate = SET_PERMISSION
    this.toggleModalVisible(true)
  }

  removeMember = async () => {
    await Promise.all(this.state.selectedRowKeys.map( id => this.props.userStore.removeMember(id) ))
    this.setState({ selectedRowKeys: [] })
  }

  handleSubmit = async () => {
    if (this.operate === INVITE_MEMBER) {
      if (!this.selectUserId) message.info('请从选项卡中选择要邀请的用户~')
      await this.props.userStore.inviteUser(this.selectUserId)
      this.toggleModalVisible(false)
    }
    else if (this.operate === SET_PERMISSION) {
      const form = this.formRef.props.form
      form.validateFields(async (err, obj) => {
        if (err) return
        await Promise.all(this.state.selectedRowKeys.map( id => this.props.userStore.setPermission(id, obj.permission) ))
        this.toggleModalVisible(false)
      })
    }
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
    const currentPermission = this.props.userStore.permission

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: !PERMISSION_MAP[currentPermission].includes(record.permission),
      }),
    }

    const renderData = autoCompleteData.length
      ? autoCompleteData.map(user => (
        <Option key={user._id} value={user._id} disabled={!!user.belong} info={user.name + '  ' + user.email}>
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
          <Divider type="vertical"/>
          <Button className="add" icon="sort-descending" disabled={!selectedRowKeys.length} onClick={this.setPermission}>设置权限</Button>
        </section>
        <Table rowKey="_id" rowSelection={rowSelection} columns={columns} dataSource={memberInfo}/>
        <Modal
          title={this.modalTitle}
          destroyOnClose
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModalVisible.bind(this, false)}
        >
          {
            this.operate === INVITE_MEMBER
              ? <AutoComplete
                dataSource={renderData}
                onSearch={this.handleSearch}
                onSelect={this.handleSelect}
                optionLabelProp="info"
              />
              : <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
          }
        </Modal>
      </div>
    )
  }
}

export default Team

