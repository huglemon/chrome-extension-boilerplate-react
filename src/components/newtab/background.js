import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export default function Background({ children }) {
  const [backgrounds, setBackgrounds] = useState([]);
  const [currentBg, setCurrentBg] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取Bing每日图片
  const fetchBingImages = async () => {
    try {
      setLoading(true);
      // Bing图片API，获取最近8张图片
      const response = await fetch(
        'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8'
      );
      const data = await response.json();

      const images = data.images.map((img) => ({
        url: `https://www.bing.com${img.url}`,
        title: img.title,
        copyright: img.copyright,
      }));

      setBackgrounds(images);
      // 设置第一张图片作为初始背景
      if (images.length > 0 && !currentBg) {
        setCurrentBg(images[0]);
      }
    } catch (error) {
      console.error('获取Bing图片失败:', error);
      // 加载失败时使用备用颜色渐变
      setCurrentBg({
        url: null,
        isGradient: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取背景图
  useEffect(() => {
    fetchBingImages();
  }, []);

  // 随机切换背景图
  const changeBackground = () => {
    if (backgrounds.length <= 1) return;

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * backgrounds.length);
    } while (backgrounds[newIndex].url === currentBg?.url);

    setCurrentBg(backgrounds[newIndex]);
  };

  // 生成背景样式
  const getBackgroundStyle = () => {
    if (loading) {
      return { backgroundColor: '#f0f0f0' };
    }

    if (currentBg?.isGradient) {
      return {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
    }

    return {
      backgroundImage: `url(${currentBg?.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      zIndex: '-1',
    };
  };

  return (
    <div className="fixed inset-0 w-full h-full" style={getBackgroundStyle()}>
      {/* 半透明暗色覆盖层，提高文字可读性 */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* 切换按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm hover:bg-background/70 z-10"
        onClick={changeBackground}
        title="切换背景"
      >
        <RefreshCw className="h-5 w-5" />
      </Button>

      {/* 版权信息 */}
      {currentBg?.copyright && (
        <div className="absolute bottom-2 right-2 text-xs text-white opacity-70 max-w-xs text-right">
          {currentBg.copyright}
        </div>
      )}

      {/* 内容 */}
      <div className="relative z-0 w-full h-full">{children}</div>
    </div>
  );
}
