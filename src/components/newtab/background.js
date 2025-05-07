import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, History, Download, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
// 导入配置文件
import linkConfig from './link/config.json';

export default function Background({ children, onReset }) {
  const [backgrounds, setBackgrounds] = useState([]);
  const [currentBg, setCurrentBg] = useState(null);
  const [loading, setLoading] = useState(true);
  // 重置确认对话框状态
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

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

  // 处理重置链接的点击事件
  const handleResetConfirm = () => {
    onReset && onReset();
    setResetDialogOpen(false);
  };

  // 导出链接数据
  const handleExportLinks = async () => {
    try {
      let linksData, customCategories;

      // 首先尝试使用 chrome.storage.local
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await new Promise((resolve) => {
          chrome.storage.local.get(
            ['categorizedLinks', 'customCategories'],
            resolve
          );
        });
        linksData = result.categorizedLinks;
        customCategories = result.customCategories;
      } else {
        // 回退到使用 localStorage
        const savedLinks = localStorage.getItem('categorizedLinks');
        const savedCategories = localStorage.getItem('customCategories');
        if (savedLinks) {
          linksData = JSON.parse(savedLinks);
        }
        if (savedCategories) {
          customCategories = JSON.parse(savedCategories);
        }
      }

      if (!linksData) {
        toast.error('没有找到可导出的链接数据');
        return;
      }

      // 创建导出数据对象
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          links: linksData,
          categories: {
            default: linkConfig.categories, // 预设分组
            custom: customCategories || [], // 自定义分组
          },
        },
      };

      // 转换为 JSON 字符串
      const jsonString = JSON.stringify(exportData, null, 2);

      // 创建 Blob 对象
      const blob = new Blob([jsonString], { type: 'application/json' });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inwind-links-${
        new Date().toISOString().split('T')[0]
      }.json`;

      // 触发下载
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('链接数据导出成功');
    } catch (error) {
      console.error('导出链接数据失败:', error);
      toast.error('导出链接数据失败');
    }
  };

  // 处理文件导入
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // 验证导入数据格式
      if (
        !importData.version ||
        !importData.data ||
        !importData.data.links ||
        !importData.data.categories
      ) {
        toast.error('导入文件格式不正确');
        return;
      }

      // 显示确认对话框
      setImportDialogOpen(true);

      // 存储导入数据供确认后使用
      fileInputRef.current = importData;
    } catch (error) {
      console.error('读取导入文件失败:', error);
      toast.error('读取导入文件失败');
    }
  };

  // 确认导入
  const handleImportConfirm = async () => {
    const importData = fileInputRef.current;
    if (!importData) return;

    try {
      const { links, categories } = importData.data;

      // 保存到存储
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await new Promise((resolve) => {
          chrome.storage.local.set(
            {
              categorizedLinks: links,
              customCategories: categories.custom,
            },
            resolve
          );
        });
      } else {
        localStorage.setItem('categorizedLinks', JSON.stringify(links));
        localStorage.setItem(
          'customCategories',
          JSON.stringify(categories.custom)
        );
      }

      // 刷新页面以应用更改
      window.location.reload();

      toast.success('数据导入成功');
    } catch (error) {
      console.error('导入数据失败:', error);
      toast.error('导入数据失败');
    } finally {
      setImportDialogOpen(false);
    }
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

      {/* 按钮组 */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {/* 切换按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="group bg-black/10 backdrop-blur-sm hover:bg-black/70"
          onClick={changeBackground}
          title="切换背景"
        >
          <RefreshCw className="h-5 w-5 text-white/30 group-hover:text-white" />
        </Button>

        {/* 重置按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="group bg-black/10 backdrop-blur-sm hover:bg-black/70"
          onClick={() => setResetDialogOpen(true)}
          title="重置为默认链接"
        >
          <History className="h-5 w-5 text-white/30 group-hover:text-white" />
        </Button>

        {/* 导出按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="group bg-black/10 backdrop-blur-sm hover:bg-black/70"
          onClick={handleExportLinks}
          title="导出链接数据"
        >
          <Download className="h-5 w-5 text-white/30 group-hover:text-white" />
        </Button>

        {/* 导入按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="group bg-black/10 backdrop-blur-sm hover:bg-black/70"
          onClick={() => document.getElementById('import-file').click()}
          title="导入链接数据"
        >
          <Upload className="h-5 w-5 text-white/30 group-hover:text-white" />
        </Button>
        <input
          id="import-file"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      {/* 重置确认对话框 */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认重置</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要将所有链接重置为默认设置吗？此操作将删除所有自定义链接和排序。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleResetConfirm}
            >
              重置
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 导入确认对话框 */}
      <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认导入</AlertDialogTitle>
            <AlertDialogDescription>
              导入将覆盖所有现有的链接和分组数据。此操作不可撤销，您确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleImportConfirm}
            >
              确认导入
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 版权信息 */}
      {currentBg?.copyright && (
        <div className="absolute bottom-2 right-2 text-xs text-white opacity-20 max-w-xs text-right">
          {currentBg.copyright}
        </div>
      )}

      {/* 内容 */}
      <div className="relative z-0 w-full h-full">{children}</div>
    </div>
  );
}
