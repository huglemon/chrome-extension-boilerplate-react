import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

// 收藏夹导入组件
function Import({ onImport }) {
  // 控制导入对话框显示
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  // 浏览器收藏夹数据
  const [bookmarks, setBookmarks] = useState([]);
  // 已选择的收藏夹项目
  const [selectedBookmarks, setSelectedBookmarks] = useState({});
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 处理"导入"按钮的点击
  const handleImportButtonClick = () => {
    setImportDialogOpen(true);
    loadBookmarks();
  };

  // 加载浏览器收藏夹数据
  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      // 使用 Chrome API 获取收藏夹
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        setBookmarks(bookmarkTreeNodes);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('无法加载收藏夹:', error);
      setIsLoading(false);
    }
  };

  // 切换收藏夹项目选择状态
  const toggleBookmark = (id) => {
    setSelectedBookmarks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 切换文件夹中所有收藏夹项目的选择状态
  const toggleFolder = (folder) => {
    const newSelected = { ...selectedBookmarks };

    // 递归处理文件夹中的所有项目
    const processFolder = (items) => {
      for (const item of items) {
        if (item.url) {
          // 如果是链接，切换选择状态
          newSelected[item.id] = !selectedBookmarks[item.id];
        } else if (item.children) {
          // 如果是文件夹，递归处理其子项
          processFolder(item.children);
        }
      }
    };

    processFolder(folder.children || []);
    setSelectedBookmarks(newSelected);
  };

  // 处理导入选中的收藏夹项目
  const handleImportSelected = () => {
    // 过滤出所有被选中的收藏夹项目
    const selectedItems = [];

    const findSelectedItems = (items) => {
      for (const item of items) {
        if (item.url && selectedBookmarks[item.id]) {
          // 收集被选中的链接，限制标题长度为20个字符
          const truncatedTitle =
            item.title.length > 20
              ? item.title.substring(0, 20) + '...'
              : item.title;

          selectedItems.push({
            name: truncatedTitle,
            url: item.url,
            icon: '', // 收藏夹API不提供图标，需要额外处理
            bgColor: '#FFFFFF',
            textIcon: '',
            textBgColor: '#ff4757',
          });
        }

        if (item.children) {
          // 递归处理子文件夹
          findSelectedItems(item.children);
        }
      }
    };

    findSelectedItems(bookmarks);

    // 调用父组件的导入回调
    if (onImport && selectedItems.length > 0) {
      onImport(selectedItems);
    }

    // 关闭对话框并重置选择状态
    setImportDialogOpen(false);
    setSelectedBookmarks({});
  };

  // 阻止事件冒泡，防止对话框内操作触发拖拽
  const handleDialogInteraction = (e) => {
    e.stopPropagation();
  };

  // 渲染收藏夹树结构
  const renderBookmarkTree = (items, level = 0) => {
    if (!items || items.length === 0) return null;

    return (
      <ul className={cn('pl-4', level === 0 ? 'pl-0' : '')}>
        {items.map((item) => (
          <li key={item.id} className="my-1">
            {item.url ? (
              // 渲染收藏夹链接项
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`bookmark-${item.id}`}
                  checked={!!selectedBookmarks[item.id]}
                  onChange={() => toggleBookmark(item.id)}
                  className="mr-2 h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor={`bookmark-${item.id}`}
                  className="text-sm hover:underline cursor-pointer truncate max-w-xs"
                  title={item.url}
                >
                  {item.title || '无标题'}
                </label>
              </div>
            ) : (
              // 渲染收藏夹文件夹
              <div>
                <div
                  className="flex items-center font-medium text-gray-700 cursor-pointer"
                  onClick={() => toggleFolder(item)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hover:underline">
                    {item.title || '收藏夹'}
                  </span>
                </div>
                {/* 递归渲染子文件夹 */}
                {item.children && renderBookmarkTree(item.children, level + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {/* 导入按钮 */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={handleImportButtonClick}
      >
        <div className="bg-white/90 border shadow-sm w-16 h-16 p-4 rounded-xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path
              fill="#4285F4"
              d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
            />
          </svg>
        </div>
        <span className="text-sm text-white text-center mt-1 line-clamp-1 max-w-16 overflow-hidden text-ellipsis">
          导入收藏夹
        </span>
      </div>

      {/* 导入对话框 */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] overflow-y-auto"
          onMouseDown={handleDialogInteraction}
          onMouseMove={handleDialogInteraction}
          onClick={handleDialogInteraction}
          onPointerDown={handleDialogInteraction}
        >
          <DialogHeader>
            <DialogTitle>导入浏览器收藏夹</DialogTitle>
            <DialogDescription>
              选择想要导入的收藏夹项目，完成后点击导入选中项
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : bookmarks.length > 0 ? (
              <div className="max-h-[50vh] overflow-y-auto pr-2">
                {renderBookmarkTree(bookmarks)}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                未找到收藏夹数据
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                setSelectedBookmarks({});
              }}
            >
              取消
            </Button>
            <Button onClick={handleImportSelected}>导入选中项</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Import;
