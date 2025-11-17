# 🧪 Testing Guide - Node.js v24

Complete guide for running tests locally and in CI/CD using Node.js v24.

## Quick Start

```bash
# Ensure Node.js v24 is installed
node --version  # Should be v24.x.x

# Install dependencies
npm install

# Run tests
npm test
```

## Node.js Version Requirements

- **Required**: Node.js v24.x or higher
- **npm**: v10.x or higher (comes with Node.js v24)

### Check Your Version

```bash
node --version
npm --version
```

If not on Node v24, install it:

```bash
# Using nvm
nvm install 24
nvm use 24

# Or download from nodejs.org
# https://nodejs.org/
```

## Setup

### Prerequisites
- Node.js 24+
- npm 10+

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

**Environment**: Node.js v24.x on Ubuntu latest

View results in the "Actions" tab on GitHub.

## Test Structure

### Test Files
- `tests/layout.test.js` - Jest-based layout stability tests
- `tests/setup.js` - Test environment initialization
- `jest.config.js` - Jest configuration

### Test Categories

**Total: 22 tests across 5 suites**

1. **DOM Elements** (4 tests)
   - .question-section exists
   - .question-box exists
   - .button-group exists
   - Yes/No buttons exist

2. **CSS Flex Properties** (5 tests)
   - display: flex on containers
   - flex: 1 on question-box
   - flex-shrink: 0 on button-group
   - margin-bottom: auto on heading

3. **Button Dimensions** (2 tests)
   - Buttons in DOM
   - Grid layout

4. **Layout Monitor** (5 tests)
   - Instance creation
   - Recording measurements
   - Stability detection
   - Height checking

5. **Acceptance Criteria** (6 tests)
   - Position ±5px tolerance
   - Height ±2px tolerance
   - Failure detection

## Test Results

### Success Output

```
PASS  tests/layout.test.js (2.5s)
  Layout Stability Tests
    ✓ 22 tests passed

Tests: 22 passed, 22 total
Time: 2.5s
```

### Console Output

```bash
$ npm test

> yaruki-behavior-navigation@1.0.0 test
> jest --no-coverage --testPathIgnorePatterns=/node_modules/

 PASS  tests/layout.test.js
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
    Acceptance Criteria
      ✓ button position should be stable within 5px tolerance
      ✓ button height should be consistent within 2px tolerance
      ✓ should fail if button moves more than 5px
      ✓ should fail if button height varies more than 2px

Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        2.5s
```

## Troubleshooting

### "Node version not compatible"

```bash
# Check your Node version
node --version

# If v24 is not installed:
# Option 1: Use nvm
nvm install 24
nvm use 24

# Option 2: Install from nodejs.org
# https://nodejs.org/ (LTS or Current)
```

### "Cannot find module 'jest'"

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Tests timeout

```bash
# Run with increased timeout
npm test -- --testTimeout=20000
```

### Module not found errors

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## CI/CD Integration

### GitHub Actions Workflow

Located in `.github/workflows/test.yml`

**Triggers:**
- Push to main, develop, feature/*, fix/*, test/* branches
- Pull requests to main or develop

**Environment:**
- Node.js v24.x
- Ubuntu latest
- npm install with --legacy-peer-deps

**Steps:**
1. Checkout code
2. Setup Node v24.x
3. Install dependencies
4. Run tests with --forceExit flag
5. Generate report

### Viewing Results

1. Go to pull request on GitHub
2. Scroll to "Checks" section
3. Click "Details" on test job

## Scripts

```bash
npm test              # Run all tests (no coverage)
npm test:watch       # Run tests in watch mode
npm test:coverage    # Run tests with coverage report
```

## FAQ

### Q: Do I need Node v24?

**A:** Yes, this project requires Node.js v24+. It's specified in package.json under `engines`.

### Q: What if I use an older Node version?

**A:** Tests may not run. Check your version:
```bash
node --version
```
Then upgrade to v24 or higher.

### Q: Tests pass locally but fail in CI?

**A:** Ensure you're using the same Node version:
```bash
# Both should output v24.x.x
node --version
npm --version
```

### Q: How do I run a specific test?

**A:** Use testNamePattern:
```bash
npm test -- --testNamePattern="DOM Elements"
```

### Q: How do I see detailed test output?

**A:** Run with verbose:
```bash
npm test -- --verbose
```

## Performance

### Expected Times

- **Full test suite**: ~2.5 seconds
- **Single test**: ~100ms
- **Watch mode startup**: ~5 seconds

### System Requirements

- RAM: 512MB minimum (1GB+ recommended)
- CPU: Any modern processor
- Disk: ~500MB for node_modules

## Resources

- [Jest Documentation](https://jestjs.io/)
- [jsdom Documentation](https://github.com/jsdom/jsdom)
- [Node.js v24 LTS](https://nodejs.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Updated**: 2025-11-17
**Node.js**: v24+
**npm**: v10+
**Test Framework**: Jest 29.7.0
**Environment**: jsdom
**CI/CD**: GitHub Actions
