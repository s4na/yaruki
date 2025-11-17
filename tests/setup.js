/**
 * Jest Setup File
 * Initializes test environment and mocks
 */

// Mock fetch for decision-tree.json loading
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        q1: {
          step: 1,
          text: 'やりたいことは具体的ですか？',
          yes: 'q2',
          no: 'action_q1_no'
        },
        q2: {
          step: 2,
          text: 'やりたい理由（なぜそれをやりたいのか）がハッキリしていますか？',
          yes: 'q3',
          no: 'action_q2_no'
        }
      })
  })
);

// Add console matchers
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
