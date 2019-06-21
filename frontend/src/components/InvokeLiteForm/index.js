import React, { Component } from 'react'
import { Modal } from 'antd'

import emitter from 'utils/events'
import LiteForm from 'components/LiteForm'

const noop = () => {}

/**
 * 全局创建表单组件, 通过 EventBus 的 "invokeLiteForm" 事件触发
 * invokeLiteForm传递数据包括如下四个参数:
 *   formTitle: 表单标题
 *   formContent: 表单内容
 *   onOk: 提交表单处理函数, 接受两个参数
 *     params: 通过验证表单的数据对象
 *     done: 关闭弹窗的控制权
 *   onCancel: 关闭表单处理函数
 */
class InvokeLiteForm extends Component {

  formTitle = null
  formContent = null
  onOK = null
  onCancel = null

  state = {
    modalVisible: false
  }

  toggleVisible = status => this.setState({ modalVisible: status })

  invokeModalOk = () => {
    const form = this.formRef.props.form
    const done = () => this.toggleVisible(false)
    form.validateFields(async (e, params) => {
      if (e) return
      this.onOK(params, done)
    })

  }
  invokeModalCancel = () => {
    this.toggleVisible(false)
    this.onCancel()
  }

  componentDidMount() {
    emitter.on('invokeLiteForm', ({ formTitle, formContent, onOk = noop, onCancel = noop }) => {
      this.formTitle = formTitle
      this.formContent = formContent
      this.onOK = onOk
      this.onCancel = onCancel
      this.toggleVisible(true)
    })
  }

  render() {
    const { modalVisible } = this.state
    return (
      <Modal
        destroyOnClose
        title={this.formTitle}
        visible={modalVisible}
        onOk={this.invokeModalOk}
        onCancel={this.invokeModalCancel}
      >
        <LiteForm formList={this.formContent} wrappedComponentRef={ref => {this.formRef = ref}}/>
      </Modal>
    )
  }

}

export default InvokeLiteForm
