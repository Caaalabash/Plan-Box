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
