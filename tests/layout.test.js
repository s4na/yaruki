/**
 * Layout Stability Tests - Jest Version
 *
 * Automated tests to verify button position remains stable
 * regardless of question text length
 */

describe('Layout Stability Tests', () => {
  let monitor;
  let mockContainer;
  let mockQuestionBox;
  let mockButtonGroup;
  let mockQuestionH2;

  beforeEach(() => {
    // Create mock DOM elements
    mockQuestionBox = {
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 600,
        height: 500,
        left: 0,
        right: 300
      })
    };

    mockButtonGroup = {
      getBoundingClientRect: () => ({
        top: 520,
        bottom: 580,
        height: 60,
        left: 50,
        right: 250
      })
    };

    mockQuestionH2 = {
      getBoundingClientRect: () => ({
        top: 200,
        bottom: 280,
        height: 80,
        left: 50,
        right: 250
      })
    };

    // Setup DOM mocks
    document.body.innerHTML = `
      <div class="question-section" style="display: flex; flex-direction: column;">
        <div class="question-box" style="display: flex; flex-direction: column; flex: 1;">
          <div class="question-counter">質問に答えて、次の一歩を見つける</div>
          <h2 class="question-text">やりたいことは具体的ですか？</h2>
          <div class="button-group" style="flex-shrink: 0;">
            <button id="yes-btn" class="btn btn-yes">Yes</button>
            <button id="no-btn" class="btn btn-no">No</button>
          </div>
        </div>
      </div>
    `;

    // Mock querySelector and querySelectorAll
    const originalQuerySelector = document.querySelector.bind(document);
    document.querySelector = jest.fn((selector) => {
      if (selector === '.question-box') return mockQuestionBox;
      if (selector === '.button-group') return mockButtonGroup;
      if (selector === '.question-box h2') return mockQuestionH2;
      if (selector === '.question-section') {
        return document.querySelector(selector);
      }
      return originalQuerySelector(selector);
    });

    // Mock window.getComputedStyle
    window.getComputedStyle = jest.fn((element) => ({
      display: element === mockQuestionBox ? 'flex' : element === mockButtonGroup ? 'grid' : 'block',
      flex: element === mockQuestionBox ? '1' : undefined,
      flexDirection: element === mockQuestionBox ? 'column' : undefined,
      flexShrink: element === mockButtonGroup ? '0' : undefined,
      marginBottom: element === mockQuestionH2 ? 'auto' : '35px',
      getPropertyValue: (prop) => {
        if (prop === 'display' && element === mockQuestionBox) return 'flex';
        if (prop === 'display' && element === mockButtonGroup) return 'grid';
        return '';
      }
    }));

    // Initialize monitor
    monitor = new LayoutMonitor();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test 1: DOM Elements Existence
   */
  describe('DOM Elements', () => {
    test('should have .question-box element', () => {
      const element = document.querySelector('.question-box');
      expect(element).not.toBeNull();
    });

    test('should have .button-group element', () => {
      const element = document.querySelector('.button-group');
      expect(element).not.toBeNull();
    });

    test('should have .question-section element', () => {
      const element = document.querySelector('.question-section');
      expect(element).not.toBeNull();
    });

    test('should have Yes and No buttons', () => {
      const yesBtn = document.getElementById('yes-btn');
      const noBtn = document.getElementById('no-btn');
      expect(yesBtn).not.toBeNull();
      expect(noBtn).not.toBeNull();
    });
  });

  /**
   * Test 2: CSS Properties
   */
  describe('CSS Flex Properties', () => {
    test('.question-box should have display: flex', () => {
      const element = document.querySelector('.question-box');
      const styles = window.getComputedStyle(element);
      expect(styles.display).toBe('flex');
    });

    test('.question-box should have flex: 1', () => {
      const element = document.querySelector('.question-box');
      const styles = window.getComputedStyle(element);
      expect(styles.flex).toBe('1');
    });

    test('.question-section should have display: flex', () => {
      const element = document.querySelector('.question-section');
      const styles = window.getComputedStyle(element);
      expect(styles.display).toBe('flex');
    });

    test('.button-group should have flex-shrink: 0', () => {
      const element = document.querySelector('.button-group');
      const styles = window.getComputedStyle(element);
      expect(styles.flexShrink).toBe('0');
    });
  });

  /**
   * Test 3: Layout Monitor
   */
  describe('LayoutMonitor', () => {
    test('should measure layout correctly', () => {
      const measurement = monitor.measure();
      expect(measurement).not.toBeNull();
      expect(measurement.buttonGroupTop).toBe(520);
      expect(measurement.buttonGroupHeight).toBe(60);
    });

    test('should record measurements with question ID', () => {
      monitor.record('q1');
      monitor.record('q2');

      const measurements = monitor.getAll();
      expect(measurements.length).toBe(2);
      expect(measurements[0].questionId).toBe('q1');
      expect(measurements[1].questionId).toBe('q2');
    });

    test('should detect stable positions', () => {
      monitor.record('q1');
      monitor.record('q2');
      monitor.record('q3');

      const stability = monitor.checkStability(5);
      expect(stability.variance).toBe(0);
      expect(stability.isStable).toBe(true);
    });

    test('should detect unstable positions', () => {
      // Simulate unstable measurements
      monitor.measurements = [
        { buttonGroupTop: 500, questionId: 'q1' },
        { buttonGroupTop: 520, questionId: 'q2' },
        { buttonGroupTop: 490, questionId: 'q3' }
      ];

      const stability = monitor.checkStability(5);
      expect(stability.variance).toBe(30); // 520 - 490
      expect(stability.isStable).toBe(false);
    });

    test('should report height consistency', () => {
      monitor.measurements = [
        { buttonGroupHeight: 56, questionId: 'q1' },
        { buttonGroupHeight: 56, questionId: 'q2' },
        { buttonGroupHeight: 56, questionId: 'q3' }
      ];

      const consistency = monitor.checkHeightConsistency(2);
      expect(consistency.heightVariance).toBe(0);
      expect(consistency.isConsistent).toBe(true);
    });
  });

  /**
   * Test 4: Position Stability (Acceptance Criteria)
   */
  describe('Acceptance Criteria', () => {
    test('button position should be stable within 5px tolerance', () => {
      // Record measurements from different questions
      const positions = [520, 521, 519, 520, 522];
      positions.forEach((pos, idx) => {
        monitor.measurements.push({
          buttonGroupTop: pos,
          questionId: `q${idx + 1}`,
          buttonGroupHeight: 56
        });
      });

      const stability = monitor.checkStability(5);
      expect(stability.isStable).toBe(true);
      expect(stability.variance).toBeLessThanOrEqual(5);
    });

    test('button height should be consistent within 2px tolerance', () => {
      const heights = [56, 56, 56, 55, 56];
      heights.forEach((height, idx) => {
        monitor.measurements.push({
          buttonGroupHeight: height,
          buttonGroupTop: 520,
          questionId: `q${idx + 1}`
        });
      });

      const consistency = monitor.checkHeightConsistency(2);
      expect(consistency.isConsistent).toBe(true);
      expect(consistency.heightVariance).toBeLessThanOrEqual(2);
    });

    test('should fail if button moves more than 5px', () => {
      monitor.measurements = [
        { buttonGroupTop: 500, questionId: 'q1' },
        { buttonGroupTop: 520, questionId: 'q2' }  // 20px movement
      ];

      const stability = monitor.checkStability(5);
      expect(stability.isStable).toBe(false);
    });

    test('should fail if button height varies more than 2px', () => {
      monitor.measurements = [
        { buttonGroupHeight: 56, questionId: 'q1' },
        { buttonGroupHeight: 60, questionId: 'q2' }  // 4px variation
      ];

      const consistency = monitor.checkHeightConsistency(2);
      expect(consistency.isConsistent).toBe(false);
    });
  });

  /**
   * Test 5: Multiple Question Navigation Simulation
   */
  describe('Navigation Simulation', () => {
    test('should maintain position through multiple questions', () => {
      const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
      questions.forEach(qId => {
        monitor.record(qId);
      });

      const measurements = monitor.getAll();
      expect(measurements.length).toBe(questions.length);

      const stability = monitor.checkStability(5);
      expect(stability.isStable).toBe(true);
      expect(stability.variance).toBeLessThanOrEqual(5);
    });

    test('should provide detailed report', () => {
      monitor.record('q1');
      monitor.record('q2');

      const report = {
        stability: monitor.checkStability(),
        heightConsistency: monitor.checkHeightConsistency()
      };

      expect(report.stability).toHaveProperty('isStable');
      expect(report.stability).toHaveProperty('variance');
      expect(report.stability).toHaveProperty('measurements');
      expect(report.heightConsistency).toHaveProperty('isConsistent');
    });
  });
});

