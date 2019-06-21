import React, { Component } from 'react'
import {
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  InputNumber,
  AutoComplete,
  Divider
} from 'antd'

import emitter from 'utils/events'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

class LiteForm extends Component {

  state = {
    autoCompleteData: []
  }

  getFormComponent = ({ type = 'input', ...options }) => {
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
      case 'auto-complete':
        return (
          <AutoComplete {...options}>
            {
              this.state.autoCompleteData.length
                ? this.state.autoCompleteData.map(user => (
                  <Option key={user._id} value={user._id} disabled={!!user.belong} info={user.name}>
                    <span>{user.name}</span>
                    <Divider type='vertical'/>
                    <span>{user.email}</span>
                  </Option>
                ))
                : <AutoComplete.Option key="none" disabled>暂无可选择的用户</AutoComplete.Option>
            }
          </AutoComplete>
        )
      case 'date-picker':
        return <RangePicker {...options} />
      case 'input-number':
        return <InputNumber {...options} />
      case 'input-area':
        return <TextArea {...options}/>
      default:
        return <Input {...options} />
    }
  }

  renderFormItem = (config, getFieldDecorator) => {
    const { componentOptions, ...formItemOptions } = config
    const { rules, key, label, initialValue, ...options } = formItemOptions

    return (
      <FormItem key={key} label={label} {...options}>
        { getFieldDecorator(key, { rules, initialValue })(this.getFormComponent(componentOptions)) }
      </FormItem>
    )
  }

  componentDidMount() {
    emitter.on('autoCompleteDataChange', data => {
      this.setState({ autoCompleteData: data })
    })
  }

  render() {
    const { formList = [], form: { getFieldDecorator } } = this.props

    return (
      <Form>
        {formList.map(config => this.renderFormItem(config, getFieldDecorator))}
      </Form>
    )
  }

}

export default Form.create()(LiteForm)
