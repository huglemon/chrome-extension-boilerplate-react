import React from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '../../components/ui/card';

const Popup = () => {
  return (
    <div className="flex items-center justify-center p-4 rounded-lg">
      <Card className="w-full max-w-md bg-[#1a1a1a] text-white">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Chrome 扩展弹窗</h2>
        </CardHeader>

        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            编辑{' '}
            <code className="bg-muted px-1 py-0.5 rounded">
              src/pages/Popup/Popup.jsx
            </code>{' '}
            并保存以重新加载。
          </p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button asChild variant="default">
            <a
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              学习 React!
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Popup;
