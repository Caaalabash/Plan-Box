/**
 * 创建/更新Sprint表单配置
 * 1. Sprint标题
 * 2. Sprint描述
 * 3. Sprint负责人: 从团队Team中选择
 * 4. Sprint起止时间
 * @param {object} sprintDefault sprint初始值, 用于修改Sprint信息
 * @param {array} responsibleList 负责人下拉列表
 * @return {array} 表单配置
 */
export const createSprintForm = (sprintDefault = {}, responsibleList) => [
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
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'responsible',
    label: 'Sprint负责人',
    initialValue: sprintDefault.responsible || '',
    rules: [
      { required: true, message: '请指定背锅位' }
    ],
    componentOptions: {
      type: 'select',
      list: responsibleList
    },
  },
  {
    key: 'range',
    label: 'Sprint起止时间',
    initialValue: '',
    rules: [
      { required: true, message: '请选择时间范围' }
    ],
    componentOptions: {
      type: 'date-picker',
      size: 'default'
    },
  },

]
/**
 * 创建子任务表单
 * 1. 任务主题
 * 2. 任务描述
 * 3. 任务故事点
 * 4. 任务紧急程度
 * 5. 相关开发
 * 6. 相关产品
 * 7. 相关测试
 * @param {array} responsibleList 成员列表
 * @return {array} 表单配置
 */
export const createTaskForm = responsibleList => [
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
    key: 'desc',
    label: '任务描述',
    initialValue: '',
    rules: [],
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
        { label: '重要', value: '1' },
        { label: '紧急', value: '2' },
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
      type: 'select',
      list: responsibleList
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
      type: 'select',
      list: responsibleList
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
      type: 'select',
      list: responsibleList
    },
  },
]
export const createBacklogForm = (backlog = {}) => [
  {
    key: 'title',
    label: '任务主题',
    initialValue: backlog.title || '',
    rules: [
      { required: true, message: '请输入任务标题' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'desc',
    label: '任务描述',
    initialValue: backlog.desc || '',
    rules: [],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'priority',
    label: '任务紧急程度',
    initialValue: isNaN(backlog.priority) ? '0' : '' + backlog.priority,
    rules: [],
    componentOptions: {
      type: 'select',
      list: [
        { label: '建议', value: '0' },
        { label: '重要', value: '1' },
        { label: '紧急', value: '2' },
        { label: '致命', value: '3' },
      ]
    },
  },
]

/**
 * 创建Issue表单配置
 * 1. Issue标题
 * 2. Issue描述
 * 3. Issue紧急程度
 * 4. Issue类型: 是否为bug
 * 5. Issue状态: 初始状态可以选择为待开发 or 开发中
 * 6. Issue预估耗费时间: 单位为小时, 最少为1小时
 * 7. Issue实际用时: 单位为小时
 * 8. Issue负责人, 负责人应该可以从团队成员列表中选择
 * @param {array} responsibleList 负责人下拉列表
 * @return {array} Issue表单配置
 */
export const createIssueForm = responsibleList => [
  {
    key: 'title',
    label: 'Issue标题',
    initialValue: '',
    rules: [
      { required: true, message: '请输入Issue标题' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'desc',
    label: 'Issue描述',
    initialValue: '',
    rules: [],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'priority',
    label: 'Issue紧急程度',
    initialValue: '0',
    rules: [],
    componentOptions: {
      type: 'select',
      list: [
        { label: '建议', value: '0' },
        { label: '重要', value: '1' },
        { label: '紧急', value: '2' },
        { label: '致命', value: '3' },
      ]
    },
  },
  {
    key: 'issueType',
    label: 'Issue类型',
    initialValue: '0',
    rules: [],
    componentOptions: {
      type: 'select',
      list: [
        { label: 'bug', value: 'bug' },
        { label: 'issue', value: 'issue' },
      ]
    },
  },
  {
    key: 'status',
    label: 'Issue状态',
    initialValue: '0',
    rules: [],
    componentOptions: {
      type: 'select',
      list: [
        { label: '待开发', value: '0' },
        { label: '开发中', value: '1' },
      ]
    },
  },
  {
    key: 'time',
    label: '预估耗费时间 (单位为小时)',
    initialValue: 1,
    rules: [],
    componentOptions: {
      type: 'input-number',
      min: 1,
    },
  },
  {
    key: 'usedTime',
    label: '实际开发时间 (单位为小时)',
    initialValue: 0,
    rules: [],
    componentOptions: {
      type: 'input-number',
      min: 0,
    },
  },
  {
    key: 'responsible',
    label: '负责人',
    initialValue: '',
    rules: [
      { required: true, message: '请输入Issue负责人' }
    ],
    componentOptions: {
      type: 'select',
      list: responsibleList
    },
  },
]
/**
 * Issue工作日志表单
 * 1. 工作日志
 * 2. 耗时
 * @param {object} defaultIssue 原Issue数据
 * @return {array} Issue工作日志表单
 */
export const createIssueLogForm = defaultIssue => [
  {
    key: 'log',
    label: '工作日志',
    initialValue: defaultIssue.log || '',
    componentOptions: {
      type: 'input-area',
    },
  },
  {
    key: 'time',
    label: '耗费的时间 (单位为小时)',
    initialValue: 0,
    rules: [],
    componentOptions: {
      type: 'input-number',
      min: 0,
    },
  },
  {
    key: 'remainTime',
    label: '剩余开发时间 (单位为小时)',
    initialValue: defaultIssue.remainTime || 0,
    rules: [],
    componentOptions: {
      type: 'input-number',
      min: 0,
    },
  },
]