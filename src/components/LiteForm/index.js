import React, { Component } from 'react'
import { Form, Input, Radio, Select, DatePicker } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RangePicker = DatePicker.RangePicker

const getFormComponent = ({ type = 'input', ...options }) => {
  let result = null
  // 默认为input组件
  if (type === 'input') {
    result = <Input {...options} />
  }
  // 对于Select组件, 需要其中有list字段
  else if(type === 'select' && options.list) {
    result = (
      <Select {...options}>
        { options.list.map(i => <Option key={i.value}>{i.label}</Option>) }
      </Select>
    )
  }
  // 对于Radio组件, 需要有name属性以及list字段
  else if(type === 'radio' && options.list && options.name) {
    result = (
      <RadioGroup name={options.name}>
        { options.list.map(radio => <Radio value={radio.value}>{radio.label}</Radio>) }
      </RadioGroup>
    )
  }
  // DatePicker组件
  else if(type === 'datepicker') {
    result = <RangePicker {...options}/>
  }
  return result
}

const renderFormItem = (config, getFieldDecorator) => {
  // 分别获得给具体表单组件提供的选项, 给FormItem提供的选项
  const { componentOptions, ...formItemOptions } = config
  const { rules, key, label, initialValue, ...options } = formItemOptions

  return (
    <FormItem key={key} label={label} {...options}>
      { getFieldDecorator(key, { rules, initialValue })(getFormComponent(componentOptions)) }
    </FormItem>
  )
}

class LiteForm extends Component {

  render() {
    const { formList, form: { getFieldDecorator } } = this.props

    return (
      <Form>
        {formList.map(config => renderFormItem(config, getFieldDecorator))}
      </Form>
    )
  }

}

export default Form.create()(LiteForm)
