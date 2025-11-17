/**
 * Jest Setup File
 * Initializes test environment and mocks
 */

// Mock fetch globally
if (!global.fetch) {
  global.fetch = jest.fn();
}

// Mock console methods to reduce noise in CI
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Add custom matchers
expect.extend({
  toBeWithinTolerance(received, expected, tolerance) {
    const diff = Math.abs(received - expected);
    const pass = diff <= tolerance;

    return {
      pass,
      message: () =>
        `expected ${received} to be within ${tolerance} of ${expected} (diff: ${diff})`
    };
  }
});
