/*
 * @Description: 发布管理 - publishManage
 */
import http from "../request";

/* 接口定义 */
export class publishManageApi {
  // 获取列表
  static getList(username, type) {
    return http({
      url: `/news?author=${username}&publishState=${type}&_expand=category`,
      method: "get",
    }).then((res) => res.data);
  }
}
