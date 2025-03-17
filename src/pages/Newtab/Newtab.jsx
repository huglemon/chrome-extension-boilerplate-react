import React from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/card';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="space-y-8 w-full max-w-4xl p-8">
        <h1 className="text-4xl font-bold">新标签页</h1>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>按钮展示</CardTitle>
              <CardDescription>这里展示了各种不同样式的按钮</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>默认按钮</Button>
                <Button variant="destructive">危险按钮</Button>
                <Button variant="outline">轮廓按钮</Button>
                <Button variant="secondary">次要按钮</Button>
                <Button variant="ghost">幽灵按钮</Button>
                <Button variant="link">链接按钮</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>卡片示例</CardTitle>
              <CardDescription>这是一个基本的卡片组件示例</CardDescription>
            </CardHeader>
            <CardContent>
              <p>你可以在这里放置任何内容，比如文本、图片或其他组件。</p>
            </CardContent>
            <CardFooter>
              <Button>确认</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Newtab;
