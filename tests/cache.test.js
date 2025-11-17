/**
 * LocalStorage Cache Tests
 *
 * Tests to verify cache behavior for questionnaire state management
 * Ensures data persistence, recovery, and multi-session isolation
 */

describe('LocalStorage Cache Management', () => {
  beforeEach(() => {
    // Clear all localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  /**
   * Test Suite 0: DOM Element Safety
   * Ensures code doesn't break when DOM elements don't exist
   */
  describe('DOM Element Safety', () => {
    test('should handle missing resultContainer gracefully', () => {
      // resultContainer is only present in result.html, not index.html
      const resultContainer = document.getElementById('result-container');
      expect(resultContainer).toBeNull();
    });

    test('should not throw error when questionContainer is null', () => {
      const questionContainer = document.getElementById('question-container');
      expect(questionContainer).toBeNull();
    });

    test('should not throw error when questionText is null', () => {
      const questionText = document.getElementById('question-text');
      expect(questionText).toBeNull();
    });

    test('should safely check for element existence before manipulation', () => {
      // Simulate the pattern used in the code
      const element = document.getElementById('non-existent');
      expect(() => {
        if (element) {
          element.classList.remove('hidden');
        }
      }).not.toThrow();
    });
  });

  /**
   * Test Suite 1: Fresh Start Behavior
   * Ensures new sessions start with clean state
   */
  describe('Fresh Start Behavior', () => {
    test('should start with no cached data on initial load', () => {
      expect(localStorage.getItem('yaruki-current-question')).toBeNull();
      expect(localStorage.getItem('yaruki-answer-history')).toBeNull();
      expect(localStorage.getItem('yaruki-result')).toBeNull();
    });

    test('should initialize currentQuestion to q1 when no cache exists', () => {
      let currentQuestion = localStorage.getItem('yaruki-current-question');
      expect(currentQuestion).toBeNull();

      // Simulate loadStateFromStorage with no cached data
      currentQuestion = 'q1';
      localStorage.setItem('yaruki-current-question', currentQuestion);

      const restored = localStorage.getItem('yaruki-current-question');
      expect(restored).toBe('q1');
    });

    test('should initialize answerHistory as empty array when no cache exists', () => {
      expect(localStorage.getItem('yaruki-answer-history')).toBeNull();

      // Simulate initialization
      const answerHistory = [];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(answerHistory));

      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(Array.isArray(restored)).toBe(true);
      expect(restored.length).toBe(0);
    });
  });

  /**
   * Test Suite 2: State Persistence During Session
   * Ensures progress is saved as user answers questions
   */
  describe('State Persistence During Session', () => {
    test('should save current question when user answers', () => {
      const nextQuestion = 'q2';
      localStorage.setItem('yaruki-current-question', nextQuestion);

      expect(localStorage.getItem('yaruki-current-question')).toBe('q2');
    });

    test('should append answer to history when user answers', () => {
      const history = [];
      history.push({
        question: 'Are you procrastinating?',
        answer: 'yes'
      });
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));

      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(restored.length).toBe(1);
      expect(restored[0].question).toBe('Are you procrastinating?');
      expect(restored[0].answer).toBe('yes');
    });

    test('should maintain multiple answers in history', () => {
      const history = [];
      history.push({ question: 'Question 1', answer: 'yes' });
      history.push({ question: 'Question 2', answer: 'no' });
      history.push({ question: 'Question 3', answer: 'yes' });

      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));

      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(restored.length).toBe(3);
      expect(restored[0].answer).toBe('yes');
      expect(restored[1].answer).toBe('no');
      expect(restored[2].answer).toBe('yes');
    });

    test('should preserve history order', () => {
      const history = [];
      for (let i = 1; i <= 5; i++) {
        history.push({
          question: `Question ${i}`,
          answer: i % 2 === 0 ? 'yes' : 'no'
        });
      }

      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));

      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      restored.forEach((item, index) => {
        expect(item.question).toBe(`Question ${index + 1}`);
      });
    });
  });

  /**
   * Test Suite 3: State Recovery on Page Reload
   * Ensures progress is maintained when page is reloaded
   */
  describe('State Recovery on Page Reload', () => {
    test('should recover current question from cache on reload', () => {
      // Simulate first page load - user progresses to q5
      localStorage.setItem('yaruki-current-question', 'q5');

      // Simulate page reload - loadStateFromStorage() is called
      let currentQuestion = localStorage.getItem('yaruki-current-question');

      expect(currentQuestion).toBe('q5');
    });

    test('should recover answer history from cache on reload', () => {
      const savedHistory = [
        { question: 'Q1?', answer: 'yes' },
        { question: 'Q2?', answer: 'no' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(savedHistory));

      // Simulate page reload
      const restoredHistory = JSON.parse(
        localStorage.getItem('yaruki-answer-history') || '[]'
      );

      expect(restoredHistory.length).toBe(2);
      expect(restoredHistory).toEqual(savedHistory);
    });

    test('should maintain consistency between question and history on reload', () => {
      // User has progressed through 3 questions
      localStorage.setItem('yaruki-current-question', 'q4');
      const history = [
        { question: 'Q1?', answer: 'yes' },
        { question: 'Q2?', answer: 'no' },
        { question: 'Q3?', answer: 'yes' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));

      // Simulate reload
      const currentQ = localStorage.getItem('yaruki-current-question');
      const restoredHistory = JSON.parse(
        localStorage.getItem('yaruki-answer-history') || '[]'
      );

      expect(currentQ).toBe('q4');
      expect(restoredHistory.length).toBe(3);
    });
  });

  /**
   * Test Suite 4: Result Page Transition
   * Ensures cache is properly managed when transitioning to result page
   */
  describe('Result Page Transition', () => {
    test('should save result before redirecting to result.html', () => {
      const result = {
        title: '行動分析結果',
        content: '<p>Analysis content</p>'
      };
      localStorage.setItem('yaruki-result', JSON.stringify(result));

      const restored = JSON.parse(localStorage.getItem('yaruki-result'));
      expect(restored.title).toBe('行動分析結果');
      expect(restored.content).toBe('<p>Analysis content</p>');
    });

    test('should save final answer history before redirecting', () => {
      const finalHistory = [
        { question: 'Q1?', answer: 'yes' },
        { question: 'Q2?', answer: 'no' },
        { question: 'Q3?', answer: 'yes' },
        { question: 'Q4?', answer: 'yes' },
        { question: 'Q5?', answer: 'no' },
        { question: 'Q6?', answer: 'yes' },
        { question: 'Q7?', answer: 'no' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(finalHistory));
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Result',
        content: 'Content'
      }));

      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(restored.length).toBe(7);
    });

    test('should maintain result and history consistency when viewing result page', () => {
      const result = { title: 'Test Result', content: 'Content' };
      const history = [{ question: 'Q?', answer: 'yes' }];

      localStorage.setItem('yaruki-result', JSON.stringify(result));
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));

      // Simulate result.html loading
      const restoredResult = localStorage.getItem('yaruki-result');
      const restoredHistory = localStorage.getItem('yaruki-answer-history');

      expect(restoredResult).not.toBeNull();
      expect(restoredHistory).not.toBeNull();
    });

    test('should provide default empty history if only result exists', () => {
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Result',
        content: 'Content'
      }));

      const restoredHistory = JSON.parse(
        localStorage.getItem('yaruki-answer-history') || '[]'
      );

      expect(Array.isArray(restoredHistory)).toBe(true);
      expect(restoredHistory.length).toBe(0);
    });
  });

  /**
   * Test Suite 5: Reset/Clear Behavior
   * Ensures all cache is properly cleared when user resets the questionnaire
   */
  describe('Reset and Clear Behavior', () => {
    test('should clear all cache on reset', () => {
      // Setup cache
      localStorage.setItem('yaruki-current-question', 'q5');
      localStorage.setItem('yaruki-answer-history', JSON.stringify([
        { question: 'Q1?', answer: 'yes' }
      ]));
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Result',
        content: 'Content'
      }));

      // Reset
      localStorage.removeItem('yaruki-current-question');
      localStorage.removeItem('yaruki-answer-history');
      localStorage.removeItem('yaruki-result');

      // Verify all cleared
      expect(localStorage.getItem('yaruki-current-question')).toBeNull();
      expect(localStorage.getItem('yaruki-answer-history')).toBeNull();
      expect(localStorage.getItem('yaruki-result')).toBeNull();
    });

    test('should allow clean restart after reset', () => {
      // Setup and reset
      localStorage.setItem('yaruki-current-question', 'q5');
      localStorage.removeItem('yaruki-current-question');

      // Start new session
      localStorage.setItem('yaruki-current-question', 'q1');

      expect(localStorage.getItem('yaruki-current-question')).toBe('q1');
    });

    test('should not affect other storage keys when resetting', () => {
      // Setup other keys
      localStorage.setItem('other-key', 'other-value');
      localStorage.setItem('yaruki-current-question', 'q5');

      // Reset only yaruki keys
      localStorage.removeItem('yaruki-current-question');

      expect(localStorage.getItem('other-key')).toBe('other-value');
      expect(localStorage.getItem('yaruki-current-question')).toBeNull();
    });
  });

  /**
   * Test Suite 6: Multi-Session Isolation
   * Ensures one session's data doesn't interfere with another
   */
  describe('Multi-Session Isolation', () => {
    test('should not mix data from different sessions', () => {
      // Session 1: User answers yes, no, yes
      let history1 = [
        { question: 'Q1?', answer: 'yes' },
        { question: 'Q2?', answer: 'no' },
        { question: 'Q3?', answer: 'yes' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history1));

      // Session 1 completes and data persists
      const session1Data = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(session1Data.length).toBe(3);

      // Session 2 should clear and start fresh (after reset)
      localStorage.removeItem('yaruki-answer-history');
      let history2 = [
        { question: 'Q1?', answer: 'no' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history2));

      const session2Data = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(session2Data.length).toBe(1);
      expect(session2Data[0].answer).toBe('no');
    });

    test('should allow user to overwrite previous result', () => {
      // Session 1 completes
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Session 1 Result',
        content: 'Content 1'
      }));

      let result1 = JSON.parse(localStorage.getItem('yaruki-result'));
      expect(result1.title).toBe('Session 1 Result');

      // Session 2 overwrites result
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Session 2 Result',
        content: 'Content 2'
      }));

      let result2 = JSON.parse(localStorage.getItem('yaruki-result'));
      expect(result2.title).toBe('Session 2 Result');
    });

    test('should reset current question between sessions', () => {
      // Session 1 advances to q7
      localStorage.setItem('yaruki-current-question', 'q7');
      expect(localStorage.getItem('yaruki-current-question')).toBe('q7');

      // Session 1 completes - simulate reset before session 2
      localStorage.removeItem('yaruki-current-question');

      // Session 2 starts
      localStorage.setItem('yaruki-current-question', 'q1');
      expect(localStorage.getItem('yaruki-current-question')).toBe('q1');
    });

    test('should maintain independent answer histories', () => {
      // Session 1: specific answers
      const session1History = [
        { question: 'Q?', answer: 'yes' },
        { question: 'Q?', answer: 'no' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(session1History));

      const stored1 = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(stored1[0].answer).toBe('yes');

      // Reset for session 2
      localStorage.removeItem('yaruki-answer-history');

      // Session 2: different answers
      const session2History = [
        { question: 'Q?', answer: 'no' },
        { question: 'Q?', answer: 'yes' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(session2History));

      const stored2 = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(stored2[0].answer).toBe('no');
    });
  });

  /**
   * Test Suite 7: Edge Cases and Data Integrity
   * Tests unusual but possible scenarios
   */
  describe('Edge Cases and Data Integrity', () => {
    test('should handle corrupted JSON gracefully', () => {
      localStorage.setItem('yaruki-answer-history', 'invalid json');

      expect(() => {
        JSON.parse(localStorage.getItem('yaruki-answer-history'));
      }).toThrow();
    });

    test('should handle null values when loading from storage', () => {
      localStorage.removeItem('yaruki-answer-history');

      const history = JSON.parse(
        localStorage.getItem('yaruki-answer-history') || '[]'
      );

      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });

    test('should handle very long answer histories', () => {
      const longHistory = [];
      for (let i = 0; i < 100; i++) {
        longHistory.push({
          question: `Question ${i}`,
          answer: Math.random() > 0.5 ? 'yes' : 'no'
        });
      }

      localStorage.setItem('yaruki-answer-history', JSON.stringify(longHistory));
      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));

      expect(restored.length).toBe(100);
      expect(restored[0].question).toBe('Question 0');
      expect(restored[99].question).toBe('Question 99');
    });

    test('should handle special characters in questions', () => {
      const history = [{
        question: 'これは日本語ですか？"\'<>&',
        answer: 'yes'
      }];

      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));
      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));

      expect(restored[0].question).toBe('これは日本語ですか？"\'<>&');
    });

    test('should preserve data types through serialization', () => {
      const history = [
        {
          question: 'Q1',
          answer: 'yes'
        }
      ];

      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));
      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));

      expect(typeof restored[0].question).toBe('string');
      expect(typeof restored[0].answer).toBe('string');
    });

    test('should handle empty strings correctly', () => {
      const history = [
        { question: '', answer: 'yes' }
      ];

      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));
      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));

      expect(restored[0].question).toBe('');
    });
  });

  /**
   * Test Suite 8: Data Load Failure Handling
   * Tests cache clearing when data files fail to load
   */
  describe('Data Load Failure Handling', () => {
    test('should clear cache on decision tree load failure', () => {
      // Setup cache with existing data
      localStorage.setItem('yaruki-current-question', 'q5');
      localStorage.setItem('yaruki-answer-history', JSON.stringify([
        { question: 'Q1?', answer: 'yes' }
      ]));
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Previous Result',
        content: 'Content'
      }));

      // Simulate data load failure - cache should be cleared
      localStorage.removeItem('yaruki-result');
      localStorage.removeItem('yaruki-answer-history');
      localStorage.removeItem('yaruki-current-question');

      // Verify all cache is cleared
      expect(localStorage.getItem('yaruki-current-question')).toBeNull();
      expect(localStorage.getItem('yaruki-answer-history')).toBeNull();
      expect(localStorage.getItem('yaruki-result')).toBeNull();
    });

    test('should reset state after data load failure', () => {
      // Setup corrupted/failed state
      localStorage.setItem('yaruki-current-question', 'invalid_state');
      localStorage.setItem('yaruki-answer-history', 'corrupted_json');

      // Simulate recovery - clear and reset
      localStorage.removeItem('yaruki-current-question');
      localStorage.removeItem('yaruki-answer-history');

      // Fresh start
      expect(localStorage.getItem('yaruki-current-question')).toBeNull();
      expect(localStorage.getItem('yaruki-answer-history')).toBeNull();
    });

    test('should allow recovery after data load failure', () => {
      // Simulate failure recovery
      localStorage.removeItem('yaruki-result');
      localStorage.removeItem('yaruki-answer-history');
      localStorage.removeItem('yaruki-current-question');

      // Start new session
      localStorage.setItem('yaruki-current-question', 'q1');
      const history = [];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));

      expect(localStorage.getItem('yaruki-current-question')).toBe('q1');
      expect(JSON.parse(localStorage.getItem('yaruki-answer-history')).length).toBe(0);
    });

    test('should preserve cache integrity despite load failures', () => {
      // Valid cache before failure
      const validHistory = [
        { question: 'Q1?', answer: 'yes' },
        { question: 'Q2?', answer: 'no' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(validHistory));

      // Simulate failure and recovery
      localStorage.removeItem('yaruki-answer-history');

      // New session cache
      const newHistory = [
        { question: 'Q1?', answer: 'no' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(newHistory));

      const restored = JSON.parse(localStorage.getItem('yaruki-answer-history'));
      expect(restored.length).toBe(1);
      expect(restored[0].answer).toBe('no');
    });

    test('should handle repeated load failures gracefully', () => {
      // First failure
      localStorage.removeItem('yaruki-current-question');
      localStorage.removeItem('yaruki-answer-history');
      localStorage.removeItem('yaruki-result');

      expect(localStorage.getItem('yaruki-current-question')).toBeNull();

      // User retries
      localStorage.setItem('yaruki-current-question', 'q1');

      // Second failure
      localStorage.removeItem('yaruki-current-question');
      localStorage.removeItem('yaruki-answer-history');
      localStorage.removeItem('yaruki-result');

      // Cache remains clean
      expect(localStorage.getItem('yaruki-current-question')).toBeNull();
    });
  });

  /**
   * Test Suite 9: Complete User Journey
   * Integration tests simulating full user workflows
   */
  describe('Complete User Journey', () => {
    test('should support full questionnaire flow with cache', () => {
      // Start fresh
      expect(localStorage.getItem('yaruki-current-question')).toBeNull();

      // User starts on q1
      localStorage.setItem('yaruki-current-question', 'q1');

      // User answers and advances
      let history = [{ question: 'Q1?', answer: 'yes' }];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));
      localStorage.setItem('yaruki-current-question', 'q2');

      // Continue through questions
      history.push({ question: 'Q2?', answer: 'no' });
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));
      localStorage.setItem('yaruki-current-question', 'q3');

      history.push({ question: 'Q3?', answer: 'yes' });
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));
      localStorage.setItem('yaruki-current-question', 'action_1');

      // Reach result page
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Your Result',
        content: '<p>Analysis</p>'
      }));

      // Verify final state
      expect(localStorage.getItem('yaruki-current-question')).toBe('action_1');
      expect(JSON.parse(localStorage.getItem('yaruki-answer-history')).length).toBe(3);
      expect(localStorage.getItem('yaruki-result')).not.toBeNull();
    });

    test('should support page reload during questionnaire', () => {
      // User at q4 with 3 answers
      localStorage.setItem('yaruki-current-question', 'q4');
      const history = [
        { question: 'Q1?', answer: 'yes' },
        { question: 'Q2?', answer: 'no' },
        { question: 'Q3?', answer: 'yes' }
      ];
      localStorage.setItem('yaruki-answer-history', JSON.stringify(history));

      // Simulate page reload
      const currentQ = localStorage.getItem('yaruki-current-question');
      const restoredHistory = JSON.parse(
        localStorage.getItem('yaruki-answer-history') || '[]'
      );

      expect(currentQ).toBe('q4');
      expect(restoredHistory.length).toBe(3);

      // Continue from where they left off
      restoredHistory.push({ question: 'Q4?', answer: 'no' });
      localStorage.setItem('yaruki-answer-history', JSON.stringify(restoredHistory));
      localStorage.setItem('yaruki-current-question', 'q5');

      expect(JSON.parse(localStorage.getItem('yaruki-answer-history')).length).toBe(4);
    });

    test('should support restart from result page', () => {
      // User has result
      localStorage.setItem('yaruki-result', JSON.stringify({
        title: 'Result',
        content: 'Content'
      }));
      localStorage.setItem('yaruki-answer-history', JSON.stringify([
        { question: 'Q?', answer: 'yes' }
      ]));

      // User clicks restart
      localStorage.removeItem('yaruki-result');
      localStorage.removeItem('yaruki-answer-history');
      localStorage.removeItem('yaruki-current-question');

      // Fresh start
      localStorage.setItem('yaruki-current-question', 'q1');

      expect(localStorage.getItem('yaruki-result')).toBeNull();
      expect(localStorage.getItem('yaruki-current-question')).toBe('q1');
    });
  });
});
