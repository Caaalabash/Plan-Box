import React from 'react'
import Service from 'service'

import { parseQueryParams } from 'utils/tool'

export default class Lane extends React.Component {

  componentDidMount() {
    const { code } = parseQueryParams(window.location.search)
    if (code) {
      Service.getGithubInfo({ code }).then(res => {
        if (!res.errno) {
          localStorage.setItem('plan-box-userinfo', JSON.stringify(res.data))
        } else {
          alert('登录失败')
        }
        window.close()
      })
    }
  }

  render() {
    return (
      <div>正在登录</div>
    )
  }
}
