/*
 * @Description: 基础内容 - basicContentAction
 */

/**
 * @description: 全局动画显示隐藏
 * @param {*} value { show: true, title?: '文本' }
 * @return {*}
 */
function setPageLoading(value) {
  return {
    type: "setPageLoading",
    value,
  };
}

/**
 * @description: 接口请求
 * @return {*}
 */
async function getXxxFun() {
  /* axios请求 */
  // let res = await axios();
  return {
    type: "xxx",
    value: "xxx",
  };
}

export { getXxxFun, setPageLoading };
