export const createSprintFormConfig = (sprintDefault = {}) => [
  {
    key: 'title',
    label: 'Sprint标题',
    initialValue: sprintDefault.title || '',
    rules: [
      { required: true, message: '请输入当前Sprint标题' }
    ],
    componentOptions: {
      type: 'input',
      placeholder: 'XX 团队 Sprint7',
    },
  },
  {
    key: 'pm',
    label: '负责人',
    initialValue: sprintDefault.team ? sprintDefault.team.pm : '',
    rules: [
      { required: true, message: '请指定背锅位' }
    ],
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
      type: 'date-picker',
      size: 'default'
    },
  },
  {
    key: 'desc',
    label: 'Sprint描述',
    initialValue: sprintDefault.desc || '',
    rules: [],
    componentOptions: {
      type: 'input',
    },
  },
]

export const taskFormConfig = [
  {
    key: 'title',
    label: '任务主题',
    initialValue: '',
    rules: [
      { required: true, message: '请输入任务标题' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'storyPoint',
    label: '任务故事点',
    initialValue: 0,
    rules: [
      { required: true, message: '请输入任务故事点' }
    ],
    componentOptions: {
      type: 'input-number',
      min: 0,
    },
  },
  {
    key: 'priority',
    label: '任务紧急程度',
    initialValue: '0',
    rules: [],
    componentOptions: {
      type: 'select',
      list: [
        { label: '建议', value: '0' },
        { label: '低优先级', value: '1' },
        { label: '高优先级', value: '2' },
        { label: '致命', value: '3' },
      ]
    },
  },
  {
    key: 'rd',
    label: '相关开发',
    initialValue: '',
    rules: [
      { required: true, message: '请指定开发' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'qa',
    label: '相关测试',
    initialValue: '',
    rules: [
      { required: true, message: '请指定测试' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'pm',
    label: '相关产品',
    initialValue: '',
    rules: [
      { required: true, message: '请指定产品' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'desc',
    label: '任务描述',
    initialValue: '',
    rules: [],
    componentOptions: {
      type: 'input',
    },
  },
]
