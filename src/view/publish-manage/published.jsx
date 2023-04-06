/*
 * @Author: WZC
 * @Date: 2023-03-12 18:17:54
 * @FilePath: /src/view/publish-manage/published.jsx
 * @Description: 发布管理-已发布
 */
import { Button } from "antd";
import React from "react";
import PublishManageList from "./components/list";
import usePublishManageList from "./components/useList.js";

export default function PublishManagePublished() {
  const usePublishManageListData = usePublishManageList(2);
  const { handleSunset } = usePublishManageListData;

  return (
    <div>
      <PublishManageList
        {...usePublishManageListData}
        button={(id) => (
          <Button danger onClick={() => handleSunset(id)}>
            下线
          </Button>
        )}
      />
    </div>
  );
}
