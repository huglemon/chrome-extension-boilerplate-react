import React, { useState } from 'react';
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
} from 'lucide-react';
import AddCategoryModal from './AddCategoryModal';

export default function Sidebar({
  activeCategory = 0,
  onCategoryChange,
  onAddCategory,
  customCategories = [],
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 分类数据
  const defaultCategories = [
    { id: 0, name: '主页', icon: Home },
    { id: 1, name: '程序员', icon: Code },
    { id: 2, name: '设计', icon: Palette },
    { id: 3, name: '产品', icon: Lightbulb },
    { id: 4, name: '摄影', icon: Camera },
  ];

  // 添加分组（总是放在最后）
  const addCategory = { id: 5, name: '添加', icon: Plus };

  // 处理自定义分类 - 这里需要将icon字符串转换为组件
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
  };

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

  return (
    <>
      <div className="flex flex-col items-center justify-between h-screen py-4 w-12 bg-gray-900/30 backdrop-blur-sm text-gray-300">
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
                className={`w-8 h-8 flex items-center justify-center transition-all relative ${
                  activeCategory === category.id
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title={category.name}
              >
                {React.createElement(category.icon, { size: 18 })}
                {activeCategory === category.id && (
                  <span className="absolute left-0 w-1 h-5 bg-blue-400 rounded-r-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 底部设置按钮 */}
        <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
          <Settings size={18} />
        </div>
      </div>

      {/* 添加分类弹窗 */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCategory}
      />
    </>
  );
}
