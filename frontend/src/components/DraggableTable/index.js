import React from 'react'
import { withRouter } from "react-router-dom"
import { inject } from 'mobx-react'

import emitter from 'utils/events'
import {
  hasClass,
  addClass,
  removeClass,
  getParentDom,
  getDataset,
  calculateSequence,
  translatePriority
} from 'utils/tool'
import './index.scss'

const INSERT_BEFORE = 1
const INSERT_AFTER = 2
const TableHeader = [
  { title: '子任务', key: 'title' },
  { title: '任务描述', key: 'desc' },
  { title: '故事点', key: 'storyPoint' },
  { title: '优先级', key: 'priority', handler: translatePriority },
  { title: '负责人', key: 'responsible', handler: getResponsible }
]
function getResponsible(val) {
  const member = this.props.userStore.teamMember.find(member => member._id === val)
  return member ? member.name : '[该成员不在团队内]'
}

@inject('userStore')
class DraggableTable extends React.Component {

  // 被拖动元素
  dragged = null
  // 被覆盖元素
  over = null
  // 是否前插
  insertLocation = INSERT_BEFORE
  // 排序记录
  sort = null
  // 拖动开始, 记录被拖拽的元素
  dragStart = e => {
    this.dragged = e.target
  }
  // 当被拖动元素在目的地元素内时触发
  dragOver = e => {
    e.preventDefault()

    const overDom = getParentDom(e.target, 'tagName', 'TR')
    // 当为自身是直接返回
    if (overDom === this.dragged) return
    // 当所属区域不同时直接返回
    if (getDataset(this.dragged, 'belong') !== getDataset(overDom, 'belong')) return
    // 获取拖拽方向
    const overSequence = getDataset(overDom, 'sequence')
    const curSequence = getDataset(this.dragged, 'sequence')
    const animation = curSequence > overSequence ? 'drag-up' : 'drag-down'
    // 判定插入方向
    this.insertLocation = curSequence > overSequence ? INSERT_BEFORE : INSERT_AFTER
    // 初始化 over
    if (!this.over) {
      addClass(overDom, animation)
      this.over = overDom
    } else {
      const lastOverSequence = getDataset(this.over, 'sequence')
      // 当被覆盖元素改变了, 移除旧dom样式, 添加到新dom上
      if (overSequence !== lastOverSequence) {
        removeClass(this.over, 'drag-up', 'drag-down')
        this.over = overDom
        !hasClass(this.over, animation) && addClass(this.over, animation)
      }
    }
  }
  // 在拖动操作完成时触发
  dragEnd = e => {
    e.preventDefault()

    if (!this.over || !this.dragged) return
    removeClass(this.over, 'drag-up', 'drag-down')
    if (this.insertLocation === INSERT_BEFORE) this.tbodyRef.insertBefore(this.dragged, this.over)
    if (this.insertLocation === INSERT_AFTER) this.tbodyRef.insertBefore(this.dragged, this.over.nextSibling)

    const newSeq = calculateSequence(this.dragged, this.insertLocation === INSERT_BEFORE)
    const id = getDataset(this.dragged, 'id')
    this.dragged.dataset.sequence = newSeq
    this.over = null
    this.dragged = null
    this.props.onDrop(id, newSeq)
  }
  // 打开右键菜单
  openContextMenu = (e, _id, relateId) => {
    e.preventDefault()

    e.customMenu = [
      {
        title: '查看',
        handler: () => {
          this.props.history.push(`/lane?relateId=${relateId}`)
        }
      },
      {
        title: '删除',
        handler: () => {
          this.props.onDelete(_id, relateId)
        }
      }
    ]
    emitter.emit('contextmenu', e)
  }

  render() {
    const { data, belong } = this.props

    return (
      <table className='draggable-table'>
        <thead className='draggable-table-head'>
          <tr>
            {
              TableHeader.map((item, index) => {
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
          ref={(ref) => this.tbodyRef = ref}
        >
          {
            data.map((row, index) => {
              return (
                <tr
                  key={index}
                  draggable
                  data-sequence={row.sequence}
                  data-belong={belong}
                  data-id={row._id}
                  onDragStart={this.dragStart}
                  onDragEnd={this.dragEnd}
                  onContextMenu={ e => this.openContextMenu.call(this, e, row._id, belong)}
                >
                  {
                    TableHeader.map((item, index) => {
                      return (
                        <td key={index}>
                          <span className='cell'>{item.handler ? item.handler.call(this, row[item.key]) : row[item.key]}</span>
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

export default withRouter(DraggableTable)
