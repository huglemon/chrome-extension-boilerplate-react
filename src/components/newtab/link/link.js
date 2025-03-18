import React from 'react';
import { cn } from '../../../lib/utils';

export default function Link({
  icon, // 网站图标URL或组件
  textIcon, // 文字图标内容
  url, // 链接目标URL
  name, // 链接名称
  bgColor = '#fff', // 默认背景色
  textBgColor = '#ff4757', // 文字图标背景色，默认红色
  className,
  ...props
}) {
  // 处理点击事件，在新标签页打开链接
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={handleClick}
      {...props}
    >
      {/* 网站图标 */}
      <div
        className={cn(
          'bg-white/90 border shadow-sm relative w-16 h-16 p-4 rounded-xl flex items-center justify-center overflow-hidden',
          className
        )}
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
            className="absolute -top-1 -right-1 w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-medium line"
            style={{ backgroundColor: textBgColor }}
          >
            {textIcon}
          </div>
        )}
      </div>

      {/* 链接名称 */}
      <span className="text-sm text-white text-center mt-1 line-clamp-1">
        {name}
      </span>
    </div>
  );
}
