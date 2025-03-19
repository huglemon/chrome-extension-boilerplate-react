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
// 导入配置文件
import linkConfig from '../../components/newtab/link/config.json';
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

  // 从配置文件获取默认链接数据
  const { defaultAppLinks } = linkConfig;

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
