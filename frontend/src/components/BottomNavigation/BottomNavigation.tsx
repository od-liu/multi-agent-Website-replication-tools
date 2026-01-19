/**
 * @component UI-BOTTOM-NAV
 * @description 页面底部导航，包含友情链接、二维码和版权信息（跨页面共享组件）
 * @calls N/A - 纯展示组件，无API调用
 * @pages login, registration, homepage
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 *   N/A - 此为纯展示组件，无交互scenarios
 * 
 * @features_implemented:
 *   ✅ 显示友情链接（4个合作伙伴Logo，2行2列布局）
 *   ✅ 支持不同页面的友情链接Logo配置
 *   ✅ 显示四个官方平台二维码（横向排列）
 *   ✅ 提供扫码关注入口
 *   ✅ 显示版权和备案信息
 * 
 * @implementation_status:
 *   - Scenarios: N/A (纯展示组件)
 *   - Features: 5/5 (100%)
 *   - UI Visual: 像素级精确
 * 
 * @layout_position:
 *   - 位置: 页面最底部，横向占据整个页面宽度
 *   - 尺寸: 100% × 274px
 *   - 布局: position: static
 * 
 * @resources:
 *   - 登录页/注册页资源: "/images/login/..."
 *   - 首页资源: "/images/首页-底部导航-..."
 * ==========================================
 */

import React from 'react';
import './BottomNavigation.css';

