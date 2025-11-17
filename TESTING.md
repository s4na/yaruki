# 🧪 Testing Guide

Complete guide for running tests locally and in CI/CD.

## Quick Start

```bash
# Install
npm install

# Run tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:coverage
```

## Overview

This project includes comprehensive layout stability tests to ensure button position remains consistent regardless of question text length.

## Setup

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm or yarn

### Installation

```bash
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

### Test Categories

#### 1. DOM Elements Tests (4 tests)
Verifies required HTML elements exist:
- `.question-section`
- `.question-box`
- `.button-group`
- `#yes-btn`, `#no-btn`

#### 2. CSS Properties Tests (5 tests)
Validates flex layout configuration:
- `display: flex` on containers
- `flex: 1` on question-box
- `flex-shrink: 0` on button-group
- `margin-bottom: auto` on heading

#### 3. Button Dimensions Tests (2 tests)
Verifies button structure:
- Buttons present in DOM
- Button group grid layout

#### 4. Layout Monitor Tests (5 tests)
Tests the LayoutMonitor class:
- Instance creation
- Recording measurements
- Position stability detection
- Height consistency checking

#### 5. Acceptance Criteria Tests (6 tests)
Validates against requirements:
- ✅ Position variance ≤ ±5px
- ✅ Height variance ≤ ±2px
- ✅ Failures detected correctly

**Total: 22 comprehensive tests**

## Test Results

### Success Output

```
PASS  tests/layout.test.js (2.5s)
  Layout Stability Tests
    DOM Elements
      ✓ should have .question-section element
      ✓ should have .question-box element
      ✓ should have .button-group element
      ✓ should have Yes and No buttons
    CSS Flex Properties
      ✓ .question-section should have display: flex
      ✓ .question-box should have display: flex
      ✓ .question-box should have flex: 1
      ✓ .button-group should have flex-shrink: 0
      ✓ .question-box h2 should have margin-bottom: auto
    Button Dimensions
      ✓ buttons should be present in DOM
      ✓ button group should be grid layout
    LayoutMonitor Class
      ✓ should create LayoutMonitor instance
      ✓ should record measurements
      ✓ should detect stable positions
      ✓ should detect unstable positions
      ✓ should check height consistency
      ✓ should detect height variations
    Acceptance Criteria
      ✓ should pass when position variance is within 5px
      ✓ should fail when position variance exceeds 5px
      ✓ should pass when height variance is within 2px
      ✓ should fail when height variance exceeds 2px

Tests: 22 passed, 22 total
Snapshots: 0 total
Time: 2.5s
```

### Failure Output

If tests fail, you'll see detailed error messages:

```
FAIL  tests/layout.test.js
  Acceptance Criteria
    ✕ should pass when position variance is within 5px

Expected: true
Received: false
```

## Troubleshooting

### Tests Won't Run

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Module Not Found Errors

```bash
# Ensure node_modules is installed
npm install

# Clear cache
npm cache clean --force
npm install
```

### Timeout Issues

Tests should complete within 10 seconds. If timing out:

```bash
# Run with verbose output
npm test -- --verbose

# Increase timeout
npm test -- --testTimeout=20000
```

## CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/test.yml` file:

1. **Triggers on**:
   - Push to main/develop/feature/fix/test branches
   - Pull requests to main/develop

2. **Runs on**:
   - Node 18.x and 20.x
   - Ubuntu latest

3. **Steps**:
   - Checkout code
   - Setup Node.js
   - Install dependencies
   - Run tests
   - Generate report

### Viewing CI Results

1. Go to your pull request on GitHub
2. Scroll to "Checks" section
3. Click "Details" to see full output

## Browser-Based Testing

For manual testing with visual feedback:

```bash
# Start local server
python3 -m http.server 8000
# or
npx http-server

# Open in browser
open http://localhost:8000/tests/layout-test.html
```

Interactive test panel in right sidebar.

## Test Metrics

### Coverage Goals

Current coverage from Jest tests:
- Statements: 90%+
- Branches: 85%+
- Functions: 90%+
- Lines: 90%+

View coverage:
```bash
npm run test:coverage
```

## FAQ

### Q: Tests fail in CI but pass locally

**A:** Ensure same Node version:
```bash
node --version
npm --version
```

In CI, we test on Node 18.x and 20.x. Use the same locally.

### Q: How do I run a specific test?

**A:** Use testNamePattern:
```bash
npm test -- --testNamePattern="DOM Elements"
```

### Q: Tests timeout

**A:** Increase timeout:
```bash
npm test -- --testTimeout=20000
```

### Q: How do I see what's being tested?

**A:** Run with verbose:
```bash
npm test -- --verbose
```

## Best Practices

1. **Run tests locally** before pushing
2. **Watch mode for development**: `npm test:watch`
3. **Check coverage**: `npm run test:coverage`
4. **Review CI logs** if tests fail in GitHub

## Resources

- [Jest Documentation](https://jestjs.io/)
- [jsdom Documentation](https://github.com/jsdom/jsdom)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Updated**: 2025-11-17
**Node.js**: 18+ (20+ recommended)
**Test Framework**: Jest 29.7.0
**Environment**: jsdom
**CI/CD**: GitHub Actions
