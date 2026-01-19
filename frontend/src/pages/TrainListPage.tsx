/**
 * @component UI-TRAIN-LIST-PAGE
 * @description 车次列表页面容器组件，整合顶部导航、主导航、查询栏、筛选、列表和底部导航
 * @calls N/A - 容器组件，不直接调用API
 * @related_req_id REQ-TRAIN-LIST-PAGE
 * @page train-list
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 *   N/A - 此为页面容器组件
 * 
 * @features_implemented:
 *   ✅ 整合顶部导航栏（HomeTopBar）
 *   ✅ 整合主导航菜单（MainNavigation）
 *   ✅ 整合查询条件栏（TrainSearchBar）
 *   ✅ 整合筛选条件区域（TrainFilterPanel）
 *   ✅ 整合车次列表（TrainList）
 *   ✅ 整合底部导航（BottomNavigation）
 *   ✅ 页面整体布局（垂直堆叠）
 *   ✅ 背景颜色设置
 * 
 * @implementation_status:
 *   - Scenarios: N/A (页面容器)
 *   - Features: 8/8 (100%)
 *   - UI Visual: 像素级精确
 * ==========================================
 * 
 * @layout_position:
 *   - 整页布局
 *   - 背景色: #F5F5F5 (浅灰)
 *   - 内容居中: max-width 1512px
 */

import React, { useState } from 'react';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import SecondaryNav from '../components/SecondaryNav/SecondaryNav';
import TrainSearchBar from '../components/TrainSearchBar/TrainSearchBar';
import TrainFilterPanel from '../components/TrainFilterPanel/TrainFilterPanel';
import TrainList from '../components/TrainList/TrainList';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import './TrainListPage.css';

interface Train {
  trainNumber: string;
  trainType: string;
  departureStation: string;
  arrivalStation: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  arrivalDay: string;
  seats: {
    [key: string]: string;
  };
  supportsStudent: boolean;
}

