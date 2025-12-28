/**
 * @component UI-BOTTOM-NAV
 * @description 页面底部导航，包含友情链接、二维码和版权信息
 * @calls N/A - 纯展示组件，无API调用
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 *   N/A - 此为纯展示组件，无交互scenarios
 * 
 * @features_implemented:
 *   ✅ 显示友情链接（4个合作伙伴Logo，2行2列布局）
 *   ✅ 显示四个官方平台二维码（横向排列）
 *   ✅ 提供扫码关注入口
 *   ✅ 显示版权和备案信息
 * 
 * @implementation_status:
 *   - Scenarios: N/A (纯展示组件)
 *   - Features: 4/4 (100%)
 *   - UI Visual: 像素级精确
 * 
 * @layout_position:
 *   - 位置: 页面最底部，横向占据整个页面宽度
 *   - 尺寸: 100% × 274px
 *   - 布局: position: static
 * 
 * @resources:
 *   images: [
 *     "/images/登录页面-底部导航-中国国家铁路集团Logo.png",
 *     "/images/登录页面-底部导航-中国铁路财产保险Logo.png",
 *     "/images/登录页面-底部导航-中国铁路95306网Logo.png",
 *     "/images/登录页面-底部导航-中铁快运Logo.png",
 *     "/images/登录页面-底部导航-中国铁路官方微信二维码.png",
 *     "/images/登录页面-底部导航-中国铁路官方微博二维码.png",
 *     "/images/登录页面-底部导航-12306公众号二维码.png",
 *     "/images/登录页面-底部导航-铁路12306二维码.png",
 *     "/images/登录页面-底部导航-无障碍服务Logo.jpg"
 *   ]
 * ==========================================
 */

import React from 'react';
import './BottomNavigation.css';

const BottomNavigation: React.FC = () => {
  return (
    <div className="bottom-navigation-footer" role="complementary" aria-label="底部">
      <div className="bottom-navigation-footer-con bottom-navigation-wrapper" role="main">
        {/* @feature "显示友情链接" - 4个合作伙伴Logo，2行2列布局 */}
        <div className="bottom-navigation-foot-links">
          <h2 className="bottom-navigation-foot-con-tit">友情链接</h2>
          <ul className="bottom-navigation-foot-links-list">
            <li>
              <a href="http://www.china-railway.com.cn/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中国国家铁路集团Logo.png" 
                  alt="中国国家铁路集团有限公司"
                />
              </a>
            </li>
            <li>
              <a href="http://www.china-ric.com/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中国铁路财产保险Logo.png" 
                  alt="中国铁路财产保险自保有限公司"
                />
              </a>
            </li>
            <li>
              <a href="http://www.95306.cn/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中国铁路95306网Logo.png" 
                  alt="中国铁路95306网"
                />
              </a>
            </li>
            <li>
              <a href="http://www.95572.com/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中铁快运Logo.png" 
                  alt="中铁快运股份有限公司"
                />
              </a>
            </li>
          </ul>
        </div>

        {/* @feature "显示四个官方平台二维码" - 横向排列 */}
        {/* @feature "提供扫码关注入口" */}
        <ul className="bottom-navigation-foot-code">
          <li>
            <h2 className="bottom-navigation-foot-con-tit">中国铁路官方微信</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src="/images/登录页面-底部导航-中国铁路官方微信二维码.png" 
                alt="中国铁路官方微信"
              />
            </div>
          </li>
          <li>
            <h2 className="bottom-navigation-foot-con-tit">中国铁路官方微博</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src="/images/登录页面-底部导航-中国铁路官方微博二维码.png" 
                alt="中国铁路官方微博"
              />
            </div>
          </li>
          <li>
            <h2 className="bottom-navigation-foot-con-tit">12306 公众号</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src="/images/登录页面-底部导航-12306公众号二维码.png" 
                alt="12306 公众号"
              />
            </div>
          </li>
          <li>
            <h2 className="bottom-navigation-foot-con-tit">铁路12306</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src="/images/登录页面-底部导航-铁路12306二维码.png" 
                alt="铁路12306"
              />
              <div className="bottom-navigation-code-tips">
                官方APP下载，目前铁路未授权其他网站或APP开展类似服务内容，敬请广大用户注意。
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* @feature "显示版权和备案信息" */}
      <div className="bottom-navigation-footer-txt">
        <p>
          <span>版权所有©2008-2025</span>
          <span>中国铁道科学研究院集团有限公司</span>
          <span>技术支持：铁旅科技有限公司</span>
        </p>
        <p>
          <span>京公网安备 11010802038392号</span>
          <span>|</span>
          <span>京ICP备05020493号-4</span>
          <span>|</span>
          <span>ICP证：京B2-20202537</span>
        </p>
        <img 
          src="/images/登录页面-底部导航-无障碍服务Logo.jpg" 
          alt="无障碍服务"
        />
      </div>
    </div>
  );
};

export default BottomNavigation;

