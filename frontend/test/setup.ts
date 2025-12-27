import '@testing-library/jest-dom';

// Mock fetch for API calls
global.fetch = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

