/**
 * 创建团队表单
 * @return {array} 表单配置
 */
export const createTeamForm = () => [
  {
    key: 'name',
    label: '团队名称',
    initialValue: '',
    rules: [
      { required: true, message: '请输入团队名称' }
    ],
    componentOptions: {
      type: 'input',
    },
  }
]
/**
 * 设定权限表单
 * @params {array} 可选的列表项
 * @return {array} 表单配置
 */
export const setPermissionForm = permissionList => [
  {
    key: 'permission',
    label: '权限',
    initialValue: 'guest',
    rules: [],
    componentOptions: {
      type: 'select',
      list: permissionList
    },
  }
]
/**
 * 邀请成员自动补全表单
 */
export const autoCompleteForm = options => [
  {
    key: 'inviteUserId',
    label: '邀请用户',
    initialValue: '',
    rules: [
      { required: true, message: '请从选项卡中选择要邀请的用户~' }
    ],
    componentOptions: {
      type: 'auto-complete',
      ...options
    },
  }
]