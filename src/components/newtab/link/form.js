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

  // 当初始数据变化时更新表单数据
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          名称
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="链接名称"
        />
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
        <Input
          id="icon"
          name="icon"
          value={typeof formData.icon === 'string' ? formData.icon : ''}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="图标URL地址或SVG代码"
        />
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
