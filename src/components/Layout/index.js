import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import 'antd/dist/antd.less'

import Sprint from 'pages/Sprint'
import Lane from 'pages/Lane'
import RightMenu from 'components/RightMenu'
import './index.scss'

const { Header, Content, Sider } = Layout

export default class AppLayout extends Component {

  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 1</Menu.Item>
            <Menu.Item key="3">nav 1</Menu.Item>
          </Menu>
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
        <RightMenu/>
      </Layout>
    )
  }

}

