/**
 * 创建/更新子任务表单
 * 1. 任务主题
 * 2. 任务描述
 * 3. 任务紧急程度
 * @param {object} backlog 初始值, 提供初始值时表示更新
 * @return {array} 表单配置
 */
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
 * 补全子任务表单
 * 1. 任务故事点
 * 2. 经办人
 * 3. 可选Sprint
 * @param {array} responsibleList 成员列表
 * @param {array} sprintList 周期列表
 * @return {array} 表单配置
 */
export const completeTaskForm = (responsibleList, sprintList) => [
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
    key: 'responsible',
    label: '经办人',
    initialValue: '',
    rules: [
      { required: true, message: '请指定经办人' }
    ],
    componentOptions: {
      type: 'select',
      list: responsibleList
    },
  },
  {
    key: 'relateSprint',
    label: '任务周期',
    initialValue: '',
    rules: [
      { required: true, message: '请指定归属任务周期' }
    ],
    componentOptions: {
      type: 'select',
      list: sprintList
    },
  },
]