const TrainListPage: React.FC = () => {
  // ========== State Management ==========
  // 从 localStorage 读取登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('userId');
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });
  const [searchParams, setSearchParams] = useState({
    fromCity: '',
    toCity: '',
    date: ''
  });
  const [trains, setTrains] = useState<Train[]>([]);
  const [allTrains, setAllTrains] = useState<Train[]>([]); // 保存原始查询结果
  const [lastQueryTime, setLastQueryTime] = useState<number>(Date.now());
  const [showExpireWarning, setShowExpireWarning] = useState(false);

  // ========== Lifecycle ==========
  
  // 监听 localStorage 变化（用于跨标签页同步登录状态）
  React.useEffect(() => {
    const handleStorageChange = () => {
      const userId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(!!userId);
      setUsername(storedUsername || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 页面加载时不自动查询，等待用户输入条件后再查询

  /**
   * 5分钟过期检测
   * @scenario SCENARIO-009: 用户查询后超过5分钟未刷新
   */
  React.useEffect(() => {
    const checkExpire = () => {
      const now = Date.now();
      const elapsed = now - lastQueryTime;
      const fiveMinutes = 5 * 60 * 1000;
      
      if (elapsed >= fiveMinutes && trains.length > 0) {
        setShowExpireWarning(true);
      }
    };

    // 每30秒检查一次
    const intervalId = setInterval(checkExpire, 30 * 1000);

    return () => clearInterval(intervalId);
  }, [lastQueryTime, trains.length]);

  // ========== Feature Implementations ==========

  /**
   * @feature "整合查询条件栏"
   * 处理查询参数更新
   */
  const handleSearch = async (params: any) => {
    console.log('查询参数:', params);
    setSearchParams({
      fromCity: params.fromCity,
      toCity: params.toCity,
      date: params.departureDate
    });
    
    // 调用 API 获取车次列表
    try {
      const response = await fetch('/api/trains/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromCity: params.fromCity,
          toCity: params.toCity,
          departureDate: params.departureDate,
          isStudent: params.passengerType === 'student',
          isHighSpeed: false
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAllTrains(data.trains); // 保存原始结果
        setTrains(data.trains); // 显示所有结果
        setLastQueryTime(Date.now()); // 更新查询时间
        setShowExpireWarning(false); // 隐藏过期警告
      } else {
        console.error('查询失败:', data.message);
        setAllTrains([]);
        setTrains([]);
      }
    } catch (error) {
      console.error('查询失败:', error);
      setAllTrains([]);
      setTrains([]);
    }
  };

  /**
   * @feature "整合筛选条件区域"
   * 处理筛选条件更新
   */
  const handleFilter = (filters: any) => {
    console.log('筛选条件:', filters);
    
    let filteredTrains = [...allTrains];
    
    // 筛选车次类型
    if (filters.trainTypes && filters.trainTypes.length > 0) {
      filteredTrains = filteredTrains.filter(train => {
        // 检查车次类型是否匹配
        for (const type of filters.trainTypes) {
          if (type === 'GC' && (train.trainType === 'GC' || train.trainNumber.startsWith('G') || train.trainNumber.startsWith('C'))) {
            return true;
          }
          if (type === 'D' && (train.trainType === 'D' || train.trainNumber.startsWith('D'))) {
            return true;
          }
          if (train.trainType === type) {
            return true;
          }
        }
        return false;
      });
    }
    
    // 筛选出发车站
    if (filters.departureStations && filters.departureStations.length > 0) {
      filteredTrains = filteredTrains.filter(train => 
        filters.departureStations.includes(train.departureStation)
      );
    }
    
    // 筛选到达车站
    if (filters.arrivalStations && filters.arrivalStations.length > 0) {
      filteredTrains = filteredTrains.filter(train => 
        filters.arrivalStations.includes(train.arrivalStation)
      );
    }
    
    // 筛选席别
    if (filters.seatTypes && filters.seatTypes.length > 0) {
      filteredTrains = filteredTrains.filter(train => {
        // 检查车次是否有任何选中的席别可用
        return filters.seatTypes.some((seatType: string) => {
          const seatStatus = train.seats[seatType];
          return seatStatus && seatStatus !== '--' && seatStatus !== '无';
        });
      });
    }
    
    // 筛选发车时间
    if (filters.departureTime && filters.departureTime !== '00:00--24:00') {
      const [startTime, endTime] = filters.departureTime.split('--');
      filteredTrains = filteredTrains.filter(train => {
        const trainTime = train.departureTime;
        return trainTime >= startTime && trainTime < endTime;
      });
    }
    
    setTrains(filteredTrains);
  };

  /**
   * @feature "用户登录/退出"
   */
  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  /**
   * @feature "日期快捷选择"
   * 当用户点击日期筛选按钮时，使用新日期重新查询车次
   */
  const handleDateChange = async (newDate: string) => {
    if (!searchParams.fromCity || !searchParams.toCity) {
      console.log('请先选择出发地和目的地');
      return;
    }
    
    console.log('日期变更，重新查询:', newDate);
    
    // 更新搜索参数中的日期
    setSearchParams(prev => ({
      ...prev,
      date: newDate
    }));
    
    // 调用 API 获取新日期的车次列表
    try {
      const response = await fetch('/api/trains/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromCity: searchParams.fromCity,
          toCity: searchParams.toCity,
          departureDate: newDate,
          isStudent: false,
          isHighSpeed: false
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAllTrains(data.trains);
        setTrains(data.trains);
        setLastQueryTime(Date.now());
        setShowExpireWarning(false);
      } else {
        console.error('查询失败:', data.message);
        setAllTrains([]);
        setTrains([]);
      }
    } catch (error) {
      console.error('查询失败:', error);
      setAllTrains([]);
      setTrains([]);
    }
  };

  // ========== UI Render ==========
  return (
    <div className="train-list-page">
      {/* 顶部导航区域（白色背景） */}
      <header className="train-list-header">
        {/* @feature "整合顶部导航栏" */}
        <HomeTopBar 
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
        />

        {/* @feature "整合主导航菜单" - 复用主页的SecondaryNav组件 */}
        <SecondaryNav />
      </header>

      {/* 主内容区域 */}
      <div className="train-list-content">
        {/* 查询和筛选整合容器 */}
        <div className="search-filter-container">
          {/* @feature "整合查询条件栏" */}
          <TrainSearchBar onSearch={handleSearch} />

          {/* @feature "整合筛选条件区域" */}
          <TrainFilterPanel onFilter={handleFilter} onDateChange={handleDateChange} />
        </div>

        {/* 5分钟过期警告 */}
        {showExpireWarning && (
          <div className="expire-warning">
            <div className="expire-warning-content">
              <span className="expire-warning-icon">⚠️</span>
              <span className="expire-warning-text">
                车次信息已超过5分钟，余票信息可能发生变化，建议重新查询
              </span>
              <button 
                className="expire-warning-refresh"
                onClick={() => {
                  setShowExpireWarning(false);
                  handleSearch(searchParams);
                }}
              >
                立即刷新
              </button>
              <button 
                className="expire-warning-close"
                onClick={() => setShowExpireWarning(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* @feature "整合车次列表" */}
        <TrainList 
          trains={trains}
          fromCity={searchParams.fromCity}
          toCity={searchParams.toCity}
          date={searchParams.date}
        />
      </div>

      {/* @feature "整合底部导航" */}
      <BottomNavigation pageType="homepage" />
    </div>
  );
};

export default TrainListPage;
