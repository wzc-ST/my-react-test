/*
 * @Description: 用户相关 - user
 */
import http from "../request";

/* 接口定义 */
export class userApi {
  // 获取全部权限列表
  static getPermissionList(params) {
    return http({
      url: "/rights?_embed=children",
      method: "get",
      params,
    }).then((res) => res.data);
  }

  // 登陆，并且获取账号权限
  static login(params) {
    return http({
      url: `/users?username=${params.username}&password=${params.password}&roleState=true&_expand=role`,
      method: "get",
      params,
    }).then((res) => res.data);
  }
}
