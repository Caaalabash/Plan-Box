import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import { inject, observer } from 'mobx-react'

import emitter from 'utils/events'
import Service from 'service'

@inject('userStore')
@inject('sprintStore')
@observer
class Oauth extends Component {

  client_id = 'a6ff9b81a63fdfb211e4'

  loginThroughGithub = () => {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${this.client_id}&scope=user:email`,
      '_blank',
      'width=600,height=400,menubar=no,toolbar=no,location=no'
    )
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
    window.addEventListener('storage', async event => {
      if (event.key === 'isLogin') {
        await this.init()
        this.props.toggleModal(false)
        localStorage.removeItem('isLogin')
      }
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
