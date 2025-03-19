import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button } from '../../components/ui/button';
import Background from '../../components/newtab/background';
import Clock from '../../components/newtab/clock';
import SearchBar from '../../components/newtab/searchBar';
import Link from '../../components/newtab/link/link';
import Add from '../../components/newtab/link/add';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

// 启用响应式支持
const ResponsiveGridLayout = WidthProvider(Responsive);

const Newtab = () => {
  // 使用状态来存储链接列表
  const [appLinks, setAppLinks] = useState([]);

  // 默认链接数据
  const defaultAppLinks = [
    {
      name: '抖音',
      url: 'https://www.douyin.com',
      icon: 'https://lf1-cdn-tos.bytegoofy.com/goofy/toutiao/favicon.ico',
      bgColor: '#000000',
    },
    {
      name: '秘塔AI搜索',
      url: 'https://metaso.cn',
      icon: 'https://metaso.cn/favicon.ico',
      bgColor: '#1C5EDD',
    },
    {
      name: '美间AI设计',
      url: 'https://www.meijian.com',
      icon: 'https://cdn.meijian.com/common/img/favicon.ico',
      bgColor: '#FFFFFF',
    },
    {
      name: '专业AI论文写作',
      url: 'https://www.writefull.com',
      icon: 'https://www.writefull.com/favicon.ico',
      bgColor: '#4CAF50',
    },
    {
      name: '新浪微博',
      url: 'https://weibo.com',
      icon: 'https://weibo.com/favicon.ico',
      bgColor: '#FF8200',
    },
    {
      name: '智谱清言',
      url: 'https://chatglm.cn',
      icon: 'https://chatglm.cn/favicon.ico',
      bgColor: '#2C64E9',
    },
    {
      name: '阿里给娃',
      url: 'https://www.taobao.com',
      icon: 'https://img.alicdn.com/tfs/TB1qrJTRXXXXXagXFXXXXXXXXXX-16-16.ico',
      bgColor: '#FF5000',
    },
    {
      name: '壁纸',
      url: 'https://wall.alphacoders.com',
      icon: 'https://wall.alphacoders.com/favicon.ico',
      bgColor: '#20B2AA',
    },
    {
      name: '博思AI PPT',
      url: 'https://www.pptgo.com',
      icon: 'https://pptgo.cn/favicon.ico',
      bgColor: '#FF4A57',
    },
    {
      name: '免费AI写作',
      url: 'https://writesonic.com',
      icon: 'https://app-cdn.writesonic.com/static/landing/favicon.ico',
      bgColor: '#2673DD',
    },
    {
      name: 'Tara AI翻译',
      url: 'https://tara.ai',
      icon: 'https://tara.ai/favicon.ico',
      bgColor: '#FF4B4B',
    },
    {
      name: '哔哩哔哩',
      url: 'https://www.bilibili.com',
      icon: 'https://www.bilibili.com/favicon.ico',
      bgColor: '#FB7299',
    },
    {
      name: 'IT助手引导',
      url: 'https://github.com',
      icon: 'https://github.githubassets.com/favicons/favicon.png',
      bgColor: '#FFD700',
    },
    {
      name: '历史记录',
      url: 'chrome://history',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23039BE5" d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3M12,8V13L16.28,15.54L17,14.33L13.5,12.25V8H12Z"/></svg>',
      bgColor: '#039BE5',
    },
    {
      name: '扩展管理',
      url: 'chrome://extensions',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%238E8E8E" d="M20.5,11H19V7C19,5.89 18.1,5 17,5H13V3.5A2.5,2.5 0 0,0 10.5,1A2.5,2.5 0 0,0 8,3.5V5H4A2,2 0 0,0 2,7V10.8H3.5C5,10.8 6.2,12 6.2,13.5C6.2,15 5,16.2 3.5,16.2H2V20A2,2 0 0,0 4,22H7.8V20.5C7.8,19 9,17.8 10.5,17.8C12,17.8 13.2,19 13.2,20.5V22H17A2,2 0 0,0 19,20V16H20.5A2.5,2.5 0 0,0 23,13.5A2.5,2.5 0 0,0 20.5,11Z"/></svg>',
      bgColor: '#8E8E8E',
    },
    {
      name: '设置',
      url: 'chrome://settings',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%238E8E8E" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>',
      bgColor: '#8E8E8E',
    },
    {
      name: '添加图标',
      url: '#',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%234285F4" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>',
      bgColor: '#FFFFFF',
    },
  ];

  // 在组件挂载时从本地存储加载链接
  useEffect(() => {
    // 尝试从本地存储获取链接
    const loadLinksFromStorage = async () => {
      try {
        // 首先尝试使用 chrome.storage.local (推荐用于 Chrome 扩展)
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(['appLinks'], (result) => {
            if (result.appLinks) {
              setAppLinks(result.appLinks);
            } else {
              // 如果没有保存的链接，使用默认链接并保存到存储
              setAppLinks(defaultAppLinks);
              chrome.storage.local.set({ appLinks: defaultAppLinks });
            }
          });
        } else {
          // 回退到使用 localStorage
          const savedLinks = localStorage.getItem('appLinks');
          if (savedLinks) {
            setAppLinks(JSON.parse(savedLinks));
          } else {
            // 如果没有保存的链接，使用默认链接并保存到存储
            setAppLinks(defaultAppLinks);
            localStorage.setItem('appLinks', JSON.stringify(defaultAppLinks));
          }
        }
      } catch (error) {
        console.error('加载链接时出错:', error);
        setAppLinks(defaultAppLinks); // 出错时使用默认链接
      }
    };

    loadLinksFromStorage();
  }, []);

  // 保存链接到本地存储
  const saveLinksToStorage = (links) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ appLinks: links });
      } else {
        localStorage.setItem('appLinks', JSON.stringify(links));
      }
    } catch (error) {
      console.error('保存链接时出错:', error);
    }
  };

  // 添加新链接
  const addLink = (newLink) => {
    const updatedLinks = [...appLinks, newLink];
    setAppLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 删除链接
  const removeLink = (index) => {
    const updatedLinks = appLinks.filter((_, i) => i !== index);
    setAppLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  // 编辑链接
  const editLink = (index, updatedLink) => {
    const updatedLinks = [...appLinks];
    updatedLinks[index] = updatedLink;
    setAppLinks(updatedLinks);
    saveLinksToStorage(updatedLinks);
  };

  return (
    <Background>
      <div className="min-h-screen text-foreground py-10">
        {/* 固定区域 */}
        <div className="flex flex-col items-center justify-center gap-10 mb-10">
          <Clock />
          <SearchBar />
        </div>

        {/* 应用图标网格 */}
        <div className="container mx-auto px-4 mt-8">
          <div className="grid grid-cols-5 md:grid-cols-12 gap-6 justify-items-center">
            {appLinks.map((app, index) => (
              <Link
                key={`${app.name}-${index}`}
                icon={app.icon}
                textIcon={app.textIcon}
                url={app.url}
                name={app.name}
                bgColor={app.bgColor}
                textBgColor={app.textBgColor}
                onEdit={(updatedLink) => editLink(index, updatedLink)}
                onDelete={() => removeLink(index)}
              />
            ))}
            <Add onAdd={addLink} />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default Newtab;
