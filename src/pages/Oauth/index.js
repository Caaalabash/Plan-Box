import React from 'react'
import Service from 'service'

import { parseQueryParams } from 'utils/tool'

export default class Lane extends React.Component {

  componentDidMount() {
    const { code } = parseQueryParams(window.location.search)
    if (code) {
      Service.getGithubInfo({ code }).then(res => {
        if (!res.code) {
          localStorage.setItem('plan-box-userinfo', JSON.stringify(res.data))
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