import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';
import LinkForm from './form';

export default function Add({ onAdd }) {
  // 控制添加链接对话框
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // 新链接的默认数据
  const defaultLinkData = {
    name: '',
    url: '',
    icon: '',
    bgColor: '#FFFFFF',
    textIcon: '',
    textBgColor: '#ff4757',
  };

  // 处理"添加图标"的点击
  const handleAddLinkClick = () => {
    setAddDialogOpen(true);
  };

  // 处理添加链接表单提交
  const handleAddSubmit = (formData) => {
    // 调用父组件的添加回调
    if (onAdd) {
      onAdd(formData);
    }

    // 关闭对话框
    setAddDialogOpen(false);
  };

  // 阻止事件冒泡，防止对话框内操作触发拖拽
  const handleDialogInteraction = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* 添加链接按钮 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={handleAddLinkClick}
      >
        <div className="bg-white/90 border shadow-sm w-16 h-16 p-4 rounded-xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path
              fill="#4285F4"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            />
          </svg>
        </div>
        <span className="text-sm text-white text-center mt-1 line-clamp-1 max-w-16 overflow-hidden text-ellipsis">
          添加链接
        </span>
      </div>

      {/* 添加链接对话框 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          onMouseDown={handleDialogInteraction}
          onMouseMove={handleDialogInteraction}
          onClick={handleDialogInteraction}
          onPointerDown={handleDialogInteraction}
        >
          <DialogHeader>
            <DialogTitle>添加新链接</DialogTitle>
            <DialogDescription>
              填写新链接的信息，完成后点击添加
            </DialogDescription>
          </DialogHeader>
          <LinkForm
            initialData={defaultLinkData}
            onSubmit={handleAddSubmit}
            onCancel={() => setAddDialogOpen(false)}
            submitLabel="添加链接"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
