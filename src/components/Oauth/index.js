import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import { observer } from 'mobx-react'

@observer
class Oauth extends Component {

  client_id = 'a6ff9b81a63fdfb211e4'

  loginThroughGithub = () => {
    window.open(`https://github.com/login/oauth/authorize?client_id=${this.client_id}&scope=user:email`, '_blank','width=600,height=400,menubar=no,toolbar=no,location=no')
  }

  componentDidMount() {
    window.addEventListener('storage', event => {
      if (event.key === 'plan-box-userinfo') {
        this.props.userStore.setUser(JSON.parse(event.newValue))
      }
    })
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
