import React from 'react'

import { hasClass, addClass, removeClass } from 'utils/tool'
import './index.scss'

const getParentDom = (child, tagName) => {
  while(child.tagName !== tagName) {
    child = child.parentNode
  }
  return child
}
const getDataset = (dom, prop) => {
  return dom.dataset[prop]
}
const exchangeSequence = (domA, domB) => {
  const thirdPart = domA.dataset.sequence
  domA.dataset.sequence = domB.dataset.sequence
  domB.dataset.sequence = thirdPart
}
const CANT_INSERT = 0
const INSERT_BEFORE = 1
const INSERT_AFTER = 2

export default class DraggableTable extends React.Component {

  // 被拖动元素
  dragged = null
  // 被覆盖元素
  over = null
  // 是否前插
  canInsert = CANT_INSERT

  dragStart = e => {
    this.dragged = e.target
  }
  dragOver = e => {
    e.preventDefault()

    const overDom = getParentDom(e.target, 'TR')
    !this.over && (this.over = overDom)
    const curSequence = getDataset(this.dragged, 'sequence')
    const lastOverSequence = getDataset(this.over, 'sequence')
    const overSequence = getDataset(overDom, 'sequence')
    const animation = curSequence > overSequence ? 'drag-up' : 'drag-down'

    if (overDom !== this.dragged) {
      if (overSequence !== lastOverSequence) {
        removeClass(this.over, 'drag-up')
        removeClass(this.over, 'drag-down')
        this.over = overDom
        !hasClass(this.over, animation) && addClass(this.over, animation)
      }
      this.canInsert = curSequence > overSequence ? INSERT_BEFORE : INSERT_AFTER
    } else {
      this.canInsert = CANT_INSERT
    }
  }
  dragEnd = e => {
    e.preventDefault()

    if (!this.over) return
    this.over.classList.remove('drag-up', 'drag-down')
    if (this.canInsert !== CANT_INSERT) {
      if (this.canInsert === INSERT_BEFORE) this.tbodyRef.insertBefore(this.dragged, this.over)
      if (this.canInsert === INSERT_AFTER) this.tbodyRef.insertBefore(this.dragged, this.over.nextSibling)
      exchangeSequence(this.over, this.dragged)
    }

    this.over = null
    this.dragged = null
  }

  render() {
    const { header, data } = this.props

    return (
      <table className='draggable-table'>
        <thead className='draggable-table-head'>
          <tr>
            {
              header.map((item, index) => {
                return (
                  <th key={index}>
                    <div className='title'>{item.title}</div>
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody
          className='draggable-table-body'
          onDragOver={this.dragOver}
          onDrop={this.dragEnd}
          ref={(ref) => this.tbodyRef = ref}
        >
          {
            data.map((row, index) => {
              return (
                <tr
                  key={index}
                  draggable
                  data-sequence={row.sequence}
                  onDragStart={this.dragStart}
                >
                  {
                    header.map((item, index) => {
                      return (
                        <td key={index}>
                          <span className='cell'>{item.handler ? item.handler(row[item.key]) : row[item.key]}</span>
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }

}
