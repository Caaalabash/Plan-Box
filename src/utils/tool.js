import { SEQUENCE_DIFF } from './constant'
/**
 * 限制卡片的拖动范围
 * @param {node} key - 被拖拽的节点
 * @returns {array} - 可拖动索引范围
 * @description 0,1,2,3,4 分别代表 待开发,开发中,待测试,测试中,已完成
 */
export function restrictDropDistance(key) {
  if (typeof key === 'number') key = key.toString()
  switch (key) {
    case '0': return ['1']
    case '1': return ['0', '2']
    case '2': return ['1', '3']
    case '3': return ['1', '2', '4']
    default: return []
  }
}
/**
 * 将任务优先级状态转为文字形式
 * @param {string|number} value - 任务优先级代号
 * @returns {string} - 对应文字
 * @description 0, 1, 2, 3 分别代表 建议, 重要, 紧急, 致命
 */
export function translatePriority(value) {
  switch (+value) {
    case 1: return '重要'
    case 2: return '紧急'
    case 3: return '致命'
    default: return '建议'
  }
}
/**
 * 处理子任务的排序
 * @param {array} tasks - 子任务列表
 * @returns {array} - 处理后的子任务列表
 * @description 创建子任务时, 默认排序值为0
 */
export function setSequence(tasks) {
  return tasks.sort((last, next) => last.sequence - next.sequence)
}
/**
 * 处理DOM修改后的sequence值
 * @param {node} drag - 将插入的元素
 * @param {boolean} sequence - 插入方向 true前 false后
 * @description
 *   首: 旧首 - SEQUENCE_DIFF
 *   中部: (前 + 后) / 2
 *   尾: 旧尾 + SEQUENCE_DIFF
 * @returns {number} - drag元素新的sequence
 */
export function calculateSequence(drag, sequence) {
  const prev = +getDataset(drag.previousSibling, 'sequence')
  const next = +getDataset(drag.nextSibling, 'sequence')

  let result = 0
  if (sequence) {
    result =  prev ? (prev + next) / 2 : next - SEQUENCE_DIFF
  } else {
    result =  next ? (prev + next) / 2 : prev + SEQUENCE_DIFF
  }
  return +result.toFixed(10)
}
/**
 * 给对应节点添加对应的类名
 * @param {node} dom - 节点
 * @param {string} className - 类名
 */
export function addClass(dom, ...className) {
  dom.classList.add(...className)
}
/**
 * 给对应节点删除对应的类名
 * @param {node} dom - 节点
 * @param {string} className - 类名
 */
export function removeClass(dom, ...className) {
  dom.classList.remove(...className)
}
/**
 * 判断对应节点是否含有对应的类名
 * @param {node} dom - 节点
 * @param {string} className - 类名
 * @returns {boolean}
 */
export function hasClass(dom, className) {
  return dom.classList.contains(className)
}
/**
 * 获取子节点的含有某个键值对的父节点
 * @param {node} child - 子节点
 * @param {string} prop - dom上的某个属性
 * @param {string} value - 该属性对应的值
 * @returns {node|boolean}
 */
export function getParentDom(child, prop, value) {
  if (!child) return false
  while(child[prop] !== value) {
    // 对于className有多个类名时特殊处理
    if (~child[prop].indexOf(value)) {
      break
    }
    child = child.parentNode
  }
  return child
}
/**
 * 获取某个节点的指定data-set值
 * @param {node} dom - 节点
 * @param {string} prop - 属性名
 * @returns {node|boolean}
 */
export function getDataset(dom, prop) {
  if (!dom) return false
  return dom.dataset[prop]
}
/**
 * 解析查询字符串
 * @param {string} query  - 查询字符串
 * @returns {object}
 */
export function parseQueryParams(query) {
  if (!query) return {}
  const queryArray = query.split('?')[1].split('&')
  return queryArray.reduce((queryObj, partOfQuery) => {
    const [key, val] = partOfQuery.split('=')
    queryObj[key] = val
    return queryObj
  }, {})
}

