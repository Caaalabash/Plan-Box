export default [
  {
    key: 'id',
    label: '当前周期',
    initialValue: '',
    rules: [
      { required: true, message: '请输入当前Sprint名称' }
    ],
    componentOptions: {
      type: 'input',
      placeholder: 'Sprint1'
    },
  },
  {
    key: 'title',
    label: 'Sprint摘要',
    initialValue: '',
    rules: [
      { required: true, message: '请输入当前Sprint摘要' }
    ],
    componentOptions: {
      type: 'input',
      placeholder: 'XX 团队 Sprint7',
    },
  },
  {
    key: 'desc',
    label: 'Sprint描述',
    initialValue: '',
    rules: [],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'range',
    label: '起始时间',
    initialValue: '',
    rules: [
      { required: true, message: '请选择时间范围' }
    ],
    componentOptions: {
      type: 'datepicker',
      size: 'default'
    },
  },
]
