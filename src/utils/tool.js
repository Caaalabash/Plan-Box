/**
 * 限制卡片的拖动范围
 * @param {object} event - 事件对象
 * @returns {array} - 可拖动索引范围
 * @description 0,1,2,3,4 分别代表 待开发,开发中,待测试,测试中,已完成
 */
export function restrictDropDistance(event) {
  const startColumnIndex = event.target.parentNode.dataset.columnKey
  switch (startColumnIndex) {
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
  return tasks.map((task, index) => {
    if (task.sequence === 0) {
      task.sequence = ++index
    }
    return task
  })
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

