# 🧪 Testing Guide

Complete guide for running tests locally and in CI/CD.

## Overview

This project includes comprehensive layout stability tests to ensure button position remains consistent regardless of question text length.

## Setup

### Prerequisites
- Node.js 16+ (18+ recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm test:watch

# Run tests with coverage report
npm test:coverage
```

### GitHub Actions (Automatic)

Tests run automatically on:
- Push to `main`, `develop`, or any `feature/*`, `fix/*`, `test/*` branch
- Pull requests to `main` or `develop`

View results in the "Actions" tab on GitHub.

## Test Structure

### Test Files
- `tests/layout.test.js` - Jest-based layout stability tests
- `tests/layout-test.html` - Browser-based interactive tests
- `tests/layout-stability.test.js` - Original browser console tests

### Test Categories

#### 1. DOM Elements Tests
Verifies required HTML elements exist:
- `.question-section`
- `.question-box`
- `.button-group`
- `#yes-btn`, `#no-btn`

**Command**: Included in `npm test`

#### 2. CSS Properties Tests
Validates flex layout configuration:
- `display: flex` on `.question-box` and `.question-section`
- `flex: 1` on `.question-box`
- `flex-shrink: 0` on `.button-group`
- `margin-bottom: auto` on heading

**Command**: Included in `npm test`

#### 3. Layout Measurements Tests
Measures and compares button positions:
- Button group top position (pixels from viewport top)
- Button group height (pixels)
- Question box height (pixels)

**Command**: Included in `npm test`

#### 4. Acceptance Criteria Tests
Validates against requirements:
- ✅ Button position variance ≤ ±5px across questions
- ✅ Button height variance ≤ ±2px across questions
- ✅ All DOM elements present
- ✅ CSS properties correctly applied

**Command**: Included in `npm test`

## Test Results

### Success Output

```
PASS  tests/layout.test.js
  Layout Stability Tests
    DOM Elements
      ✓ should have .question-box element (3 ms)
      ✓ should have .button-group element (1 ms)
      ✓ should have .question-section element (1 ms)
      ✓ should have Yes and No buttons (1 ms)
    CSS Flex Properties
      ✓ .question-box should have display: flex (1 ms)
      ✓ .question-box should have flex: 1 (1 ms)
      ✓ .question-section should have display: flex (1 ms)
      ✓ .button-group should have flex-shrink: 0 (1 ms)
    Acceptance Criteria
      ✓ button position should be stable within 5px tolerance (1 ms)
      ✓ button height should be consistent within 2px tolerance (1 ms)
      ✓ should fail if button moves more than 5px (1 ms)
      ✓ should fail if button height varies more than 2px (1 ms)

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

### Failure Output

```
FAIL  tests/layout.test.js
  Layout Stability Tests
    Acceptance Criteria
      ✕ button position should be stable within 5px tolerance (5 ms)

Expected: true
Received: false

  Button moved 15px (exceeds tolerance of 5px)
  q1: 500px
  q2: 515px ← Problem!
  q3: 502px
```

## Troubleshooting

### Tests Won't Run

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Specific Test Failing

```bash
# Run specific test file
npm test -- tests/layout.test.js

# Run specific test suite
npm test -- --testNamePattern="DOM Elements"

# Run with verbose output
npm test -- --verbose
```

### Coverage Reports

```bash
# Generate and view coverage
npm run test:coverage
open coverage/lcov-report/index.html
```

## CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/test.yml` file defines:

1. **Matrix Testing**: Tests on Node 16, 18, and 20
2. **Dependency Caching**: Speeds up CI runs
3. **Coverage Reports**: Uploaded to Codecov
4. **Status Summary**: Reports on GitHub PR

### Viewing CI Results

1. Go to your pull request on GitHub
2. Scroll down to "Checks" section
3. Click "Details" on the test job to see full output

### CI Variables

- `GITHUB_REPOSITORY`: Current repository
- `GITHUB_REF`: Current branch
- `GITHUB_WORKSPACE`: Checkout directory

## Browser-Based Testing

### Interactive HTML Tests

For manual testing with visual feedback:

```bash
# Start local server (if not using GitHub Actions)
python3 -m http.server 8000
# or
npx http-server

# Open in browser
open http://localhost:8000/tests/layout-test.html
```

**Right panel buttons:**
- 「テスト実行」 - Run CSS and DOM checks
- 「監視開始」 - Monitor button position while navigating
- 「監視停止」 - Display detailed report

## Test Metrics

### Coverage Goals

```
Statements   : 80%+
Branches     : 75%+
Functions    : 80%+
Lines        : 80%+
```

Current coverage:
```
npm run test:coverage
```

## Common Issues & Solutions

### Issue: "Cannot find module 'jest'"

**Solution:**
```bash
npm install --save-dev jest jest-environment-jsdom
```

### Issue: "Window is not defined"

**Solution:** Tests use jsdom environment which is already configured in `jest.config.js`

### Issue: "Tests timeout"

**Solution:** Increase timeout in test:
```javascript
test('name', () => {
  // test code
}, 10000); // 10 second timeout
```

### Issue: "getComputedStyle not working"

**Solution:** Tests mock `window.getComputedStyle` - check setup.js for issues

## Writing New Tests

### Template

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  test('should do something', () => {
    // Arrange
    const expected = true;

    // Act
    const result = performAction();

    // Assert
    expect(result).toBe(expected);
  });
});
```

### Useful Matchers

```javascript
expect(value).toBe(expected);           // Strict equality
expect(value).toEqual(expected);        // Deep equality
expect(array).toContain(item);          // Array contains
expect(value).toBeTruthy();             // Truthy check
expect(value).toBeLessThanOrEqual(5);   // Numeric comparison
```

## Performance Considerations

### Test Execution Time

- Local: ~1-2 seconds
- GitHub Actions: ~30 seconds (including setup)

### Optimization Tips

```bash
# Run only changed tests
npm test -- --onlyChanged

# Run single test file
npm test -- tests/layout.test.js

# Disable coverage for speed
npm test -- --no-coverage
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Testing Best Practices](https://jestjs.io/docs/testing-frameworks)

## Questions?

Refer to:
- `tests/README.md` - Layout test documentation
- `docs/QUICK-REFERENCE.md` - CSS/layout guide
- GitHub Issues - Report problems

---

**Last Updated**: 2025-11-17
**Test Framework**: Jest 29.7.0+
**Coverage Tool**: Jest built-in
**CI/CD**: GitHub Actions
