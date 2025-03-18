import React, { useState, useEffect } from 'react';

export default function Clock() {
  const [date, setDate] = useState(new Date());

  // 更新时间的函数
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer); // 清理定时器
    };
  }, []);

  // 格式化时间为 HH:MM
  const formatTime = () => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 获取日期信息
  const getDateInfo = () => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 获取星期几
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[date.getDay()];

    return `${month}月${day}日 星期${weekday}`;
  };

  // 获取农历日期
  const getLunarDate = () => {
    // 这里应该使用专门的农历转换库或算法
    // 简单起见，这里使用一个占位实现
    const lunarMonths = [
      '正',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '冬',
      '腊',
    ];
    const lunarDays = [
      '初一',
      '初二',
      '初三',
      '初四',
      '初五',
      '初六',
      '初七',
      '初八',
      '初九',
      '初十',
      '十一',
      '十二',
      '十三',
      '十四',
      '十五',
      '十六',
      '十七',
      '十八',
      '十九',
      '二十',
      '廿一',
      '廿二',
      '廿三',
      '廿四',
      '廿五',
      '廿六',
      '廿七',
      '廿八',
      '廿九',
      '三十',
    ];

    // 这里应该有一个转换算法，这里仅作示例
    // 在实际应用中，应该使用更准确的农历转换库
    const lunarMonth = lunarMonths[1]; // 示例：二月
    const lunarDay = lunarDays[18]; // 示例：十九

    return `${lunarMonth}月${lunarDay}`;
  };

  return (
    <div className="text-white shadow-sm flex flex-col items-center">
      <div className="text-6xl font-bold">{formatTime()}</div>
      <div className="text-base mt-2">
        {getDateInfo()} {getLunarDate()}
      </div>
    </div>
  );
}
