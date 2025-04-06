import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

// 链接表单组件，用于编辑和添加链接
export default function LinkForm({
  initialData = {
    name: '',
    url: '',
    icon: '',
    bgColor: '#FFFFFF',
    textIcon: '',
    textBgColor: '#ff4757',
  },
  onSubmit,
  onCancel,
  submitLabel = '保存',
}) {
  // 表单数据状态
  const [formData, setFormData] = useState(initialData);
  // 图像颜色分析状态
  const [isExtracting, setIsExtracting] = useState(false);

  // 当初始数据变化时更新表单数据
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 对名称字段进行长度限制
    if (name === 'name' && value.length > 20) {
      // 截断超过20个字符的名称
      setFormData({ ...formData, [name]: value.substring(0, 20) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // 从图像中提取主色调并设置背景色
  const extractColorFromIcon = async () => {
    const iconUrl = formData.icon;

    if (!iconUrl) {
      alert('请先输入图标URL');
      return;
    }

    try {
      setIsExtracting(true);

      // 创建图像对象
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      // 等待图像加载完成
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('图像加载失败'));
        // 添加时间戳或随机参数避免缓存问题
        img.src = iconUrl.includes('?')
          ? `${iconUrl}&_t=${Date.now()}`
          : `${iconUrl}?_t=${Date.now()}`;
      });

      // 创建canvas并绘制图像
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 获取图像数据
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      // 分析主色调
      const colorCounts = {};
      const significantColors = [];

      // 分析每个像素
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // 跳过透明像素
        if (a < 128) continue;

        // 简化颜色，减少颜色数量
        const quantizedR = Math.round(r / 10) * 10;
        const quantizedG = Math.round(g / 10) * 10;
        const quantizedB = Math.round(b / 10) * 10;

        const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

        if (!colorCounts[colorKey]) {
          colorCounts[colorKey] = 0;
          significantColors.push({
            r: quantizedR,
            g: quantizedG,
            b: quantizedB,
          });
        }
        colorCounts[colorKey]++;
      }

      // 按出现频率排序颜色
      significantColors.sort((a, b) => {
        const countA = colorCounts[`${a.r},${a.g},${a.b}`];
        const countB = colorCounts[`${b.r},${b.g},${b.b}`];
        return countB - countA;
      });

      if (significantColors.length === 0) {
        throw new Error('无法从图像中提取颜色');
      }

      // 获取主色调
      const dominantColor = significantColors[0];

      // 计算HSL，以便调整亮度和饱和度
      const { h, s, l } = rgbToHsl(
        dominantColor.r,
        dominantColor.g,
        dominantColor.b
      );

      // 调整背景色 - 亮色图标使用深色背景，深色图标使用亮色背景
      // 保持色相不变，调整亮度和饱和度
      let bgL = l > 0.5 ? Math.max(0.1, l - 0.5) : Math.min(0.9, l + 0.5);
      let bgS = Math.min(0.9, s * 1.2); // 略微增加饱和度

      // 将HSL转回RGB，然后转为十六进制颜色代码
      const bgColor = hslToHex(h, bgS, bgL);

      // 更新表单数据
      setFormData((prev) => ({ ...prev, bgColor }));
    } catch (error) {
      console.error('提取颜色失败:', error);
      alert(`提取颜色失败: ${error.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // RGB转HSL辅助函数
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // 灰色
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return { h, s, l };
  }

  // HSL转十六进制颜色代码
  function hslToHex(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // 灰色
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    // 转为十六进制
    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // 处理表单提交
  const handleSubmit = () => {
    // 表单验证
    if (!formData.name.trim() || !formData.url.trim()) {
      alert('名称和URL不能为空！');
      return;
    }

    // 调用提交回调
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // 阻止事件冒泡到下层拖拽组件
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="grid gap-4 py-4"
      onMouseDown={stopPropagation}
      onMouseMove={stopPropagation}
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          名称
        </Label>
        <div className="col-span-3">
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full"
            placeholder="链接名称"
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">
            最多输入20个字符 ({formData.name.length}/20)
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right">
          URL
        </Label>
        <Input
          id="url"
          name="url"
          value={formData.url}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://example.com"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">
          图标URL
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="icon"
            name="icon"
            value={typeof formData.icon === 'string' ? formData.icon : ''}
            onChange={handleInputChange}
            className="flex-1"
            placeholder="图标URL地址或SVG代码"
          />
          <Button
            variant="outline"
            onClick={extractColorFromIcon}
            disabled={isExtracting || !formData.icon}
          >
            {isExtracting ? '提取中...' : '提取颜色'}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="bgColor" className="text-right">
          背景颜色
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="bgColor"
            name="bgColor"
            value={formData.bgColor}
            onChange={handleInputChange}
            className="flex-1"
            placeholder="#FFFFFF"
          />
          <div
            className="w-10 h-10 rounded border"
            style={{ backgroundColor: formData.bgColor }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="textIcon" className="text-right">
          文字图标
        </Label>
        <Input
          id="textIcon"
          name="textIcon"
          value={formData.textIcon || ''}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="如：New"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="textBgColor" className="text-right">
          文字图标背景色
        </Label>
        <div className="col-span-3 flex gap-2">
          <Input
            id="textBgColor"
            name="textBgColor"
            value={formData.textBgColor || '#ff4757'}
            onChange={handleInputChange}
            className="flex-1"
            placeholder="#ff4757"
          />
          <div
            className="w-10 h-10 rounded border"
            style={{ backgroundColor: formData.textBgColor || '#ff4757' }}
          ></div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
