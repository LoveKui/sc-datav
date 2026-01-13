/*
 * @Descripttion: 
 * @Author: duk
 * @Date: 2026-01-13 23:27:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-01-14 00:00:04
 */
import React, { useState, useEffect } from 'react';
import './index.less';

const TimeDisplay: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化数据
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  const weekDays = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.'];
  const dayName = weekDays[now.getDay()];
  
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');

  return (
    <div className="time-container">
      <div className="time-main">
        <span className="digit">{hours}</span>
        <span className="separator">:</span>
        <span className="digit">{minutes}</span>
      </div>
      <div className="date-box">
        <div className="day-name">{dayName}</div>
        <div className="date-num">{`${month}.${date}`}</div>
      </div>
    </div>
  );
};

export default TimeDisplay;