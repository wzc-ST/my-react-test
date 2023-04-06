/*
 * @Description: 审核 - auditManage
 */
import http from "../request";

/* 接口定义 */
export class auditManageApi {
  // 获取审核列表
  static getList(author) {
    return http({
      url: `/news?author=${author}&auditState_ne=0&publishState_lte=1&_expand=category`,
      method: "get",
    }).then((res) => res.data);
  }

  // 获取审核新闻管理列表
  static getAuditList(author) {
    return http({
      url: `/news?auditState=1&_expand=category`,
      method: "get",
    }).then((res) => res.data);
  }
}
