import React from 'react';
import './BottomNavigation.css';

/**
 * @component UI-BOTTOM-NAV
 * @description 页面底部导航栏，包含友情链接和二维码展示区域
 * @layout_position "页面最底部，宽度100%，最小高度274px"
 * @dimensions "1185px × 274px"
 * @background_images [
 *   "/images/登录页-底部导航-中国国家铁路集团有限公司.png",
 *   "/images/登录页-底部导航-中国铁路财产保险自保有限公司.png",
 *   "/images/登录页-底部导航-中国铁路95306网.png",
 *   "/images/登录页-底部导航-中铁快运股份有限公司.png",
 *   "/images/登录页-底部导航-中国铁路官方微信二维码.png",
 *   "/images/登录页-底部导航-中国铁路官方微博二维码.png",
 *   "/images/登录页-底部导航-12306公众号二维码.png",
 *   "/images/登录页-底部导航-铁路12306二维码.png"
 * ]
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: 无（纯展示组件）
 * 
 * @features_implemented:
 *   ✅ 友情链接区域展示（4个合作伙伴Logo）
 *   ✅ 二维码区域展示（4个二维码，居中排列）
 *   ✅ 版权信息区域展示
 * 
 * @implementation_status:
 *   - Scenarios Coverage: N/A (纯展示组件)
 *   - Features Coverage: 3/3 (100%)
 *   - UI Visual: 像素级精确
 * ================================================
 */
const BottomNavigation: React.FC = () => {
  // 友情链接数据
  const partnershipLinks = [
    {
      name: '中国国家铁路集团有限公司',
      image: '/images/登录页-底部导航-中国国家铁路集团有限公司.png',
      url: '#',
    },
    {
      name: '中国铁路财产保险自保有限公司',
      image: '/images/登录页-底部导航-中国铁路财产保险自保有限公司.png',
      url: '#',
    },
    {
      name: '中国铁路95306网',
      image: '/images/登录页-底部导航-中国铁路95306网.png',
      url: '#',
    },
    {
      name: '中铁快运股份有限公司',
      image: '/images/登录页-底部导航-中铁快运股份有限公司.png',
      url: '#',
    },
  ];

  // 二维码数据
  const qrCodes = [
    {
      title: '中国铁路官方微信',
      image: '/images/登录页-底部导航-中国铁路官方微信二维码.png',
    },
    {
      title: '中国铁路官方微博',
      image: '/images/登录页-底部导航-中国铁路官方微博二维码.png',
    },
    {
      title: '12306公众号',
      image: '/images/登录页-底部导航-12306公众号二维码.png',
    },
    {
      title: '铁路12306',
      image: '/images/登录页-底部导航-铁路12306二维码.png',
    },
  ];

  // ========== UI Render ==========
  return (
    <div className="bottom-navigation">
      {/* 友情链接区域 */}
      <div className="bottom-navigation-partnerships">
        <div className="bottom-navigation-title">友情链接</div>
        <div className="bottom-navigation-partnership-list">
          {partnershipLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="bottom-navigation-partnership-link"
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
            >
              <img
                src={link.image}
                alt={link.name}
                className="bottom-navigation-partnership-img"
              />
            </a>
          ))}
        </div>
      </div>

      {/* 二维码区域 */}
      <div className="bottom-navigation-qrcodes">
        {qrCodes.map((qr, index) => (
          <div key={index} className="bottom-navigation-qrcode-item">
            <div className="bottom-navigation-qrcode-title">{qr.title}</div>
            <img
              src={qr.image}
              alt={qr.title}
              className="bottom-navigation-qrcode-img"
            />
          </div>
        ))}
      </div>

      {/* 版权信息区域 */}
      <div className="bottom-navigation-copyright">
        <p className="bottom-navigation-copyright-text">
          © 2024 中国铁路客户服务中心 版权所有
        </p>
        <p className="bottom-navigation-copyright-text">
          <a href="#" className="bottom-navigation-copyright-link">
            京ICP备11019953号
          </a>
          <span> | </span>
          <a href="#" className="bottom-navigation-copyright-link">
            京公网安备11010802021134号
          </a>
        </p>
      </div>
    </div>
  );
};

export default BottomNavigation;
