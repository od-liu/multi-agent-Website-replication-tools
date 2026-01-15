import React from 'react';
import './Footer.css';

/**
 * @component UI-BOTTOM-NAV
 * @description 页面底部的友情链接和二维码展示区域
 * @calls None - 纯静态组件
 * @children_slots None
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: (无scenarios，纯静态展示组件)
 *   N/A - 纯静态组件
 * 
 * @features_implemented: (所有功能点)
 *   ✅ 友情链接展示（4个合作伙伴Logo，2行2列布局）
 *   ✅ 二维码区域展示（4个二维码，横向排列）
 *   ✅ 版权信息展示
 *   ✅ 备案信息展示
 *   ✅ 二维码提示文字（铁路12306）
 * 
 * @implementation_status:
 *   - Scenarios Coverage: N/A (静态组件)
 *   - Features Coverage: 5/5 (100%)
 *   - UI Visual: 像素级精确（基于ui-style-guide.md）
 * 
 * @layout_position "页面底部，横向占满整个宽度"
 * @dimensions "100% × ~274px"
 * @background_images 各种合作伙伴Logo和二维码图片
 * ================================================
 */
const Footer: React.FC = () => {
  return (
    <div className="footer" role="complementary" aria-label="底部">
      <div className="footer-con wrapper" role="main">
        {/* 友情链接 */}
        <div className="foot-links">
          <h2 className="foot-con-tit">友情链接</h2>
          <ul className="foot-links-list">
            <li>
              <a href="http://www.china-railway.com.cn/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中国国家铁路集团.png" 
                  alt="中国国家铁路集团有限公司" 
                />
              </a>
            </li>
            <li>
              <a href="http://www.china-ric.com/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中国铁路财产保险.png" 
                  alt="中国铁路财产保险自保有限公司" 
                />
              </a>
            </li>
            <li>
              <a href="http://www.95306.cn/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中国铁路95306网.png" 
                  alt="中国铁路95306网" 
                />
              </a>
            </li>
            <li>
              <a href="http://www.95572.com/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/登录页面-底部导航-中铁快运.png" 
                  alt="中铁快运股份有限公司" 
                />
              </a>
            </li>
          </ul>
        </div>

        {/* 二维码区域 */}
        <ul className="foot-code">
          <li>
            <h2 className="foot-con-tit">中国铁路官方微信</h2>
            <div className="code-pic">
              <img 
                src="/images/登录页面-底部导航-中国铁路官方微信二维码.png" 
                alt="中国铁路官方微信" 
              />
            </div>
          </li>
          <li>
            <h2 className="foot-con-tit">中国铁路官方微博</h2>
            <div className="code-pic">
              <img 
                src="/images/登录页面-底部导航-中国铁路官方微博二维码.png" 
                alt="中国铁路官方微博" 
              />
            </div>
          </li>
          <li>
            <h2 className="foot-con-tit">12306 公众号</h2>
            <div className="code-pic">
              <img 
                src="/images/登录页面-底部导航-12306公众号二维码.png" 
                alt="12306 公众号" 
              />
            </div>
          </li>
          <li>
            <h2 className="foot-con-tit">铁路12306</h2>
            <div className="code-pic">
              <img 
                src="/images/登录页面-底部导航-铁路12306APP二维码.png" 
                alt="铁路12306" 
              />
              <div className="code-tips">
                官方APP下载，目前铁路未授权其他网站或APP开展类似服务内容，敬请广大用户注意。
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* 版权信息 */}
      <div className="footer-txt">
        <p>
          <span>版权所有©2008-2025</span>
          <span>中国铁道科学研究院集团有限公司</span>
          <span>技术支持：铁旅科技有限公司</span>
        </p>
        <p>
          <span>
            <img
              className="footer-beian-icon"
              src="/images/gongan.png"
              alt=""
            />
            <a 
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802038392"
              target="_blank"
              rel="noopener noreferrer"
            >
              京公网安备 11010802038392号
            </a>
          </span>
          <span>|</span>
          <span>京ICP备05020493号-4</span>
          <span>|</span>
          <span>ICP证：京B2-20202537</span>
        </p>

        {/* 适老化/无障碍服务按钮（图片） */}
        <img
          className="footer-a11y"
          src="/images/footer-slh.jpg"
          alt="适老化无障碍服务"
        />
      </div>
    </div>
  );
};

export default Footer;

