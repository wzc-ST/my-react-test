/*
 * @Author: WZC
 * @Date: 2023-03-19 22:55:19
 * @FilePath: /src/view/news-manage/preview.jsx
 * @Description: 新闻管理-预览
 */
import React, { useEffect, useState } from "react";
import { Divider, Descriptions, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import style from "./index.module.less";

import { newsManageApi } from "@/api/modules/newsManage";

export default function NewsManagePreview() {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getInfo(params.id);
  }, [params.id]);

  const [info, setinfo] = useState();

  const colorList = ["", "warning", "success", "error"];
  const auditStateList = ["未审核", "正在审核", "已通过", "未通过"];
  const publishStateList = ["未发布", "待发布", "已发布", "已下线"];

  const getInfo = async (id) => {
    console.log("id", id);
    let res = await newsManageApi.getInfo(id);
    console.log("getInfo-res", res);
    setinfo(res);
  };

  return (
    info && (
      <div className={style.newsManagePreviewPageBox}>
        <div className={style.newsManageTopTitleBox}>
          <div
            className={style.newsManageTopReturnIcon}
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeftOutlined />
          </div>
          <Divider type="vertical" />
          <div className={style.newsManageTopTitle}>{info.title}</div>
          <div className={style.newsManageTopSubTitle}>
            {info.category.title}
          </div>
        </div>
        <Divider />
        <Descriptions bordered>
          <Descriptions.Item label="创作者">{info.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(info.createTime).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {info.publishTime
              ? dayjs(info.publishTime).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{info.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <Tag color={colorList[info.auditState]}>
              {auditStateList[info.auditState]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            <Tag color={colorList[info.publishState]}>
              {publishStateList[info.publishState]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量(人)">{info.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量(个)">{info.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
        <div
          className={style.newsManagePreviewContentBox}
          dangerouslySetInnerHTML={{ __html: info.content }}
        ></div>
      </div>
    )
  );
}
