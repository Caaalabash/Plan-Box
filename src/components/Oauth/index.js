import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import { inject, observer } from 'mobx-react'

import emitter from 'utils/events'
import Service from 'service'

@inject('userStore')
@inject('sprintStore')
@observer
class Oauth extends Component {

  loginThroughGithub = () => {
    const path = process.env.NODE_ENV === 'development'
      ? 'http://localhost:7001/api/plan-box/oauth/github'
      : '/api/plan-box/oauth/github'
    window.location.href = path
  }

  init = async() => {
    const res = await Service.getUserInfo()

    if (!res.errno) {
      const { userInfo, teamInfo, sprintInfo } = res.data
      this.props.userStore.setUser(userInfo)
      teamInfo && this.props.userStore.setTeam(teamInfo)
      sprintInfo && this.props.sprintStore.setSprintList(sprintInfo)
    }
  }

  componentDidMount() {
    emitter.on('logout', async() => {
      await Service.logout()
      this.props.userStore.resetUser()
      this.props.sprintStore.setSprintList([])
    })
    this.init()
  }

  render() {
    const { visible, toggleModal } = this.props
    return (
      <Modal title="第三方登录" visible={visible} onOk={() => toggleModal(false)} onCancel={() => toggleModal(false)}>
        <Button icon="github" type="default" size="large" shape="circle" onClick={this.loginThroughGithub} />
      </Modal>
    )
  }

}

export default Oauth
