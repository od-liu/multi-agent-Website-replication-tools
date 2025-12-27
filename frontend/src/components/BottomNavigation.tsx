/**
 * @component UI-BOTTOM-NAV
 * @description 底部导航区域，包含友情链接、二维码和免责声明
 * @calls 无 - 纯展示组件
 * @children_slots 无
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: 无scenarios（纯展示组件）
 * 
 * @features_implemented:
 *   ✅ 显示友情链接Logo集合
 *   ✅ 显示4个二维码（微信/微博/公众号/12306）
 *   ✅ 显示免责声明文字
 * 
 * @implementation_status:
 *   - Scenarios Coverage: N/A (纯展示组件)
 *   - Features Coverage: 3/3 (100%)
 *   - UI Visual: 像素级精确（参考ui-style-guide.md第5.3节）
 * 
 * @layout_position "页面最下方，作为login-page-container的第三个子元素"
 * @dimensions "宽度100%，高度auto"
 * ================================================
 */

import React from 'react';
import './BottomNavigation.css';

export const BottomNavigation: React.FC = () => {
  return (
    <div className="bottom-navigation">
      {/* 友情链接区域 - 左侧 */}
      <div className="bottom-links-section">
        <div className="bottom-links-title">友情链接</div>
        <div className="bottom-links-logos">
          <img 
            src="/images/友情链接.png" 
            alt="友情链接" 
            className="bottom-link-logo"
          />
        </div>
      </div>

      {/* 二维码展示区域 - 中间 */}
      <div className="bottom-qrcode-section">
        <div className="bottom-qrcode-item">
          <div className="bottom-qrcode-title">中国铁路官方微信</div>
          <img 
            src="/images/中国铁路官方微信二维码.png" 
            alt="中国铁路官方微信" 
            className="bottom-qrcode-image"
          />
        </div>

        <div className="bottom-qrcode-item">
          <div className="bottom-qrcode-title">中国铁路官方微博</div>
          <img 
            src="/images/中国铁路官方微博二维码.png" 
            alt="中国铁路官方微博" 
            className="bottom-qrcode-image"
          />
        </div>

        <div className="bottom-qrcode-item">
          <div className="bottom-qrcode-title">12306 公众号</div>
          <img 
            src="/images/12306公众号二维码.png" 
            alt="12306公众号" 
            className="bottom-qrcode-image"
          />
        </div>

        <div className="bottom-qrcode-item">
          <div className="bottom-qrcode-title">铁路12306</div>
          <img 
            src="/images/铁路12306二维码.png" 
            alt="铁路12306" 
            className="bottom-qrcode-image"
          />
        </div>
      </div>

      {/* 免责声明区域 - 右侧 */}
      <div className="bottom-disclaimer">
        中国铁路客户服务中心<br />
        版权所有©2024<br />
        京ICP证000000号
      </div>
    </div>
  );
};

export default BottomNavigation;

