/*
 * @Description: 用户列表 - userManage
 */
import http from "../request";

/* 接口定义 */
export class userManageApi {
  // 获取列表
  static getList(params) {
    return http({
      url: "/users?_expand=role",
      method: "get",
      params,
    }).then((res) => res.data);
  }

  // 添加
  static getinfo(params) {
    return http({
      url: `/users?id=${params.id}`,
      method: "get",
    }).then((res) => res.data);
  }

  // 添加
  static add(data) {
    return http({
      url: `/users`,
      method: "post",
      data,
    }).then((res) => res.data);
  }

  // 更新
  static update(id, data) {
    return http({
      url: `/users/${id}`,
      method: "patch",
      data,
    }).then((res) => res.data);
  }

  // 删除
  static del(id) {
    return http({
      url: `/users/${id}`,
      method: "delete",
    }).then((res) => res.data);
  }
}
