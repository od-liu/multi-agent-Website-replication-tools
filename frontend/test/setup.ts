/**
 * Frontend 测试环境设置
 */

import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 自动清理
afterEach(() => {
  cleanup();
});

