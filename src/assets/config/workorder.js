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