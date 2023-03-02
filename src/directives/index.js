// 管理所有的自定义指令
export const imagerror = {
// 当前dom元素插入到节点之后执行，执行一次，用于初始化
  inserted(dom, options) {
    dom.src = dom.src || options.value
    dom.onerror = function() {
      dom.src = options.value
    }
  },
  // 组件更新后执行
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
