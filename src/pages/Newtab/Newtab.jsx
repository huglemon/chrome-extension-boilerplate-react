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
import { Toaster } from 'sonner';

import Background from '../../components/newtab/background';
import Clock from '../../components/newtab/clock';
import SearchBar from '../../components/newtab/searchBar';
import Link from '../../components/newtab/link/link';
import Add from '../../components/newtab/link/add';
import Import from '../../components/newtab/link/import';
import Sidebar from '../../components/newtab/sidebar/sidebar';

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
  // 当前选中的分类ID
  const [activeCategory, setActiveCategory] = useState(0);

  // 使用状态来按分类存储链接列表
  const [categorizedLinks, setCategorizedLinks] = useState({});

  // 跟踪拖动状态
  const isDragging = useRef(false);
  // 当前拖动的项
  const [activeId, setActiveId] = useState(null);

  // 从配置文件获取默认分类和链接数据
  const { categories } = linkConfig;

  // 初始化默认链接数据
  useEffect(() => {
    const initialLinks = {};
    categories.forEach((category) => {
      initialLinks[category.id] = category.links || [];
    });
    initialLinks[5] = []; // 添加分类的空数组
    setCategorizedLinks(initialLinks);
  }, []);

  // 获取当前分类的链接
  const appLinks = categorizedLinks[activeCategory] || [];

  // 调试信息
  useEffect(() => {
    console.log('当前分类ID:', activeCategory);
    console.log('所有分类数据:', categories);
    console.log('当前分类的链接:', appLinks);
    console.log('所有分类的链接:', categorizedLinks);
  }, [activeCategory, appLinks, categorizedLinks, categories]);

  // 每个分类的最大链接数量
  const MAX_LINKS_PER_CATEGORY = 45;

  // 添加自定义分类
  const [customCategories, setCustomCategories] = useState([]);

  // 获取所有分类（预设 + 自定义）
  const allCategories = [
    ...categories,
    ...customCategories,
    { id: 5, name: '添加', icon: 'Plus' }, // 添加分组始终放在最后
  ];

  // 处理分类变更
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

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

  // 在组件挂载时从本地存储加载链接和自定义分类
  useEffect(() => {
    // 尝试从本地存储加载链接
    const loadLinksFromStorage = async () => {
      try {
        // 首先尝试使用 chrome.storage.local (推荐用于 Chrome 扩展)
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(
            ['categorizedLinks', 'customCategories'],
            (result) => {
              if (result.categorizedLinks) {
                // 合并本地存储的链接和默认链接
                const updatedLinks = { ...result.categorizedLinks };
                categories.forEach((category) => {
                  if (
                    !updatedLinks[category.id] ||
                    updatedLinks[category.id].length === 0
                  ) {
                    updatedLinks[category.id] = category.links || [];
                  }
                });
                setCategorizedLinks(updatedLinks);
                chrome.storage.local.set({ categorizedLinks: updatedLinks });
              } else {
                // 如果没有保存的链接，使用默认链接并保存到存储
                const initialLinks = {};
                categories.forEach((category) => {
                  initialLinks[category.id] = category.links || [];
                });
                initialLinks[5] = []; // 添加分类
                setCategorizedLinks(initialLinks);
                chrome.storage.local.set({ categorizedLinks: initialLinks });
              }

              // 加载自定义分类
              if (result.customCategories) {
                setCustomCategories(result.customCategories);
              }
            }
          );
        } else {
          // 回退到使用 localStorage
          const savedLinks = localStorage.getItem('categorizedLinks');
          if (savedLinks) {
            const parsedLinks = JSON.parse(savedLinks);
            // 合并本地存储的链接和默认链接
            const updatedLinks = { ...parsedLinks };
            categories.forEach((category) => {
              if (
                !updatedLinks[category.id] ||
                updatedLinks[category.id].length === 0
              ) {
                updatedLinks[category.id] = category.links || [];
              }
            });
            setCategorizedLinks(updatedLinks);
            localStorage.setItem(
              'categorizedLinks',
              JSON.stringify(updatedLinks)
            );
          } else {
            // 如果没有保存的链接，使用默认链接并保存到存储
            const initialLinks = {};
            categories.forEach((category) => {
              initialLinks[category.id] = category.links || [];
            });
            initialLinks[5] = []; // 添加分类
            setCategorizedLinks(initialLinks);
            localStorage.setItem(
              'categorizedLinks',
              JSON.stringify(initialLinks)
            );
          }

          // 加载自定义分类
          const savedCategories = localStorage.getItem('customCategories');
          if (savedCategories) {
            setCustomCategories(JSON.parse(savedCategories));
          }
        }
      } catch (error) {
        console.error('加载数据时出错:', error);
        // 出错时使用默认链接
        const initialLinks = {};
        categories.forEach((category) => {
          initialLinks[category.id] = category.links || [];
        });
        initialLinks[5] = []; // 添加分类
        setCategorizedLinks(initialLinks);
      }
    };

    loadLinksFromStorage();
  }, [categories]);

  // 保存链接到本地存储
  const saveLinksToStorage = (links) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ categorizedLinks: links });
      } else {
        localStorage.setItem('categorizedLinks', JSON.stringify(links));
      }
    } catch (error) {
      console.error('保存链接时出错:', error);
    }
  };

  // 保存自定义分类到本地存储
  const saveCategoriesToStorage = (categories) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ customCategories: categories });
      } else {
        localStorage.setItem('customCategories', JSON.stringify(categories));
      }
    } catch (error) {
      console.error('保存分类时出错:', error);
    }
  };

  // 添加新链接
  const addLink = (newLink) => {
    const currentLinks = categorizedLinks[activeCategory] || [];

    // 检查是否达到最大限制
    if (currentLinks.length >= MAX_LINKS_PER_CATEGORY) {
      alert(
        `每个分类最多只能添加${MAX_LINKS_PER_CATEGORY}个链接，请删除一些后再添加。`
      );
      return;
    }

    const updatedLinks = {
      ...categorizedLinks,
      [activeCategory]: [...currentLinks, newLink],
    };
    setCategorizedLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 批量导入收藏夹链接
  const importLinks = (links) => {
    if (!links || links.length === 0) return;

    const currentLinks = categorizedLinks[activeCategory] || [];
    const remainingSlots = MAX_LINKS_PER_CATEGORY - currentLinks.length;

    // 检查是否有足够的空间添加所有链接
    if (remainingSlots <= 0) {
      alert(
        `此分类已达到${MAX_LINKS_PER_CATEGORY}个链接的上限，无法导入更多链接。请先删除一些链接或选择其他分类。`
      );
      return;
    }

    // 如果空间不足以导入所有链接，只导入部分
    const linksToImport =
      links.length > remainingSlots ? links.slice(0, remainingSlots) : links;

    // 更新链接列表
    const updatedLinks = {
      ...categorizedLinks,
      [activeCategory]: [...currentLinks, ...linksToImport],
    };
    setCategorizedLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);

    // 显示导入成功消息
    if (links.length > remainingSlots) {
      alert(
        `成功导入了 ${linksToImport.length} 个收藏夹链接到"${getCategoryName(
          activeCategory
        )}"分类。\n由于已达到${MAX_LINKS_PER_CATEGORY}个链接的上限，剩余的 ${
          links.length - remainingSlots
        } 个链接未能导入。`
      );
    } else {
      alert(
        `成功导入了 ${linksToImport.length} 个收藏夹链接到"${getCategoryName(
          activeCategory
        )}"分类`
      );
    }
  };

  // 获取分类名称
  const getCategoryName = (categoryId) => {
    const category = allCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : '未知分类';
  };

  // 删除链接
  const removeLink = (index) => {
    const currentLinks = [...(categorizedLinks[activeCategory] || [])];
    const updatedCategoryLinks = currentLinks.filter((_, i) => i !== index);

    const updatedLinks = {
      ...categorizedLinks,
      [activeCategory]: updatedCategoryLinks,
    };

    setCategorizedLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 编辑链接
  const editLink = (index, updatedLink) => {
    const currentLinks = [...(categorizedLinks[activeCategory] || [])];
    currentLinks[index] = updatedLink;

    const updatedLinks = {
      ...categorizedLinks,
      [activeCategory]: currentLinks,
    };

    setCategorizedLinks(updatedLinks);
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

      // 重新排序当前分类的链接
      const currentLinks = [...(categorizedLinks[activeCategory] || [])];
      const reorderedLinks = arrayMove(currentLinks, activeIndex, overIndex);

      const updatedLinks = {
        ...categorizedLinks,
        [activeCategory]: reorderedLinks,
      };

      // 更新状态并保存
      setCategorizedLinks(updatedLinks);
      // 使用请求动画帧来延迟保存，避免可能的性能问题
      requestAnimationFrame(() => saveLinksToStorage(updatedLinks));
    }
  };

  // 处理点击事件，阻止拖动时的链接点击
  const handleClickCapture = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 重置当前分类的链接到默认配置
  const resetLinksToDefault = () => {
    const category = categories.find((cat) => cat.id === activeCategory);
    const defaultLinks = category ? category.links : [];

    const updatedLinks = {
      ...categorizedLinks,
      [activeCategory]: defaultLinks,
    };

    setCategorizedLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 添加新分类
  const addCategory = (newCategory) => {
    // 生成唯一ID（使用当前时间戳）
    const newCategoryId = Date.now();

    // 创建新分类对象
    const categoryToAdd = {
      id: newCategoryId,
      name: newCategory.name,
      icon: newCategory.icon,
    };

    // 添加到自定义分类列表
    const updatedCategories = [...customCategories, categoryToAdd];
    setCustomCategories(updatedCategories);

    // 为新分类创建空的链接数组
    const updatedLinks = {
      ...categorizedLinks,
      [newCategoryId]: [],
    };
    setCategorizedLinks(updatedLinks);

    // 保存到存储
    saveCategoriesToStorage(updatedCategories);
    saveLinksToStorage(updatedLinks);

    // 切换到新创建的分类
    setActiveCategory(newCategoryId);
  };

  // 编辑分类
  const editCategory = (categoryId, updatedCategory) => {
    // 查找要编辑的分类
    const categoryIndex = customCategories.findIndex(
      (cat) => cat.id === categoryId
    );

    // 如果是默认分类或找不到分类，不进行编辑
    if (categoryIndex === -1 || categoryId < 5) return;

    // 更新分类信息
    const updatedCategories = [...customCategories];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      name: updatedCategory.name,
      icon: updatedCategory.icon,
    };

    // 更新状态并保存
    setCustomCategories(updatedCategories);
    saveCategoriesToStorage(updatedCategories);
  };

  // 删除分类
  const deleteCategory = (categoryId) => {
    // 查找要删除的分类
    const categoryToDelete = customCategories.find(
      (cat) => cat.id === categoryId
    );

    // 如果是默认分类或找不到分类，不进行删除
    if (!categoryToDelete || categoryId < 5) return;

    // 提示用户确认删除
    const confirmDelete = window.confirm(
      `确定要删除"${categoryToDelete.name}"分类吗？此操作将删除该分类下的所有链接。`
    );
    if (!confirmDelete) return;

    // 从自定义分类列表中移除
    const updatedCategories = customCategories.filter(
      (cat) => cat.id !== categoryId
    );
    setCustomCategories(updatedCategories);

    // 从链接列表中移除该分类的链接
    const { [categoryId]: removedLinks, ...remainingLinks } = categorizedLinks;
    setCategorizedLinks(remainingLinks);

    // 保存到存储
    saveCategoriesToStorage(updatedCategories);
    saveLinksToStorage(remainingLinks);

    // 如果当前正在查看被删除的分类，则切换到主页
    if (activeCategory === categoryId) {
      setActiveCategory(0);
    }
  };

  return (
    <div className="newtab">
      <Toaster position="top-center" />
      <Background onReset={resetLinksToDefault}>
        <div className="flex">
          {/* 侧边栏 */}
          <Sidebar
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onAddCategory={addCategory}
            onEditCategory={editCategory}
            onDeleteCategory={deleteCategory}
            customCategories={customCategories}
          />

          {/* 主内容区 */}
          <div className="flex-1 min-h-screen text-foreground py-10">
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
                    {appLinks.length > 0 ? (
                      appLinks.map((app, index) => (
                        <SortableLink
                          key={`${app.name}-${index}`}
                          app={app}
                          index={index}
                          onEdit={editLink}
                          onDelete={removeLink}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500">
                        当前分类暂无链接
                      </div>
                    )}

                    {/* 添加按钮 - 不需要排序 */}
                    <div>
                      <Add onAdd={addLink} />
                    </div>
                    <Import onImport={importLinks} />
                  </div>
                </SortableContext>

                {/* 拖动覆盖层 - 提供更流畅的视觉反馈 */}
                <DragOverlay adjustScale={true}>
                  {activeId ? (
                    <div className="opacity-80">
                      <Link
                        {...appLinks[parseInt(activeId.split('-').pop())]}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>
      </Background>
    </div>
  );
};

export default Newtab;
