import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Code,
  Palette,
  Lightbulb,
  Camera,
  Settings,
  User,
  Plus,
  Box,
  Heart,
  Music,
  MessageCircle,
  Briefcase,
  GamepadIcon,
  Search,
  ThumbsUp,
  Star,
  FileCode,
  GraduationCap,
  Book,
  Globe,
  Rocket,
  Zap,
  Grid,
  Award,
  Compass,
  Flag,
  Database,
  Send,
  Bookmark,
  Target,
  Cpu,
  Truck,
  ShoppingBag,
  HeartHandshake,
  Newspaper,
  Package,
  Store,
  TrendingUp,
} from 'lucide-react';
import AddCategoryModal from './AddCategoryModal';
import linkConfig from '../link/config.json';

export default function Sidebar({
  activeCategory = 0,
  onCategoryChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  customCategories = [],
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    categoryId: null,
  });
  const sidebarRef = useRef(null);

  // 从配置文件获取默认分类
  const { categories } = linkConfig;

  // 图标映射表
  const iconComponents = {
    Home,
    Code,
    Palette,
    Lightbulb,
    Camera,
    Plus,
    Box,
    Heart,
    Music,
    MessageCircle,
    Briefcase,
    GamepadIcon,
    Search,
    ThumbsUp,
    Star,
    FileCode,
    GraduationCap,
    Book,
    Globe,
    Rocket,
    Zap,
    Grid,
    Award,
    Compass,
    Flag,
    Database,
    Send,
    Bookmark,
    Target,
    Cpu,
    Truck,
    ShoppingBag,
    HeartHandshake,
    Newspaper,
    Package,
    Store,
    TrendingUp,
  };

  // 处理预设分类 - 将icon字符串转换为组件
  const defaultCategories = categories.map((category) => ({
    ...category,
    icon: iconComponents[category.icon] || Home, // 如果找不到指定的图标，使用Home作为默认
  }));

  // 添加分组（总是放在最后）
  const addCategory = { id: 5, name: '添加', icon: Plus };

  // 合并默认和自定义分类
  const allCategories = [
    ...defaultCategories,
    ...customCategories.map((cat) => ({
      ...cat,
      icon: iconComponents[cat.icon] || Home, // 如果找不到指定的图标，使用Home作为默认
    })),
    addCategory, // 确保添加分组始终在最后
  ];

  // 切换分类
  function handleCategoryChange(categoryId) {
    if (categoryId === 5) {
      // 如果点击的是"添加"按钮，打开添加分类弹窗
      setIsAddModalOpen(true);
      return;
    }

    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  }

  // 处理添加新分类
  function handleAddCategory(newCategory) {
    if (onAddCategory) {
      onAddCategory(newCategory);
    }
  }

  // 处理右击事件
  function handleContextMenu(e, category) {
    e.preventDefault();

    // 不为"添加"分组（id为5）显示右击菜单
    if (category.id === 5) return;

    // 计算菜单位置
    const rect = sidebarRef.current.getBoundingClientRect();
    setContextMenu({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      categoryId: category.id,
    });
  }

  // 处理编辑分类
  function handleEditCategory() {
    // 找到当前正在编辑的分类
    const categoryToEdit = allCategories.find(
      (cat) => cat.id === contextMenu.categoryId
    );
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setIsEditModalOpen(true);
    }
    setContextMenu({ ...contextMenu, visible: false });
  }

  // 处理删除分类
  function handleDeleteCategory() {
    if (onDeleteCategory && contextMenu.categoryId) {
      onDeleteCategory(contextMenu.categoryId);
    }
    setContextMenu({ ...contextMenu, visible: false });
  }

  // 保存编辑后的分类
  function handleSaveEdit(updatedCategory) {
    if (onEditCategory && editingCategory) {
      onEditCategory(editingCategory.id, updatedCategory);
    }
    setIsEditModalOpen(false);
    setEditingCategory(null);
  }

  // 关闭上下文菜单
  function handleCloseContextMenu() {
    setContextMenu({ ...contextMenu, visible: false });
  }

  // 点击外部时关闭菜单
  useEffect(() => {
    function handleOutsideClick() {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [contextMenu]);

  return (
    <>
      <div
        ref={sidebarRef}
        className="flex flex-col items-center justify-between h-screen py-4 w-12 bg-gray-900/30 backdrop-blur-sm text-gray-300"
        onClick={handleCloseContextMenu}
      >
        {/* 上半部分：用户头像和分类图标 */}
        <div className="flex flex-col items-center gap-8">
          {/* 用户头像 */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center hover:text-white transition-colors">
            <User size={18} />
          </div>

          {/* 分类图标列表 */}
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] no-scrollbar">
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                onContextMenu={(e) => handleContextMenu(e, category)}
                className={`w-10 h-10 flex flex-col items-center justify-center gap-1 transition-all relative ${
                  activeCategory === category.id
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title={category.name}
              >
                {React.createElement(category.icon, { size: 20 })}
                <span className="text-[10px]">{category.name.slice(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 底部设置按钮 */}
        <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
          <Settings size={18} />
        </div>
      </div>

      {/* 右键菜单 */}
      {contextMenu.visible && (
        <div
          className="absolute bg-gray-800 border border-gray-700 shadow-lg rounded-md py-1 z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
            onClick={handleEditCategory}
          >
            编辑分类
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
            onClick={handleDeleteCategory}
          >
            删除分类
          </button>
        </div>
      )}

      {/* 添加分类弹窗 */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCategory}
      />

      {/* 编辑分类弹窗 */}
      <AddCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialCategory={editingCategory}
      />
    </>
  );
}
