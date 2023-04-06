/*
 * @Description: 角色列表 - role
 */
import http from "../request";

/* 接口定义 */
export class roleApi {
  // 获取角色列表
  static getList(params) {
    return http({
      url: "/roles",
      method: "get",
      params,
    }).then((res) => res.data);
  }

  // 更新
  static update(id, data) {
    return http({
      url: `/roles/${id}`,
      method: "patch",
      data,
    }).then((res) => res.data);
  }

  // 删除
  static del(id) {
    return http({
      url: `/roles/${id}`,
      method: "delete",
    }).then((res) => res.data);
  }

  // 地区
  static getRegionsList(params) {
    return http({
      url: "/regions",
      method: "get",
      params,
    }).then((res) => res.data);
  }
}
