/*
 * @Author: WZC
 * @Date: 2023-03-23 22:04:29
 * @FilePath: /src/view/publish-manage/components/useList.js
 * @Description: 自定义Hooks
 */
import { useEffect, useState } from "react";
import { Modal, notification } from "antd";

import { publishManageApi } from "@/api/modules/publishManage";
import { newsManageApi } from "@/api/modules/newsManage";

const { confirm } = Modal;

function usePublishManageList(type) {
  const { username } = JSON.parse(localStorage.getItem("userInfo"));
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getList(username, type);
  }, [username, type]);

  const getList = async (username, type) => {
    let res = await publishManageApi.getList(username, type);
    console.log("发布管理-列表-" + type, res);
    setList(res);
    setTotal(res.length);
    setLoading(false);
  };

  const handlePublish = (id, type) => {
    console.log("handlePublish-id", id);
    console.log("handlePublish-type", type);

    let typeTitle = type === 1 ? "发布" : "重新上线";

    confirm({
      title: "提示",
      content: `是否${typeTitle}此数据？`,
      okText: typeTitle,
      onOk: async () => {
        await newsManageApi.update(id, {
          publishState: 2,
          publishTime: Date.now(),
        });
        notification.success({
          message: "提示",
          description: `${typeTitle}成功`,
        });
        getList(username, type);
      },
    });
  };

  const handleSunset = (id) => {
    console.log("handleSunset-id", id);

    confirm({
      title: "提示",
      content: `是否下线此数据？`,
      okText: "下线",
      okType: "danger",
      onOk: async () => {
        await newsManageApi.update(id, {
          publishState: 3,
        });
        notification.success({
          message: "提示",
          description: `下线成功`,
        });
        getList(username, type);
      },
    });
  };

  const handleDel = (id) => {
    console.log("handleDel-id", id);

    confirm({
      title: "提示",
      content: "是否删除此数据？",
      okText: "删除",
      okType: "danger",
      onOk: async () => {
        console.log("OK");

        await newsManageApi.del(id);
        notification.success({
          message: "提示",
          description: `删除成功`,
        });
        getList(username, type);
      },
    });
  };

  return { list, total, loading, handlePublish, handleSunset, handleDel };
}

export default usePublishManageList;
