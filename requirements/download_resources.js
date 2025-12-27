const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Resource list from browser analysis
const resources = [
  // Logo (from header)
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/logo.png',
    filename: '登录页-顶部导航-Logo.png',
    type: 'logo',
    metadata: {
      naturalWidth: 200,
      naturalHeight: 50,
      displayWidth: 200,
      displayHeight: 50,
      cssStrategy: 'background-image: url(...); background-size: auto; background-position: 0% 0%;'
    }
  },
  
  // Background images (main content area - using the first one which is currently visible)
  {
    src: 'https://www.12306.cn/index/images/pic/banner-login-20200924.jpg',
    filename: '登录页-背景-新.jpg',
    type: 'background',
    metadata: {
      naturalWidth: 1185,
      naturalHeight: 600,
      displayWidth: 1185,
      displayHeight: 600,
      cssStrategy: 'background-image: url(...); background-size: auto; background-position: 50% 50%; background-repeat: no-repeat;'
    }
  },
  
  // QR codes (4 from footer)
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/zgtlwb.png',
    filename: '登录页-底部导航-中国铁路官方微信二维码.png',
    type: 'qrcode',
    metadata: {
      naturalWidth: 344,
      naturalHeight: 344,
      displayWidth: 80,
      displayHeight: 80,
      cssStrategy: 'width: 80px; height: 80px; object-fit: contain;'
    }
  },
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/zgtlwx.png',
    filename: '登录页-底部导航-中国铁路官方微博二维码.png',
    type: 'qrcode',
    metadata: {
      naturalWidth: 800,
      naturalHeight: 800,
      displayWidth: 80,
      displayHeight: 80,
      cssStrategy: 'width: 80px; height: 80px; object-fit: contain;'
    }
  },
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/public.png',
    filename: '登录页-底部导航-12306公众号二维码.png',
    type: 'qrcode',
    metadata: {
      naturalWidth: 258,
      naturalHeight: 258,
      displayWidth: 80,
      displayHeight: 80,
      cssStrategy: 'width: 80px; height: 80px; object-fit: contain;'
    }
  },
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/download.png',
    filename: '登录页-底部导航-铁路12306二维码.png',
    type: 'qrcode',
    metadata: {
      naturalWidth: 258,
      naturalHeight: 258,
      displayWidth: 80,
      displayHeight: 80,
      cssStrategy: 'width: 80px; height: 80px; object-fit: contain;'
    }
  },
  
  // Partnership/友情链接 images (4 from footer)
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/link05.png',
    filename: '登录页-底部导航-中国国家铁路集团有限公司.png',
    type: 'partnership',
    metadata: {
      naturalWidth: 300,
      naturalHeight: 51,
      displayWidth: 200,
      displayHeight: 34,
      cssStrategy: 'width: 200px; height: 34px; object-fit: contain;'
    }
  },
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/link02.png',
    filename: '登录页-底部导航-中国铁路财产保险自保有限公司.png',
    type: 'partnership',
    metadata: {
      naturalWidth: 400,
      naturalHeight: 68,
      displayWidth: 200,
      displayHeight: 34,
      cssStrategy: 'width: 200px; height: 34px; object-fit: contain;'
    }
  },
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/link03.png',
    filename: '登录页-底部导航-中国铁路95306网.png',
    type: 'partnership',
    metadata: {
      naturalWidth: 800,
      naturalHeight: 136,
      displayWidth: 200,
      displayHeight: 34,
      cssStrategy: 'width: 200px; height: 34px; object-fit: contain;'
    }
  },
  {
    src: 'https://kyfw.12306.cn/otn/resources/images/link04.png',
    filename: '登录页-底部导航-中铁快运股份有限公司.png',
    type: 'partnership',
    metadata: {
      naturalWidth: 400,
      naturalHeight: 68,
      displayWidth: 200,
      displayHeight: 34,
      cssStrategy: 'width: 200px; height: 34px; object-fit: contain;'
    }
  }
];

const outputDir = path.join(__dirname, 'images');
const metadataMap = {};

function downloadImage(url, filename, metadata) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    const filepath = path.join(outputDir, filename);
    
    const options = {
      rejectUnauthorized: false // Ignore SSL certificate verification
    };
    
    protocol.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          // Save metadata
          metadataMap[filename] = {
            originalSize: {
              width: metadata.naturalWidth,
              height: metadata.naturalHeight
            },
            displaySize: {
              width: metadata.displayWidth,
              height: metadata.displayHeight
            },
            scale: (metadata.displayWidth / metadata.naturalWidth).toFixed(3),
            cssStrategy: metadata.cssStrategy
          };
          console.log(`✅ 已下载: ${filename}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        console.log(`↪️  重定向: ${url} -> ${redirectUrl}`);
        downloadImage(redirectUrl, filename, metadata).then(resolve).catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`开始下载 ${resources.length} 个资源...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const resource of resources) {
    try {
      await downloadImage(resource.src, resource.filename, resource.metadata);
      successCount++;
    } catch (error) {
      console.error(`❌ 下载失败: ${resource.filename}`, error.message);
      failCount++;
    }
  }
  
  // Save metadata.json
  const metadataPath = path.join(outputDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadataMap, null, 2));
  
  console.log(`\n✅ 完成！`);
  console.log(`   成功: ${successCount} 个`);
  console.log(`   失败: ${failCount} 个`);
  console.log(`   metadata 已保存到: ${metadataPath}`);
}

downloadAll();

