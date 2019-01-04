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

import './index.scss'
import TaskCard from '../TaskCard'
import MockCardData from '../../assets/mock/TaskCard'

const Panel = Collapse.Panel

export default class Sprint extends React.Component {

  componentDidMount() {
    const dragStart$ = fromEvent(document, 'dragstart')
    const drop$ = fromEvent(document, 'drop')
    const dragOver$ = fromEvent(document, 'dragover')
    const dragEnter$ = fromEvent(document, 'dragenter')
    const dragLeave$ = fromEvent(document, 'dragleave')
    this.sub = new Subscription()
    const canDrop = e => e.target.classList.contains('task-column')

    const enterSub = dragEnter$.pipe(
      merge(dragLeave$),
      filter(canDrop),
      tap(e => e.target.classList.toggle('dragover'))
    )
    .subscribe()

    const overSub = dragOver$.pipe(
      filter(canDrop),
      tap(e => e.preventDefault())
    )
    .subscribe()

    const startSub = dragStart$.pipe(
      pluck('target'),
      switchMap(origin => {
        return drop$.pipe(
          take(1),
          pluck('target'),
          tap(target => {
            origin.parentNode.removeChild(origin)
            target.appendChild(origin)
            target.classList.remove('dragover')
          })
        )
      })
    )
    .subscribe()

    this.sub.add(enterSub)
    this.sub.add(overSub)
    this.sub.add(startSub)
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
            <div className="task-column">
              <TaskCard {...MockCardData} />
            </div>
            <div className="task-column"> </div>
            <div className="task-column"> </div>
            <div className="task-column"> </div>
            <div className="task-column"> </div>
          </div>
        </Panel>
      </Collapse>
    )
  }

}
