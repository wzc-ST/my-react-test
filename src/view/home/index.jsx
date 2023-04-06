/*
 * @Author: WZC
 * @Date: 2022-12-17 18:13:33
 * @FilePath: /src/view/home/index.jsx
 * @Description: 首页
 */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Card, Col, Row, Space, List, Avatar, Drawer } from "antd";
import {
  BarChartOutlined,
  PieChartOutlined,
  EditOutlined,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";
import _ from "lodash";

import { newsManageApi } from "@/api/modules/newsManage";
import { setPageLoading } from "@/redux/actionCreator/basicContentAction";

const { Meta } = Card;

function HomePage(props) {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);

  // 获取板块数据
  useEffect(() => {
    async function getList() {
      let viewRes = await newsManageApi.getHomeNewSortList("view");
      console.log("viewRes", viewRes);

      let starRes = await newsManageApi.getHomeNewSortList("star");
      console.log("starRes", starRes);

      setviewList(viewRes);
      setstarList(starRes);
    }
    getList();
  }, [props]);

  // 获取加载柱状图
  useEffect(() => {
    getInitClassificationStatisticsChart();
    return () => {
      window.onresize = null;
    };
  }, []);
  async function getInitClassificationStatisticsChart() {
    let res = await newsManageApi.getClassificationStatisticsList();
    // console.log("首页分类统计", res);
    setallList(res);

    let dataList = _.groupBy(res, (item) => item.category.title);
    console.log("dataList", dataList);

    // 初始化图表
    const chartDom = document.getElementById("chartBarBox");
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == null) {
      myChart = echarts.init(chartDom);
    }

    const option = {
      legend: {
        data: ["数量"],
      },
      xAxis: {
        type: "category",
        data: Object.keys(dataList),
      },
      yAxis: {
        type: "value",
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(dataList).map((item) => item.length),
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize();
    };
  }

  // 抽屉
  const [statisticalChartDrawer, setstatisticalChartDrawer] = useState(false);
  const onStatisticalChartDrawerOpen = async () => {
    await setstatisticalChartDrawer(true);

    let list = allList.filter((item) => item.author === userInfo.username);
    // console.log("list", list);
    const groupObj = _.groupBy(list, (item) => item.category.title);
    console.log("groupObj", groupObj);
    let dataList = [];
    for (let i in groupObj) {
      dataList.push({
        name: i,
        value: groupObj[i].length,
      });
    }

    // 初始化图表
    const chartDom = document.getElementById("chartPieBox");
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == null) {
      myChart = echarts.init(chartDom);
    }

    const option = {
      title: {
        text: "当前用户新闻分类图示",
        subtext: "Fake Data",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      label: {
        alignTo: "edge",
        formatter: "{name|{b}}\n{value|{c} 篇}",
        minMargin: 5,
        edgeDistance: 10,
        lineHeight: 15,
        rich: {
          value: {
            fontSize: 10,
            color: "#999",
          },
        },
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "60%",
          center: ["50%", "50%"],
          data: dataList,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    myChart.setOption(option);

    // window.onresize = () => {
    //   myChart.resize();
    // };
  };
  const onStatisticalChartDrawerClose = () => {
    console.log("onStatisticalChartDrawerClose");
    setstatisticalChartDrawer(false);
  };

  /* 预览 */
  const onPreview = (id) => {
    console.log("预览-id", id);
    navigate("/news-manage/preview/" + id);
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title={
              <Space>
                <span>用户最常预览</span>
                <BarChartOutlined />
              </Space>
            }
          >
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <span
                    onClick={() => onPreview(item.id)}
                    style={{ color: "#1677ff", cursor: "pointer" }}
                  >
                    {item.title} ({item.view}人)
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <Space>
                <span>用户最多点赞</span>
                <BarChartOutlined />
              </Space>
            }
          >
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <span
                    onClick={() => onPreview(item.id)}
                    style={{ color: "#1677ff", cursor: "pointer" }}
                  >
                    {item.title} ({item.star}个)
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://wx3.sinaimg.cn/large/008v8IeKgy1hco73d1g81j30si124dk1.jpg"
              />
            }
            actions={[
              <PieChartOutlined
                key="pieChart"
                onClick={() => onStatisticalChartDrawerOpen()}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={userInfo.username}
              description={
                <Space>
                  <strong>{userInfo.role.roleName}</strong>
                  <span>{userInfo.region || "全球"}</span>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col span={24} style={{ marginTop: "30px" }}>
          <Card
            title={
              <Space>
                <span>新闻分类统计</span>
                {/* <BarChartOutlined /> */}
              </Space>
            }
          >
            <div
              id="chartBarBox"
              style={{ minHeight: "400px", width: "100%" }}
            ></div>
          </Card>
        </Col>
      </Row>
      <Drawer
        title="个人新闻分类"
        placement="right"
        width="80%"
        destroyOnClose
        onClose={onStatisticalChartDrawerClose}
        open={statisticalChartDrawer}
      >
        <div
          id="chartPieBox"
          style={{ marginTop: "0", minHeight: "800px", width: "100%" }}
        ></div>
      </Drawer>
    </>
  );
}

const mapDispatchToProps = {
  setPageLoading,
};
export default connect(null, mapDispatchToProps)(HomePage);
