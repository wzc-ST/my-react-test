/*
 * @Author: WZC
 * @Date: 2023-03-30 21:29:23
 * @FilePath: /src/view/clientNews/details.jsx
 * @Description: 客户端-详情
 */
import React, { useEffect, useState } from "react";
import { Divider, Descriptions, message, notification } from "antd";
import { ArrowLeftOutlined, LikeTwoTone } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import style from "./index.module.less";

import { newsManageApi } from "@/api/modules/newsManage";

export default function ClientNewsDetails() {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getInfo(params.id);
  }, [params.id]);

  const [info, setinfo] = useState();

  const getInfo = async (id) => {
    console.log("id", id);
    let res = await newsManageApi.getInfo(id);
    console.log("getInfo-res", res);

    let newView = res.view + 1;
    setinfo({ ...res, view: newView });
    await newsManageApi.update(id, { view: newView });
  };

  const onLikeTwoTone = async () => {
    if (info.ifStar) return message.warning("请勿重复点赞");

    let newStar = info.star + 1;
    setinfo({ ...info, star: newStar, ifStar: 1 });
    await newsManageApi.update(info.id, { star: newStar });
    notification.success({
      message: "提示",
      description: "点赞成功！",
    });
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
          <div className={style.likeTwoToneBox} onClick={() => onLikeTwoTone()}>
            <LikeTwoTone twoToneColor={info.ifStar ? "" : "#626161"} />
          </div>
        </div>
        <Divider />
        <Descriptions bordered>
          <Descriptions.Item label="创作者">{info.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {info.publishTime
              ? dayjs(info.publishTime).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{info.region}</Descriptions.Item>
          <Descriptions.Item label="访问数量(人)">
            <span className={style.spanHighlight}>{info.view}</span>
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量(个)">
            <span className={style.spanHighlight}>{info.star}</span>
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
            <span className={style.spanHighlight}>0</span>
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <div dangerouslySetInnerHTML={{ __html: info.content }}></div>
      </div>
    )
  );
}