interface BottomNavigationProps {
  pageType?: 'login' | 'registration' | 'homepage' | 'personal-info';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ pageType = 'login' }) => {
  // ========== 页面配置：不同页面使用不同的友情链接Logo ==========
  const friendshipLinksConfig = {
    login: [
      {
        href: 'http://www.china-railway.com.cn/',
        src: '/images/login/登录页面-底部导航-中国国家铁路集团Logo.png',
        alt: '中国国家铁路集团有限公司'
      },
      {
        href: 'http://www.china-ric.com/',
        src: '/images/login/登录页面-底部导航-中国铁路财产保险Logo.png',
        alt: '中国铁路财产保险自保有限公司'
      },
      {
        href: 'http://www.95306.cn/',
        src: '/images/login/登录页面-底部导航-中国铁路95306网Logo.png',
        alt: '中国铁路95306网'
      },
      {
        href: 'http://www.95572.com/',
        src: '/images/login/登录页面-底部导航-中铁快运Logo.png',
        alt: '中铁快运股份有限公司'
      }
    ],
    registration: [
      {
        href: 'http://www.china-railway.com.cn/',
        src: '/images/registration/注册页面-底部导航-中国国家铁路集团Logo.png',
        alt: '中国国家铁路集团有限公司'
      },
      {
        href: 'http://www.china-ric.com/',
        src: '/images/registration/注册页面-底部导航-中国铁路财产保险Logo.png',
        alt: '中国铁路财产保险自保有限公司'
      },
      {
        href: 'http://www.95306.cn/',
        src: '/images/registration/注册页面-底部导航-中国铁路95306网Logo.png',
        alt: '中国铁路95306网'
      },
      {
        href: 'http://www.95572.com/',
        src: '/images/registration/注册页面-底部导航-中铁快运Logo.png',
        alt: '中铁快运股份有限公司'
      }
    ],
    homepage: [
      {
        href: 'http://www.china-railway.com.cn/',
        src: '/images/首页-底部导航-中国国家铁路集团Logo.png',
        alt: '中国国家铁路集团有限公司'
      },
      {
        href: 'http://www.china-railway.com.cn/',
        src: '/images/首页-底部导航-中国铁路客户保险Logo.png',
        alt: '中国铁路客户保险总公司'
      },
      {
        href: 'http://www.crpass.cn/',
        src: '/images/首页-底部导航-中铁银通支付Logo.png',
        alt: '中铁银通支付有限公司'
      },
      {
        href: 'http://www.zt-tech.com/',
        src: '/images/首页-底部导航-中铁程科技Logo.png',
        alt: '中铁程科技有限责任公司'
      }
    ],
    'personal-info': [
      {
        href: 'http://www.china-railway.com.cn/',
        src: '/images/友情链接-左上.png',
        alt: '中国国家铁路集团有限公司'
      },
      {
        href: 'http://www.china-railway.com.cn/',
        src: '/images/友情链接-右上.png',
        alt: '中国铁路客户保险总公司'
      },
      {
        href: 'http://www.crpass.cn/',
        src: '/images/友情链接-左下.png',
        alt: '中铁银通支付有限公司'
      },
      {
        href: 'http://www.zt-tech.com/',
        src: '/images/友情链接-右下.png',
        alt: '中铁程科技有限责任公司'
      }
    ]
  };

  // 获取当前页面的友情链接配置
  const friendshipLinks = friendshipLinksConfig[pageType];

  // 二维码配置（根据页面类型选择路径）
  const getQrCodeImageSrc = (qrCodeType: string) => {
    if (pageType === 'personal-info') {
      // 个人信息页使用简化的文件名
      const fileNames: { [key: string]: string } = {
        '中国铁路官方微信': '中国铁路官方微信二维码.png',
        '中国铁路官方微博': '中国铁路官方微博二维码.png',
        '12306 公众号': '12306公众号二维码.png',
        '铁路12306': '铁路12306二维码.png'
      };
      return `/images/${fileNames[qrCodeType]}`;
    } else if (pageType === 'homepage') {
      return `/images/首页-底部导航-${qrCodeType}二维码.png`;
    } else {
      const pagePrefix = pageType === 'registration' ? '注册页面' : '登录页面';
      return `/images/${pageType}/${pagePrefix}-底部导航-${qrCodeType}二维码.png`;
    }
  };

  return (
    <div className="bottom-navigation-footer" role="complementary" aria-label="底部">
      <div className="bottom-navigation-footer-con bottom-navigation-wrapper" role="main">
        {/* @feature "显示友情链接" - 4个合作伙伴Logo，2行2列布局 */}
        {/* @feature "支持不同页面的友情链接Logo配置" */}
        <div className="bottom-navigation-foot-links">
          <h2 className="bottom-navigation-foot-con-tit">友情链接</h2>
          <ul className="bottom-navigation-foot-links-list">
            {friendshipLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={link.src} 
                    alt={link.alt}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* @feature "显示四个官方平台二维码" - 横向排列 */}
        {/* @feature "提供扫码关注入口" */}
        <ul className="bottom-navigation-foot-code">
          <li>
            <h2 className="bottom-navigation-foot-con-tit">中国铁路官方微信</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src={getQrCodeImageSrc('中国铁路官方微信')}
                alt="中国铁路官方微信"
              />
            </div>
          </li>
          <li>
            <h2 className="bottom-navigation-foot-con-tit">中国铁路官方微博</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src={getQrCodeImageSrc('中国铁路官方微博')}
                alt="中国铁路官方微博"
              />
            </div>
          </li>
          <li>
            <h2 className="bottom-navigation-foot-con-tit">12306 公众号</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src={getQrCodeImageSrc('12306 公众号')}
                alt="12306 公众号"
              />
            </div>
          </li>
          <li>
            <h2 className="bottom-navigation-foot-con-tit">铁路12306</h2>
            <div className="bottom-navigation-code-pic">
              <img 
                src={getQrCodeImageSrc('铁路12306')}
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
        <div className="bottom-navigation-footer-txt-inner">
          <p className="bottom-navigation-footer-copy">
            <span className="bottom-navigation-mr">版权所有©2008-2025</span>
            <span className="bottom-navigation-mr">中国铁道科学研究院集团有限公司</span>
            <span>技术支持：铁旅科技有限公司</span>
          </p>
          <p className="bottom-navigation-footer-beian">
            <span className="bottom-navigation-footer-beian-left bottom-navigation-mr">
              <img
                className="bottom-navigation-footer-gongan"
                src="/images/gongan.png"
                alt=""
                aria-hidden="true"
              />
              <a
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802038392"
                target="_blank"
                rel="noopener noreferrer"
              >
                京公网安备 11010802038392号
              </a>
            </span>
            <span className="bottom-navigation-mr" aria-hidden="true">|</span>
            <span className="bottom-navigation-mr">京ICP备05020493号-4</span>
            <span className="bottom-navigation-mr" aria-hidden="true">|</span>
            <span>ICP证：京B2-20202537</span>
          </p>
          <img
            className="bottom-navigation-footer-a11y"
            src="/images/login/登录页面-底部导航-无障碍服务Logo.jpg"
            alt="无障碍服务"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;

