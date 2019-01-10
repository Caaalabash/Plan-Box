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
    key: 'desc',
    label: 'Sprint描述',
    initialValue: sprintDefault.desc || '',
    rules: [],
    componentOptions: {
      type: 'input',
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
      type: 'datepicker',
      size: 'default'
    },
  },
]
