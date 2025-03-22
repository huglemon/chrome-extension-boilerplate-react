import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import LinkForm from './form';

export default function Link({
  icon, // 网站图标URL或组件
  textIcon, // 文字图标内容
  url, // 链接目标URL
  name, // 链接名称
  bgColor = '#fff', // 默认背景色
  textBgColor = '#ff4757', // 文字图标背景色，默认红色
  className,
  onEdit,
  onDelete,
  ...props
}) {
  // 控制上下文菜单的显示和位置
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  // 控制编辑对话框和删除确认对话框
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 初始表单数据
  const initialFormData = {
    name,
    url,
    icon,
    bgColor,
    textIcon,
    textBgColor,
  };

  const menuRef = useRef(null);

  // 处理点击事件，在新标签页打开链接
  const handleClick = (url) => {
    chrome.tabs.create({ url: url });
  };

  // 处理右击事件，显示上下文菜单
  const handleContextMenu = (e) => {
    e.preventDefault(); // 阻止默认右击菜单
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // 点击页面其他区域时隐藏菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.visible]);

  // 处理编辑表单提交
  const handleEditSubmit = (formData) => {
    if (onEdit) {
      onEdit(formData);
    }
    setEditDialogOpen(false);
  };

  // 阻止事件冒泡，防止对话框内操作触发拖拽
  const handleDialogInteraction = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer relative"
      onContextMenu={handleContextMenu}
      {...props}
    >
      {/* 网站图标 */}
      <div
        className={cn(
          'border shadow-sm relative w-16 h-16 p-4 rounded-xl flex items-center justify-center overflow-hidden',
          className
        )}
        style={{ backgroundColor: '#ffffff' }}
        onClick={() => handleClick(url)}
      >
        {typeof icon === 'string' ? (
          <img
            src={icon}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // 图片加载失败时显示名称首字母
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<span class="text-xl font-bold">${name.charAt(
                0
              )}</span>`;
            }}
          />
        ) : (
          icon || <span className="text-xl font-bold">{name.charAt(0)}</span>
        )}

        {/* 文字图标（如果提供） */}
        {textIcon && (
          <div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-xl flex items-center justify-center text-white text-xs font-medium line"
            style={{ backgroundColor: textBgColor }}
          >
            {textIcon}
          </div>
        )}
      </div>

      {/* 链接名称 */}
      <span
        className="text-xs text-white text-center mt-1 line-clamp-1 max-w-16 overflow-hidden text-ellipsis"
        title={name}
      >
        {name}
      </span>

      {/* 上下文菜单 */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed bg-white shadow-md rounded-lg py-1 z-50 w-32 text-sm"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          {/* 打开选项 */}
          <div
            className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setContextMenu({ ...contextMenu, visible: false });
              handleClick();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4"
            >
              <path
                fill="currentColor"
                d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
              />
            </svg>
            <span>打开</span>
          </div>

          {/* 编辑选项 */}
          {onEdit && (
            <div
              className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setContextMenu({ ...contextMenu, visible: false });
                setEditDialogOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
              >
                <path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
              <span>编辑</span>
            </div>
          )}

          {/* 删除选项 */}
          {onDelete && (
            <div
              className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-red-500"
              onClick={() => {
                setContextMenu({ ...contextMenu, visible: false });
                setDeleteDialogOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
              >
                <path
                  fill="currentColor"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                />
              </svg>
              <span>删除</span>
            </div>
          )}
        </div>
      )}

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          onMouseDown={handleDialogInteraction}
          onMouseMove={handleDialogInteraction}
          onClick={handleDialogInteraction}
          onPointerDown={handleDialogInteraction}
        >
          <DialogHeader>
            <DialogTitle>编辑链接</DialogTitle>
            <DialogDescription>
              修改链接的属性，完成后点击保存
            </DialogDescription>
          </DialogHeader>
          <LinkForm
            initialData={initialFormData}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditDialogOpen(false)}
            submitLabel="保存更改"
          />
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          onMouseDown={handleDialogInteraction}
          onMouseMove={handleDialogInteraction}
          onClick={handleDialogInteraction}
          onPointerDown={handleDialogInteraction}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除链接 "{name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (onDelete) {
                  onDelete();
                }
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
