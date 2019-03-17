import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { Layout, Menu, Avatar } from 'antd'
import { Provider, observer } from 'mobx-react'
import 'antd/dist/antd.less'

import userStore from 'store/userStore'
import Sprint from 'pages/Sprint'
import Lane from 'pages/Lane'
import RightMenu from 'components/RightMenu'
import Oauth from 'components/Oauth'
import './index.scss'

const { Header, Content, Sider } = Layout

@observer
class AppLayout extends Component {
  state = {
    oauthModalVisible: false,
  }

  toggleModal = status => {
    this.setState({
      oauthModalVisible: status
    })
  }
  render() {
    const { oauthModalVisible }  = this.state
    return (
      <Provider userStore={userStore}>
        <Layout className="c-layout">
          <Header className="c-layout-header">
            {
              userStore.isLogin
                ? <Avatar className="c-layout-avatar" size={32} src={userStore.user.avatar_url} />
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
              <Content style={{
                background: '#fff', padding: 24, margin: 0, minHeight: 280,
              }}
              >
                <Route path="/sprint" component={Sprint} />
                <Route path="/lane" component={Lane} />
              </Content>
            </Layout>
          </Layout>
          <Oauth visible={oauthModalVisible} toggleModal={this.toggleModal} userStore={userStore}/>
          <RightMenu/>
        </Layout>
      </Provider>
    )
  }

}
export default AppLayout
