import React from 'react'

import './index.scss'

const getParentDom = (child, tagName) => {
  while(child.tagName !== tagName) {
    child = child.parentNode
  }
  return child
}

export default class DraggableTable extends React.Component {

  dragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.id)
    e.dropEffect = 'move'
    this.dragged = e.target
  }
  dragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    const overDom = getParentDom(e.target, 'TR')
    const curSequence = this.dragged.dataset.sequence
    const overSequence = overDom.dataset.sequence
    const animation = curSequence > overSequence ? 'drag-up' : 'drag-down'

    if (this.over && this.over.dataset.sequence !== overDom.dataset.sequence) {
      this.over.classList.remove('drag-up', 'drag-down')
    }

    if (!overDom.classList.contains(animation)) {
      overDom.classList.add(animation)
      this.over = overDom
    }
  }
  dragEnd = e => {
    e.preventDefault()

    const endDom = getParentDom(e.target, 'TR')
    const insertDom = document.getElementById(e.dataTransfer.getData("text/plain"))

    this.tbodyRef.insertBefore(insertDom, endDom)
    this.over.classList.remove('drag-up', 'drag-down')
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
                  id={`drag-tr${row.sequence}`}
                  key={index}
                  draggable="true"
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
