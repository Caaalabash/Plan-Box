import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import Service from 'service'

import { parseQueryParams } from 'utils/tool'

export default class Oauth extends Component {

  client_id = 'a6ff9b81a63fdfb211e4'

  loginThroughGithub = () => {
    window.open(`https://github.com/login/oauth/authorize?client_id=${this.client_id}&scope=user:email`)
  }
  getAcessToken = () => {

  }

  componentDidMount() {
    console.log(parseQueryParams(window.location.search))
    Service.getGithubInfo()
  }

  render() {
    const { visible, toggleModal } = this.props
    return (
      <Modal title="第三方登录" visible={visible} onOk={() => toggleModal(false)} onCancel={() => toggleModal(false)}>
       <Button icon="github" type="default" size="large" shape="circle" onClick={this.loginThroughGithub}></Button>
      </Modal>
    )
  }

}
