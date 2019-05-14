import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Icon } from 'antd'
import { inject, observer } from 'mobx-react'

import 'antd/dist/antd.less'
import './index.scss'
import emitter from 'utils/events'
import Sprint from 'pages/Sprint'
import Lane from 'pages/Lane'
import WorkOrder from 'pages/WorkOrder'
import Team from 'pages/Team'
import Backlog from 'pages/Backlog'
import RightMenu from 'components/RightMenu'
import Oauth from 'components/Oauth'
import InvokeLiteForm from 'components/InvokeLiteForm'

const { Header, Content, Sider } = Layout

@inject('userStore')
@observer
class AppLayout extends Component {

  state = {
    oauthModalVisible: false,
  }

  toggleModal = status => {
    this.setState({ oauthModalVisible: status })
  }

  handleLogout = () => emitter.emit('logout')

  render() {
    const { oauthModalVisible } = this.state
    const { userStore, history } = this.props
    const { pathname } = history.location

    const menu = (
      <Menu>
        <Menu.Item onClick={this.handleLogout}>Logout</Menu.Item>
      </Menu>
    )

    return (
      <Layout className="c-layout">
        <Header className="c-layout-header">
          {
            userStore.isLogin
              ? (<Dropdown overlay={menu}>
                  <Avatar
                    className={ userStore.isConnect ? "c-layout-avatar online" : "c-layout-avatar offline" }
                    size={32}
                    src={userStore.user.avatar_url}
                    alt={userStore.user.name}
                  />
                </Dropdown>)
              : <Avatar className="c-layout-avatar" size={32} icon="user" onClick={this.toggleModal.bind(this, true)}/>
          }
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[pathname]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="/team">
                <Icon type="team" />
                <Link to="/team" style={{ display: 'inline-block' }}>Team</Link>
              </Menu.Item>
              <Menu.Item key="/backlog">
                <Icon type="file-search" />
                <Link to="/backlog" style={{ display: 'inline-block' }}>Backlog</Link>
              </Menu.Item>
              <Menu.Item key="/sprint">
                <Icon type="calendar" />
                <Link to="/sprint" style={{ display: 'inline-block' }}>Sprint</Link>
              </Menu.Item>
              <Menu.Item key="/lane">
                <Icon type="ordered-list" />
                <Link to="/lane" style={{ display: 'inline-block' }}>Lane</Link>
              </Menu.Item>
              <Menu.Item key="/workorder">
                <Icon type="form" />
                <Link to="/workorder" style={{ display: 'inline-block' }}>WorkOrder</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
              <Route path="/sprint" component={Sprint} />
              <Route path="/lane" component={Lane} />
              <Route path="/workorder" component={WorkOrder} />
              <Route path="/team" component={Team} />
              <Route path="/backlog" component={Backlog} />
            </Content>
          </Layout>
        </Layout>
        <Oauth visible={oauthModalVisible} toggleModal={this.toggleModal} />
        <InvokeLiteForm />
        <RightMenu />
      </Layout>
    )
  }

}
export default AppLayout
