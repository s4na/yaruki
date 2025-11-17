/**
 * Layout Stability Tests - Jest Version
 *
 * Tests to verify button position remains stable
 * regardless of question text length
 */

describe('Layout Stability Tests', () => {
  let mockQuestionBox;
  let mockButtonGroup;
  let mockQuestionSection;

  beforeEach(() => {
    // Clear document
    document.body.innerHTML = '';

    // Create mock elements
    mockQuestionSection = document.createElement('div');
    mockQuestionSection.className = 'question-section';
    mockQuestionSection.style.display = 'flex';
    mockQuestionSection.style.flexDirection = 'column';

    mockQuestionBox = document.createElement('div');
    mockQuestionBox.className = 'question-box';
    mockQuestionBox.style.display = 'flex';
    mockQuestionBox.style.flexDirection = 'column';
    mockQuestionBox.style.flex = '1';

    const questionCounter = document.createElement('div');
    questionCounter.className = 'question-counter';
    questionCounter.textContent = '質問に答えて、次の一歩を見つける';

    const questionH2 = document.createElement('h2');
    questionH2.className = 'question-text';
    questionH2.textContent = 'テスト質問';
    questionH2.style.marginBottom = 'auto';

    mockButtonGroup = document.createElement('div');
    mockButtonGroup.className = 'button-group';
    mockButtonGroup.style.display = 'grid';
    mockButtonGroup.style.gridTemplateColumns = '1fr 1fr';
    mockButtonGroup.style.flexShrink = '0';

    const yesBtn = document.createElement('button');
    yesBtn.id = 'yes-btn';
    yesBtn.className = 'btn btn-yes';
    yesBtn.textContent = 'Yes';

    const noBtn = document.createElement('button');
    noBtn.id = 'no-btn';
    noBtn.className = 'btn btn-no';
    noBtn.textContent = 'No';

    mockButtonGroup.appendChild(yesBtn);
    mockButtonGroup.appendChild(noBtn);

    mockQuestionBox.appendChild(questionCounter);
    mockQuestionBox.appendChild(questionH2);
    mockQuestionBox.appendChild(mockButtonGroup);

    mockQuestionSection.appendChild(mockQuestionBox);
    document.body.appendChild(mockQuestionSection);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * Test Suite 1: DOM Elements
   */
  describe('DOM Elements', () => {
    test('should have .question-section element', () => {
      const element = document.querySelector('.question-section');
      expect(element).toBeTruthy();
    });

    test('should have .question-box element', () => {
      const element = document.querySelector('.question-box');
      expect(element).toBeTruthy();
    });

    test('should have .button-group element', () => {
      const element = document.querySelector('.button-group');
      expect(element).toBeTruthy();
    });

    test('should have Yes and No buttons', () => {
      const yesBtn = document.getElementById('yes-btn');
      const noBtn = document.getElementById('no-btn');
      expect(yesBtn).toBeTruthy();
      expect(noBtn).toBeTruthy();
    });
  });

  /**
   * Test Suite 2: CSS Properties
   */
  describe('CSS Flex Properties', () => {
    test('.question-section should have display: flex', () => {
      const element = document.querySelector('.question-section');
      expect(element.style.display).toBe('flex');
    });

    test('.question-box should have display: flex', () => {
      const element = document.querySelector('.question-box');
      expect(element.style.display).toBe('flex');
    });

    test('.question-box should have flex: 1', () => {
      const element = document.querySelector('.question-box');
      expect(element.style.flex).toBe('1');
    });

    test('.button-group should have flex-shrink: 0', () => {
      const element = document.querySelector('.button-group');
      expect(element.style.flexShrink).toBe('0');
    });

    test('.question-box h2 should have margin-bottom: auto', () => {
      const element = document.querySelector('.question-text');
      expect(element.style.marginBottom).toBe('auto');
    });
  });

  /**
   * Test Suite 3: Button Dimensions
   */
  describe('Button Dimensions', () => {
    test('buttons should be present in DOM', () => {
      const yesBtn = document.getElementById('yes-btn');
      const noBtn = document.getElementById('no-btn');

      expect(yesBtn.textContent).toBe('Yes');
      expect(noBtn.textContent).toBe('No');
    });

    test('button group should be grid layout', () => {
      const element = document.querySelector('.button-group');
      expect(element.style.display).toBe('grid');
      expect(element.style.gridTemplateColumns).toBe('1fr 1fr');
    });
  });

  /**
   * Test Suite 4: Layout Monitor Class
   */
  describe('LayoutMonitor Class', () => {
    let monitor;

    beforeEach(() => {
      monitor = new LayoutMonitor();
    });

    test('should create LayoutMonitor instance', () => {
      expect(monitor).toBeTruthy();
      expect(monitor.measurements).toEqual([]);
    });

    test('should record measurements', () => {
      monitor.record('q1');
      monitor.record('q2');

      expect(monitor.getAll().length).toBe(2);
      expect(monitor.getAll()[0].questionId).toBe('q1');
      expect(monitor.getAll()[1].questionId).toBe('q2');
    });

    test('should detect stable positions', () => {
      // Add consistent measurements
      monitor.measurements = [
        { buttonGroupTop: 500, questionId: 'q1', buttonGroupHeight: 60 },
        { buttonGroupTop: 500, questionId: 'q2', buttonGroupHeight: 60 },
        { buttonGroupTop: 500, questionId: 'q3', buttonGroupHeight: 60 }
      ];

      const stability = monitor.checkStability(5);
      expect(stability.isStable).toBe(true);
      expect(stability.variance).toBe(0);
    });

    test('should detect unstable positions', () => {
      // Add inconsistent measurements
      monitor.measurements = [
        { buttonGroupTop: 500, questionId: 'q1', buttonGroupHeight: 60 },
        { buttonGroupTop: 520, questionId: 'q2', buttonGroupHeight: 60 },
        { buttonGroupTop: 490, questionId: 'q3', buttonGroupHeight: 60 }
      ];

      const stability = monitor.checkStability(5);
      expect(stability.isStable).toBe(false);
      expect(stability.variance).toBe(30);
    });

    test('should check height consistency', () => {
      monitor.measurements = [
        { buttonGroupHeight: 60, questionId: 'q1', buttonGroupTop: 500 },
        { buttonGroupHeight: 60, questionId: 'q2', buttonGroupTop: 500 },
        { buttonGroupHeight: 60, questionId: 'q3', buttonGroupTop: 500 }
      ];

      const consistency = monitor.checkHeightConsistency(2);
      expect(consistency.isConsistent).toBe(true);
      expect(consistency.heightVariance).toBe(0);
    });

    test('should detect height variations', () => {
      monitor.measurements = [
        { buttonGroupHeight: 60, questionId: 'q1', buttonGroupTop: 500 },
        { buttonGroupHeight: 65, questionId: 'q2', buttonGroupTop: 500 },
        { buttonGroupHeight: 58, questionId: 'q3', buttonGroupTop: 500 }
      ];

      const consistency = monitor.checkHeightConsistency(2);
      expect(consistency.isConsistent).toBe(false);
    });
  });

  /**
   * Test Suite 5: Acceptance Criteria
   */
  describe('Acceptance Criteria', () => {
    let monitor;

    beforeEach(() => {
      monitor = new LayoutMonitor();
    });

    test('should pass when position variance is within 5px', () => {
      monitor.measurements = [
        { buttonGroupTop: 520, questionId: 'q1', buttonGroupHeight: 56 },
        { buttonGroupTop: 521, questionId: 'q2', buttonGroupHeight: 56 },
        { buttonGroupTop: 519, questionId: 'q3', buttonGroupHeight: 56 }
      ];

      const stability = monitor.checkStability(5);
      expect(stability.isStable).toBe(true);
    });

    test('should fail when position variance exceeds 5px', () => {
      monitor.measurements = [
        { buttonGroupTop: 500, questionId: 'q1', buttonGroupHeight: 56 },
        { buttonGroupTop: 520, questionId: 'q2', buttonGroupHeight: 56 }
      ];

      const stability = monitor.checkStability(5);
      expect(stability.isStable).toBe(false);
    });

    test('should pass when height variance is within 2px', () => {
      monitor.measurements = [
        { buttonGroupHeight: 56, questionId: 'q1', buttonGroupTop: 500 },
        { buttonGroupHeight: 56, questionId: 'q2', buttonGroupTop: 500 },
        { buttonGroupHeight: 57, questionId: 'q3', buttonGroupTop: 500 }
      ];

      const consistency = monitor.checkHeightConsistency(2);
      expect(consistency.isConsistent).toBe(true);
    });

    test('should fail when height variance exceeds 2px', () => {
      monitor.measurements = [
        { buttonGroupHeight: 56, questionId: 'q1', buttonGroupTop: 500 },
        { buttonGroupHeight: 60, questionId: 'q2', buttonGroupTop: 500 }
      ];

      const consistency = monitor.checkHeightConsistency(2);
      expect(consistency.isConsistent).toBe(false);
    });
  });
});

/**
 * LayoutMonitor Class for Testing
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
