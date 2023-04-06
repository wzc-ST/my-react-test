/*
 * @Author: WZC
 * @Date: 2023-03-12 18:17:54
 * @FilePath: /src/view/publish-manage/unpublished.jsx
 * @Description: 发布管理-待发布
 */
import { Button } from "antd";
import React from "react";
import PublishManageList from "./components/list";
import usePublishManageList from "./components/useList.js";

export default function PublishManageUnpublished() {
  const usePublishManageListData = usePublishManageList(1);
  const { handlePublish } = usePublishManageListData;

  return (
    <div>
      <PublishManageList
        {...usePublishManageListData}
        button={(id) => (
          <Button type="primary" onClick={() => handlePublish(id, 1)}>
            发布
          </Button>
        )}
      />
    </div>
  );
}
