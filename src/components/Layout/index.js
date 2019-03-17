import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { Layout, Menu, Avatar } from 'antd'
import { inject, observer } from 'mobx-react'

import 'antd/dist/antd.less'
import './index.scss'
import Sprint from 'pages/Sprint'
import Lane from 'pages/Lane'
import RightMenu from 'components/RightMenu'
import Oauth from 'components/Oauth'

const { Header, Content, Sider } = Layout

@inject('store')
@observer
class AppLayout extends Component {

  state = {
    oauthModalVisible: false,
  }

  toggleModal = status => {
    this.setState({ oauthModalVisible: status })
  }

  render() {
    const { oauthModalVisible }  = this.state
    const { user } = this.props.store
    return (
      <Layout className="c-layout">
        <Header className="c-layout-header">
          {
            user.isLogin
              ? <Avatar className="c-layout-avatar" size={32} src={user.avatar_url} />
              : <Avatar className="c-layout-avatar" size={32} icon="user" onClick={this.toggleModal.bind(this, true)}/>
          }
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1">
                <Link to="/sprint">Sprint</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/lane">Lane</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
              <Route path="/sprint" component={Sprint} />
              <Route path="/lane" component={Lane} />
            </Content>
          </Layout>
        </Layout>
        <Oauth visible={oauthModalVisible} toggleModal={this.toggleModal} />
        <RightMenu/>
      </Layout>
    )
  }

}
export default AppLayout
