import React from 'react'
import { Collapse } from 'antd'
import { fromEvent, Subscription } from 'rxjs'
import {
  pluck,
  filter,
  merge,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'

import TaskCard from 'components/TaskCard'
import { restrictDropDistance } from 'utils/tool'
import SwimPool from 'assets/mock/SwimPool'
import './index.scss'

const Panel = Collapse.Panel

export default class Sprint extends React.Component {

  state = {
    dropArr: [],
  }

  componentDidMount() {
    const dragStart$ = fromEvent(document, 'dragstart')
    const dragEnd$ = fromEvent(document, 'dragend')
    const drop$ = fromEvent(document, 'drop')
    const dragOver$ = fromEvent(document, 'dragover')
    const dragEnter$ = fromEvent(document, 'dragenter')
    const dragLeave$ = fromEvent(document, 'dragleave')
    const canDrop = e => e.target.classList.contains('can-drop')
    this.sub = new Subscription()

    // 拖动开始流
    const startSub = dragStart$.pipe(
      // 根据拖动目标所在泳道获得可拖动范围, 设置dropArr state
      tap(e => {
        console.log()
        this.setState({
          dropArr: restrictDropDistance(e)
        })
      }),
      // 结合drop$流移动节点
      pluck('target'),
      switchMap(origin => {
        return drop$.pipe(
          take(1),
          pluck('target'),
          tap(target => {
            origin.parentNode.removeChild(origin)
            target.appendChild(origin)
          })
        )
      })
    ).subscribe()

    // 拖动结束流: 重置 dropArr state
    const endSub = dragEnd$.pipe(
      tap(() => {
        this.setState({
          dropArr: []
        })
      })
    ).subscribe()

    // 设定类似于hover样式
    const enterSub = dragEnter$.pipe(
      merge(dragLeave$),
      filter(canDrop),
      tap(e => e.target.classList.toggle('dragover'))
    ).subscribe()

    // 设定可释放范围
    const overSub = dragOver$.pipe(
      filter(canDrop),
      tap(e => e.preventDefault())
    ).subscribe()

    this.sub.add(enterSub)
    this.sub.add(overSub)
    this.sub.add(startSub)
    this.sub.add(endSub)
  }

  componentWillUnmount() {
    this.sub.unsubscribe()
  }

  render() {
    const { header } = this.props

    return (
      <Collapse defaultActiveKey={['1']}>
        <Panel header={header} key="1">
          <ul className="task-header">
            <li className="task-progress">待开发</li>
            <li className="task-progress">开发中</li>
            <li className="task-progress">待测试</li>
            <li className="task-progress">测试中</li>
            <li className="task-progress">已完成</li>
          </ul>
          <div className="task-content">
            {
              SwimPool.swimlane.map(obj => {
                const dynamicClassName = ~this.state.dropArr.indexOf(obj.key) ? 'can-drop' : ''
                return (
                  <div
                    className={`${dynamicClassName} task-column`}
                    key={obj.key}
                    data-column-key={obj.key}
                  >
                    {
                      obj.task.map(o => <TaskCard key={o.taskId} {...o} />)
                    }
                  </div>
                )
              })
            }
          </div>
        </Panel>
      </Collapse>
    )
  }

}
