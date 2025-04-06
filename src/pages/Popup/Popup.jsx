import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '../../components/ui/card';
import LinkForm from '../../components/newtab/link/form';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';

// 导入默认配置，用于获取默认图标颜色等信息
import linkConfig from '../../components/newtab/link/config.json';

function Popup() {
  const [currentTab, setCurrentTab] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 初始化默认表单数据
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    bgColor: '#FFFFFF',
    textIcon: '',
    textBgColor: '#ff4757',
    categoryId: 0, // 默认为"主页"分类
  });

  // 处理标签页数据
  const processTabData = useCallback((tab) => {
    try {
      console.log('开始处理标签页数据, 完整标签对象:', JSON.stringify(tab));

      // 检查标签页是否包含必要的属性
      if (!tab) {
        throw new Error('标签页对象为空');
      }

      // 获取当前网站的图标（favicon）
      const icon = tab.favIconUrl || '';
      console.log('图标URL:', icon);

      // 获取标题和URL（添加日志以帮助调试）
      const title = tab.title || '';
      const url = tab.url || '';
      console.log('标题:', title);
      console.log('URL:', url);

      // 从标题中提取第一个字符作为文本图标
      const textIcon = title ? title.charAt(0).toUpperCase() : '';
      console.log('文本图标:', textIcon);

      // 从URL提取域名作为备用名称
      let domain = '';
      try {
        if (url && url.trim() !== '') {
          domain = new URL(url).hostname.replace('www.', '');
          console.log('提取的域名:', domain);
        } else {
          console.log('URL为空，无法提取域名');
        }
      } catch (e) {
        console.error('提取域名时出错:', e);
        domain = '';
      }

      // 更新状态
      setCurrentTab(tab);
      setFormData({
        name: title || domain || '',
        url: url || '',
        icon: icon,
        bgColor: '#FFFFFF',
        textIcon: textIcon,
        textBgColor: linkConfig.defaultAppLinks[0].textBgColor || '#ff4757',
        categoryId: 0, // 将链接添加到"主页"分类
      });

      console.log('标签页数据处理完成');
      setIsLoading(false);
    } catch (err) {
      console.error('处理标签页数据时出错:', err);
      setError(`处理标签页数据时出错: ${err.message || '未知错误'}`);
      setIsLoading(false);
    }
  }, []);

  // 创建一个获取当前页面信息的函数
  const getCurrentPage = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('开始获取当前页面信息');

      // 检查是在Chrome扩展环境还是开发环境
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        console.log('Chrome扩展环境已检测到');

        // Chrome扩展环境
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log('chrome.tabs.query 返回结果:', tabs);

          if (tabs && tabs.length > 0) {
            const tab = tabs[0];
            console.log('获取到当前标签页:', tab);

            // 检查是否需要额外权限
            if (!tab.url) {
              console.log('标签页URL为空，尝试获取完整标签信息');

              // 尝试使用chrome.tabs.get获取更完整的标签信息
              if (tab.id) {
                chrome.tabs.get(tab.id, (fullTab) => {
                  console.log(
                    '通过chrome.tabs.get获取的完整标签信息:',
                    fullTab
                  );
                  processTabData(fullTab);
                });
              } else {
                processTabData(tab);
              }
            } else {
              processTabData(tab);
            }
          } else {
            console.error('未能获取当前标签页信息，tabs为空');
            setError('无法获取当前标签页信息');
            setIsLoading(false);
          }
        });
      } else {
        console.log('开发环境，使用模拟数据');

        // 开发环境 - 使用模拟数据
        const mockTab = {
          title: document.title || '开发站点',
          url: window.location.href,
          favIconUrl: '/favicon.ico',
        };
        console.log('模拟标签页数据:', mockTab);
        processTabData(mockTab);
      }
    } catch (err) {
      console.error('获取页面信息时出错:', err);
      setError(`获取页面信息时出错: ${err.message || '未知错误'}`);
      setIsLoading(false);
    }
  }, [processTabData]);

  // 组件加载时获取当前标签页信息
  useEffect(() => {
    getCurrentPage();
  }, [getCurrentPage]);

  // 处理表单提交
  const handleSubmit = (formData) => {
    setIsSaving(true);
    setError('');

    // 保存到 chrome.storage.local 或 localStorage
    const saveData = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          // Chrome扩展环境
          chrome.storage.local.get(['appLinks'], (result) => {
            let currentLinks = result.appLinks || linkConfig.defaultAppLinks;
            // 确保categoryId存在，默认为0（主页分类）
            const linkWithCategory = {
              ...formData,
              categoryId: formData.categoryId ?? 0,
            };
            const updatedLinks = [...currentLinks, linkWithCategory];

            chrome.storage.local.set({ appLinks: updatedLinks }, () => {
              setIsSaving(false);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
            });
          });
        } else {
          // 开发环境
          const savedLinks = localStorage.getItem('appLinks');
          let currentLinks = savedLinks
            ? JSON.parse(savedLinks)
            : linkConfig.defaultAppLinks;

          // 确保categoryId存在，默认为0（主页分类）
          const linkWithCategory = {
            ...formData,
            categoryId: formData.categoryId ?? 0,
          };
          const updatedLinks = [...currentLinks, linkWithCategory];
          localStorage.setItem('appLinks', JSON.stringify(updatedLinks));

          setIsSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      } catch (err) {
        console.error('保存链接时出错:', err);
        setError('保存失败，请重试');
        setIsSaving(false);
      }
    };

    saveData();
  };

  return (
    <div className="flex items-center justify-center rounded-lg w-[400px] bg-white">
      <Card className="w-full max-w-lg rounded-none">
        <CardHeader className="text-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            添加当前网站
          </h2>
        </CardHeader>

        <CardContent className="mt-4">
          {saveSuccess ? (
            <div className="text-center py-8 px-2">
              <div className="text-5xl mb-3">✅</div>
              <div className="text-green-400 text-lg font-semibold mb-2">
                添加成功!
              </div>
              <p className="text-sm text-gray-300">
                网站图标已添加到您的新标签页
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="text-red-400 text-sm mb-3 p-2 bg-red-900/20 rounded border border-red-500/20">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p className="text-gray-300">正在加载页面信息...</p>
                </div>
              ) : currentTab ? (
                <LinkForm
                  initialData={formData}
                  onSubmit={handleSubmit}
                  onCancel={() => {}}
                  submitLabel="添加到新标签页"
                  isSubmitting={isSaving}
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-300">无法获取页面信息</p>
                  <Button
                    onClick={getCurrentPage}
                    className="mt-3"
                    variant="outline"
                    size="sm"
                  >
                    重试
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Popup;
