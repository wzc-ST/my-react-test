/*
 * @Description: 基础内容 - basicContentState
 */
const basicContentState = (
  /* 默认参数 */
  prevState = {
    // 全局动画
    pageLoading: false,
    pageLoadingTitle: "",
    // ...
  },
  /* 传递过来的值 */
  action
) => {
  /* 逻辑处理 */
  let newState = { ...prevState };
  switch (action.type) {
    case "setPageLoading":
      let { show, title } = action.value;
      newState.pageLoading = show;
      newState.pageLoadingTitle = title;
      return newState;

    default:
      return prevState;
  }
};

export default basicContentState;
