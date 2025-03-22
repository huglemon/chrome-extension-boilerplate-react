import React, { useState, useEffect } from 'react';
import {
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
} from 'lucide-react';

const ICONS = {
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

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
  initialCategory = null,
}) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // 当initialCategory变化时，预填充表单
  useEffect(() => {
    if (initialCategory) {
      setCategoryName(initialCategory.name || '');
      // 如果是组件对象，则获取名称，否则使用字符串名称
      const iconName =
        typeof initialCategory.icon === 'string'
          ? initialCategory.icon
          : initialCategory.icon.name || initialCategory.icon.displayName;
      setSelectedIcon(iconName);
    }
  }, [initialCategory]);

  // 如果不是打开状态，不渲染组件
  if (!isOpen) return null;

  function handleSave() {
    // 验证输入
    if (!selectedIcon || !categoryName.trim()) {
      alert('请选择图标并输入分组名称');
      return;
    }

    // 调用保存函数并传递新分组数据
    onSave({
      name: categoryName,
      icon: selectedIcon,
    });

    // 重置状态
    setSelectedIcon(null);
    setCategoryName('');
    onClose();
  }

  // 创建图标数组
  const iconList = Object.keys(ICONS).map((name) => ({
    name,
    component: ICONS[name],
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 弹窗内容 */}
      <div className="bg-white rounded-lg shadow-xl w-80 max-h-[90vh] overflow-hidden flex flex-col z-10">
        {/* 标题 */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">
            {initialCategory ? '编辑分组' : '添加分组'}
          </h2>
        </div>

        {/* 图标选择网格 */}
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-7 gap-2">
            {iconList.map((icon) => (
              <button
                key={icon.name}
                onClick={() => setSelectedIcon(icon.name)}
                className={`w-9 h-9 flex items-center justify-center rounded ${
                  selectedIcon === icon.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-black/20 text-black/60 hover:bg-black/30'
                }`}
              >
                {React.createElement(icon.component, { size: 18 })}
              </button>
            ))}
          </div>
        </div>

        {/* 名称输入 */}
        <div className="p-4 border-t">
          <input
            type="text"
            placeholder="名称"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 rounded border placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent text-white hover:bg-slate-700 rounded"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
