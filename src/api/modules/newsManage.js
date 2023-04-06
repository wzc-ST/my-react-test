/*
 * @Description: 新闻 - newsManage
 */
import http from "../request";

/* 接口定义 */
export class newsManageApi {
  // 获取列表
  static getList(params) {
    return http({
      url: "/news",
      method: "get",
      params,
    }).then((res) => res.data);
  }

  // 获取详情
  static getInfo(id) {
    return http({
      url: `/news/${id}?_expand=category&_expand=role`,
      method: "get",
    }).then((res) => res.data);
  }

  // 新增
  static add(data) {
    return http({
      url: `/news`,
      method: "post",
      data,
    }).then((res) => res.data);
  }

  // 更新
  static update(id, data) {
    return http({
      url: `/news/${id}`,
      method: "patch",
      data,
    }).then((res) => res.data);
  }

  // 删除
  static del(id) {
    return http({
      url: `/news/${id}`,
      method: "delete",
    }).then((res) => res.data);
  }

  // 获取新闻分类列表
  static getCategoriesList(params) {
    return http({
      url: "/categories",
      method: "get",
      params,
    }).then((res) => res.data);
  }

  // 获取草稿箱列表
  static getdraftList(author) {
    return http({
      url: `/news?author=${author}&auditState=0&_expand=category`,
      method: "get",
    }).then((res) => res.data);
  }

  // 首页新闻显示
  static getHomeNewSortList(type) {
    return http({
      url: `/news?publishState=2&_expand=category&_sort=${type}&_order=desc&_limit=6`,
      method: "get",
    }).then((res) => res.data);
  }

  // 首页分类统计
  static getClassificationStatisticsList(type) {
    return http({
      url: `/news?publishState=2&_expand=category`,
      method: "get",
    }).then((res) => res.data);
  }
}
