import React, { Component } from 'react'
import {
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  InputNumber
} from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RangePicker = DatePicker.RangePicker

const getFormComponent = ({ type = 'input', ...options }) => {
  switch (type) {
    case 'select':
      return (
        <Select {...options}>
          { options.list.map(i => <Option key={i.value}>{i.label}</Option>) }
        </Select>
      )
    case 'radio':
      return (
        <RadioGroup name={options.name}>
          { options.list.map(radio => <Radio value={radio.value}>{radio.label}</Radio>) }
        </RadioGroup>
      )
    case 'date-picker':
      return <RangePicker {...options} />
    case 'input-number':
      return <InputNumber {...options} />
    default:
      return <Input {...options} />
  }
}

const renderFormItem = (config, getFieldDecorator) => {
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
