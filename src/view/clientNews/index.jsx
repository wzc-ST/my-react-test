/*
 * @Author: WZC
 * @Date: 2023-03-30 21:29:23
 * @FilePath: /src/view/clientNews/index.jsx
 * @Description: 客户端首页
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Col, Row, List, Alert } from "antd";
import { FlagTwoTone } from '@ant-design/icons';

import _ from "lodash";
import { newsManageApi } from "@/api/modules/newsManage";

export default function ClientNewsIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    async function getList() {
      let res = await newsManageApi.getClassificationStatisticsList();
      console.log("首页分类统计", res);
      setlist(Object.entries(_.groupBy(res, (item) => item.category.title)));
    }
    getList();
  }, []);

  const [list, setlist] = useState([]);
  console.log("list", list);

  /* 预览 */
  const onPreview = (id) => {
    console.log("预览-id", id);
    navigate("/news/" + id);
  };

  return (
    <div style={{ width: "94%", margin: "20px auto" }}>
      <Alert
        message={<h2 style={{ marginBottom: "0" }}>全球大新闻</h2>}
        type="info"
        showIcon
        icon={<FlagTwoTone  style={{ fontSize: "24px" }} />}
        style={{ marginBottom: "20px" }}
      />
      <Row gutter={[24, 24]}>
        {list.map((item) => (
          <Col span={8} key={item[0]}>
            <Card title={item[0]} hoverable>
              <List
                pagination={{
                  pageSize: 3,
                }}
                dataSource={item[1]}
                renderItem={(data) => (
                  <List.Item>
                    <span
                      onClick={() => onPreview(data.id)}
                      style={{ color: "#1677ff", cursor: "pointer" }}
                    >
                      {data.title}
                    </span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
