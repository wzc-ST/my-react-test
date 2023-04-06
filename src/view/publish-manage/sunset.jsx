/*
 * @Author: WZC
 * @Date: 2023-03-12 18:17:54
 * @FilePath: /src/view/publish-manage/sunset.jsx
 * @Description: 发布管理-已下线
 */
import { Button } from "antd";
import React from "react";
import PublishManageList from "./components/list";
import usePublishManageList from "./components/useList.js";

export default function PublishManageSunset() {
  const usePublishManageListData = usePublishManageList(3);
  const { handleDel, handlePublish } = usePublishManageListData;

  return (
    <div>
      <PublishManageList
        {...usePublishManageListData}
        button={(id) => (
          <>
            <Button danger onClick={() => handleDel(id)}>
              删除
            </Button>
            <Button type="primary" onClick={() => handlePublish(id, 2)}>
              重新上线
            </Button>
          </>
        )}
      />
    </div>
  );
}
