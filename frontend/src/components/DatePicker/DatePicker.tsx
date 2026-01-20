/**
 * @component DatePicker
 * @description 日期选择器组件，支持月份切换和日期选择
 */

import React, { useState, useEffect } from 'react';
import './DatePicker.css';

interface DatePickerProps {
  value?: string; // YYYY-MM-DD格式
  onChange: (date: string) => void;
  onClose: () => void;
  minDate?: Date; // 最早可选日期
  maxDate?: Date; // 最晚可选日期
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  onClose,
  minDate,
  maxDate 
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (value && value.trim() !== '') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (value && value.trim() !== '') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  });

  useEffect(() => {
    if (value && value.trim() !== '') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentDate(date);
      } else {
        const today = new Date();
        setSelectedDate(null);
        setCurrentDate(today);
      }
    } else {
      const today = new Date();
      setSelectedDate(null);
      setCurrentDate(today);
    }
  }, [value]);

  // 获取当月的所有日期
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0=周日

    const days: (number | null)[] = [];
    
    // 填充上个月的空白天数
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // 填充当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // 切换到上个月
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // 切换到下个月
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // 选择日期
  const selectDate = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // 🔧 检查是否在可选范围内（只比较日期部分，忽略时间）
    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      const selectedOnly = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
      if (selectedOnly < minDateOnly) return;
    }
    if (maxDate) {
      const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      const selectedOnly = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
      if (selectedOnly > maxDateOnly) return;
    }
    
    setSelectedDate(selected);
    
    // 格式化为 YYYY-MM-DD
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selected.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    onClose();
  };

  // 选择今天
  const selectToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentDate(today);
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    onClose();
  };

  // 判断日期是否可选
  const isDateSelectable = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // 🔧 只比较日期部分，忽略时间
    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (dateOnly < minDateOnly) return false;
    }
    if (maxDate) {
      const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (dateOnly > maxDateOnly) return false;
    }
    
    return true;
  };

  // 判断是否是选中的日期
  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === currentDate.getFullYear() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === day
    );
  };

  // 判断是否是今天
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === day
    );
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <div className="date-picker-overlay" onClick={onClose}>
      <div className="date-picker-container" onClick={(e) => e.stopPropagation()}>
        {/* 月份导航 */}
        <div className="date-picker-header">
          <button className="date-picker-nav-btn" onClick={previousMonth}>
            &lt;
          </button>
          <div className="date-picker-title">
            {year}年{month}月
          </div>
          <button className="date-picker-nav-btn" onClick={nextMonth}>
            &gt;
          </button>
        </div>

        {/* 星期表头 */}
        <div className="date-picker-weekdays">
          {weekDays.map((day, index) => (
            <div key={index} className="date-picker-weekday">
              {day}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className="date-picker-days">
          {days.map((day, index) => (
            <div
              key={index}
              className={`date-picker-day ${
                day === null ? 'empty' : ''
              } ${
                day && isSelectedDate(day) ? 'selected' : ''
              } ${
                day && isToday(day) ? 'today' : ''
              } ${
                day && !isDateSelectable(day) ? 'disabled' : ''
              }`}
              onClick={() => day && isDateSelectable(day) && selectDate(day)}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 今天按钮 */}
        <div className="date-picker-footer">
          <button className="date-picker-today-btn" onClick={selectToday}>
            今天
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
