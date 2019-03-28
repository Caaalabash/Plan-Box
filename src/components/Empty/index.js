import React, { Component } from 'react'
import { Empty } from 'antd'
import { inject, observer } from 'mobx-react'

@inject('userStore')
@observer
class MyEmpty extends Component {

  render() {
    const { userStore, description } = this.props
    const label = description
      ? description
      : userStore.isLogin
        ? '暂无更多数据'
        : '登录后可见'
    return (
      <Empty description={label}/>
    )
  }

}

export default MyEmpty
