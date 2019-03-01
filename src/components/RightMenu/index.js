import React from 'react'

import emitter from 'utils/events'
import './index.scss'

export default class RightMenu extends React.Component {

  state = {
    visible: false,
    customMenu: [],
  }

  componentDidMount() {
    emitter.addListener('contextmenu', e => {
      this.setState({ visible: true, customMenu: e.customMenu }, this._handleContextMenu(e))
    })
    document.body.addEventListener('click', this._handleClick)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this._handleClick)
  }

  _handleContextMenu = event => {
    // 获得点击位置, 视窗高度, 菜单宽高
    const clickX = event.clientX
    const clickY = event.clientY
    const screenW = window.innerWidth
    const screenH = window.innerHeight
    const rootW = this.root.offsetWidth
    const rootH = this.root.offsetHeight
    // 判断空间是否充足
    const right = (screenW - clickX) > rootW
    const left = !right
    const top = (screenH - clickY) > rootH
    const bottom = !top
    // 定位
    if (right) this.root.style.left = `${clickX + 5}px`
    if (left) this.root.style.left = `${clickX - rootW - 5}px`
    if (top) this.root.style.top = `${clickY + 5}px`
    if (bottom) this.root.style.top = `${clickY - rootH - 5}px`
  }

  _handleClick = (event) => {
    const clickInside = this.root === event.target || this.root.contains(event.target)
    if (clickInside) {
      console.log('inside')
    } else {
      this.setState({ visible: false })
    }
  }

  render() {
    const { visible, customMenu } = this.state

    return (
      <div className={visible ? 'contextMenu contextMenu__visible' : 'contextMenu'} ref={ref => this.root = ref}>
        {
          customMenu.map((menuItem, index) => {
            return <div className="contextMenu--option" onClick={menuItem.handler} key={index}>{ menuItem.title }</div>
          })
        }
      </div>
    )
  }
}
