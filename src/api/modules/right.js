/*
 * @Description: 权限 - right
 */
import http from "../request";

/* 接口定义 */
export class rightApi {
  // 获取权限列表
  static getList(params) {
    return http({
      url: "/rights?_embed=children",
      method: "get",
      params,
    }).then((res) => res.data);
  }

  // 更新
  static update(id, data) {
    return http({
      url: `/rights/${id}`,
      method: "patch",
      data,
    }).then((res) => res.data);
  }
  static updateChildren(id, data) {
    return http({
      url: `/children/${id}`,
      method: "patch",
      data,
    }).then((res) => res.data);
  }

  // 删除
  static del(id) {
    return http({
      url: `/rights/${id}`,
      method: "delete",
    }).then((res) => res.data);
  }
  static delChildren(id) {
    return http({
      url: `/children/${id}`,
      method: "delete",
    }).then((res) => res.data);
  }
}
