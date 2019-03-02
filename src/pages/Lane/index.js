import React from 'react'
import { Collapse, Modal } from 'antd'
import { fromEvent, Subscription } from 'rxjs'
import {
  pluck,
  filter,
  merge,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'

import Service from 'service'
import emitter from 'utils/events'
import TaskCard from 'components/TaskCard'
import LiteForm from 'components/LiteForm'
import { restrictDropDistance, parseQueryParams } from 'utils/tool'
import { issueFormConfig } from 'assets/config/form'
import './index.scss'

const Panel = Collapse.Panel

export default class Lane extends React.Component {

  state = {
    dropArr: [],
    taskList: [],
    open: null,
    relateId: null,
    modelVisible: false,
  }
  taskId = null
  formContent = issueFormConfig
  columnIndex = [0, 1, 2, 3, 4]

  componentDidMount() {
    const { relateId, open } = parseQueryParams(this.props.history.location.search)

    Service.getTaskBySprintId(relateId).then(tasks => {
      this.setState({
        taskList: tasks,
        open,
        relateId,
      })
    })

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

  toggleModule = status => {
    this.setState({ modelVisible: status })
  }
  handleSubmit = () => {
    const form = this.formRef.props.form
    form.validateFields(async (e, value) => {
      if (e) return
      await Service.setIssue({ taskId: this.taskId, ...value})
      this.toggleModule(false)
    })
  }
  handleContextMenu = (e, taskId) => {
    e.preventDefault()
    e.customMenu = [
      {
        title: '创建Issue',
        handler: () => {
          this.toggleModule(true)
        }
      }
    ]
    this.taskId = taskId
    emitter.emit('contextmenu', e)
  }

  render() {
    const { taskList, open, modelVisible } = this.state
    const createHeader = task => (
      <div className="pane-header" onContextMenu={e => this.handleContextMenu.call(this, e, task._id)}>
        <span>{task.title}</span>
      </div>
    )
    return (
      <div className="lane-layout">
        {
          open && <Collapse defaultActiveKey={[open]}>
            {
              taskList.length && taskList.map(task => (
                <Panel header={createHeader(task)} key={task._id}>
                  <ul className="task-header">
                    <li className="task-progress">待开发</li>
                    <li className="task-progress">开发中</li>
                    <li className="task-progress">待测试</li>
                    <li className="task-progress">测试中</li>
                    <li className="task-progress">已完成</li>
                  </ul>
                  <div className="task-content">
                    {
                      this.columnIndex.map(index => {
                        const dynamicClassName = ~this.state.dropArr.indexOf(index.toString()) ? 'can-drop' : ''
                        return (
                          <div
                            className={`${dynamicClassName} task-column`}
                            key={index}
                            data-column-key={index}
                          >
                            {
                              task.issue
                                .filter(issue => +issue.status === index)
                                .map(issue => <TaskCard key={issue._id} issue={issue} />)
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </Panel>
              ))
            }
          </Collapse>
        }
        <Modal
          title="创建子任务"
          destroyOnClose
          visible={modelVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleModule.bind(this, false)}
        >
          <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
        </Modal>
      </div>
    )
  }

}