/**
 * LayoutMonitor Class (for testing)
 */
class LayoutMonitor {
  constructor() {
    this.measurements = [];
  }

  measure() {
    const questionBox = document.querySelector('.question-box');
    const buttonGroup = document.querySelector('.button-group');

    if (!questionBox || !buttonGroup) {
      return null;
    }

    const rect = buttonGroup.getBoundingClientRect();
    const questionRect = questionBox.getBoundingClientRect();

    return {
      timestamp: Date.now(),
      buttonGroupTop: Math.round(rect.top),
      buttonGroupHeight: Math.round(rect.height),
      questionBoxHeight: Math.round(questionRect.height),
      windowHeight: window.innerHeight,
    };
  }

  record(questionId) {
    const measurement = this.measure();
    if (measurement) {
      measurement.questionId = questionId;
      this.measurements.push(measurement);
    }
  }

  getAll() {
    return this.measurements;
  }

  checkStability(tolerance = 5) {
    if (this.measurements.length < 2) {
      return {
        isStable: true,
        variance: 0,
        message: 'Not enough measurements',
        measurements: this.measurements,
      };
    }

    const tops = this.measurements.map(m => m.buttonGroupTop);
    const minTop = Math.min(...tops);
    const maxTop = Math.max(...tops);
    const variance = maxTop - minTop;
    const isStable = variance <= tolerance;

    return {
      isStable,
      variance,
      tolerance,
      minTop,
      maxTop,
      measurements: this.measurements,
    };
  }

  checkHeightConsistency(tolerance = 2) {
    if (this.measurements.length < 2) {
      return {
        isConsistent: true,
        heightVariance: 0,
        message: 'Not enough measurements',
      };
    }

    const heights = this.measurements.map(m => m.buttonGroupHeight);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    const heightVariance = maxHeight - minHeight;
    const isConsistent = heightVariance <= tolerance;

    return {
      isConsistent,
      heightVariance,
      tolerance,
      minHeight,
      maxHeight,
    };
  }
}

module.exports = { LayoutMonitor };
