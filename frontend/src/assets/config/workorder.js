/**
 * 创建工单表单配置
 * 1. 主要问题
 * 2. 问题描述
 * 3. 问题分类
 * @return {array} 表单配置
 */
export const createWorkOrderForm = () => [
  {
    key: 'title',
    label: '主要问题',
    initialValue: '',
    rules: [
      { required: true, message: '请输入主要问题' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'content',
    label: '问题描述',
    initialValue: '',
    rules: [
      { required: true, message: '请输入问题描述' }
    ],
    componentOptions: {
      type: 'input',
    },
  },
  {
    key: 'type',
    label: '问题分类',
    initialValue: 'feature',
    rules: [],
    componentOptions: {
      type: 'select',
      list: [
        { label: 'feature', value: 'feature' },
        { label: 'bug', value: 'bug' },
        { label: 'suggestion', value: 'suggestion' },
      ]
    },
  },
]
/**
 * 回复工单
 * 1. 工单反馈
 * @return {array} 表单配置
 */
export const createFeedbackForm = () => [
  {
    key: 'feedback',
    label: '工单反馈',
    initialValue: '',
    rules: [
      { required: true, message: '请输入工单反馈' }
    ],
    componentOptions: {
      type: 'input-area',
    },
  },
]
/**
 * 查看
 * 1. 工单反馈
 * @return {array} 表单配置
 */
export const reviewFeedbackForm = (workorder = {}) => [
  {
    key: 'feedback',
    label: '工单反馈',
    initialValue: workorder.feedback,
    componentOptions: {
      type: 'input-area',
      disabled: true
    },
  },
]