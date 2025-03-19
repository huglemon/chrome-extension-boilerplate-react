import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Background from '../../components/newtab/background';
import Clock from '../../components/newtab/clock';
import SearchBar from '../../components/newtab/searchBar';
import Link from '../../components/newtab/link/link';
import Add from '../../components/newtab/link/add';
// 导入配置文件
import linkConfig from '../../components/newtab/link/config.json';

// 创建可排序的链接项组件
const SortableLink = ({ app, index, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `${app.name}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link
        icon={app.icon}
        textIcon={app.textIcon}
        url={app.url}
        name={app.name}
        bgColor={app.bgColor}
        textBgColor={app.textBgColor}
        onEdit={(updatedLink) => onEdit(index, updatedLink)}
        onDelete={() => onDelete(index)}
      />
    </div>
  );
};

const Newtab = () => {
  // 使用状态来存储链接列表
  const [appLinks, setAppLinks] = useState([]);
  // 跟踪拖动状态
  const isDragging = useRef(false);
  // 当前拖动的项
  const [activeId, setActiveId] = useState(null);

  // 从配置文件获取默认链接数据
  const { defaultAppLinks } = linkConfig;

  // 配置传感器，调整灵敏度以获得更好的拖动体验
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // 降低激活距离，使拖动感觉更敏感
      activationConstraint: {
        distance: 5, // 只需要移动5px就开始拖动
      },
    }),
    useSensor(TouchSensor, {
      // 触摸设备也降低延迟
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  // 在组件挂载时从本地存储加载链接
  useEffect(() => {
    // 尝试从本地存储获取链接
    const loadLinksFromStorage = async () => {
      try {
        // 首先尝试使用 chrome.storage.local (推荐用于 Chrome 扩展)
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(['appLinks'], (result) => {
            if (result.appLinks) {
              setAppLinks(result.appLinks);
            } else {
              // 如果没有保存的链接，使用默认链接并保存到存储
              setAppLinks(defaultAppLinks);
              chrome.storage.local.set({ appLinks: defaultAppLinks });
            }
          });
        } else {
          // 回退到使用 localStorage
          const savedLinks = localStorage.getItem('appLinks');
          if (savedLinks) {
            setAppLinks(JSON.parse(savedLinks));
          } else {
            // 如果没有保存的链接，使用默认链接并保存到存储
            setAppLinks(defaultAppLinks);
            localStorage.setItem('appLinks', JSON.stringify(defaultAppLinks));
          }
        }
      } catch (error) {
        console.error('加载链接时出错:', error);
        setAppLinks(defaultAppLinks); // 出错时使用默认链接
      }
    };

    loadLinksFromStorage();
  }, []);

  // 保存链接到本地存储
  const saveLinksToStorage = (links) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ appLinks: links });
      } else {
        localStorage.setItem('appLinks', JSON.stringify(links));
      }
    } catch (error) {
      console.error('保存链接时出错:', error);
    }
  };

  // 添加新链接
  const addLink = (newLink) => {
    const updatedLinks = [...appLinks, newLink];
    setAppLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 删除链接
  const removeLink = (index) => {
    const updatedLinks = appLinks.filter((_, i) => i !== index);
    setAppLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 编辑链接
  const editLink = (index, updatedLink) => {
    const updatedLinks = [...appLinks];
    updatedLinks[index] = updatedLink;
    setAppLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 处理拖动开始
  const handleDragStart = (event) => {
    isDragging.current = true;
    setActiveId(event.active.id);
  };

  // 处理拖动结束
  const handleDragEnd = (event) => {
    isDragging.current = false;
    setActiveId(null);

    const { active, over } = event;

    if (over && active.id !== over.id) {
      // 提取索引从id中（格式为 "appName-index"）
      const activeIndex = parseInt(active.id.split('-').pop());
      const overIndex = parseInt(over.id.split('-').pop());

      // 重新排序链接
      setAppLinks((items) => {
        const newItems = arrayMove(items, activeIndex, overIndex);
        // 使用请求动画帧来延迟保存，避免可能的性能问题
        requestAnimationFrame(() => saveLinksToStorage(newItems));
        return newItems;
      });
    }
  };

  // 处理点击事件，阻止拖动时的链接点击
  const handleClickCapture = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Background>
      <div className="min-h-screen text-foreground py-10">
        {/* 固定区域 */}
        <div className="flex flex-col items-center justify-center gap-10 mb-10">
          <Clock />
          <SearchBar />
        </div>

        {/* 应用图标网格 */}
        <div
          className="container mx-auto px-4 mt-8"
          onClickCapture={handleClickCapture}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={appLinks.map((app, index) => `${app.name}-${index}`)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-5 md:grid-cols-12 gap-6 justify-items-center">
                {appLinks.map((app, index) => (
                  <SortableLink
                    key={`${app.name}-${index}`}
                    app={app}
                    index={index}
                    onEdit={editLink}
                    onDelete={removeLink}
                  />
                ))}

                {/* 添加按钮 - 不需要排序 */}
                <div>
                  <Add onAdd={addLink} />
                </div>
              </div>
            </SortableContext>

            {/* 拖动覆盖层 - 提供更流畅的视觉反馈 */}
            <DragOverlay adjustScale={true}>
              {activeId ? (
                <div className="opacity-80">
                  <Link {...appLinks[parseInt(activeId.split('-').pop())]} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </Background>
  );
};

export default Newtab;
