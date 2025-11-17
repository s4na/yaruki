/**
 * Layout Stability Tests
 *
 * Tests to ensure button position remains stable regardless of question text length
 */

const assert = require('assert');

/**
 * Layout measurement helper
 * Stores and tracks layout measurements across question changes
 */
class LayoutMonitor {
    constructor() {
        this.measurements = [];
    }

    /**
     * Measure current layout dimensions
     */
    measure() {
        const questionBox = document.querySelector('.question-box');
        const buttonGroup = document.querySelector('.button-group');
        const questionH2 = document.querySelector('.question-box h2');

        if (!questionBox || !buttonGroup) {
            return null;
        }

        const rect = buttonGroup.getBoundingClientRect();
        const questionRect = questionBox.getBoundingClientRect();
        const h2Rect = questionH2?.getBoundingClientRect();

        return {
            timestamp: Date.now(),
            buttonGroupTop: Math.round(rect.top),
            buttonGroupBottom: Math.round(rect.bottom),
            buttonGroupHeight: Math.round(rect.height),
            questionBoxHeight: Math.round(questionRect.height),
            questionBoxBottom: Math.round(questionRect.bottom),
            h2Height: h2Rect ? Math.round(h2Rect.height) : null,
            windowHeight: window.innerHeight,
        };
    }

    /**
     * Record a measurement with question ID
     */
    record(questionId) {
        const measurement = this.measure();
        if (measurement) {
            measurement.questionId = questionId;
            this.measurements.push(measurement);
        }
    }

    /**
     * Get all measurements
     */
    getAll() {
        return this.measurements;
    }

    /**
     * Get average button group top position
     */
    getAverageButtonTop() {
        if (this.measurements.length === 0) return null;
        const sum = this.measurements.reduce((acc, m) => acc + m.buttonGroupTop, 0);
        return Math.round(sum / this.measurements.length);
    }

    /**
     * Check if button positions are stable
     * Returns {isStable: boolean, variance: number, details: object}
     */
    checkStability(tolerancePixels = 5) {
        if (this.measurements.length < 2) {
            return {
                isStable: true,
                message: 'Not enough measurements',
                variance: 0,
                measurements: this.measurements,
            };
        }

        const tops = this.measurements.map(m => m.buttonGroupTop);
        const minTop = Math.min(...tops);
        const maxTop = Math.max(...tops);
        const variance = maxTop - minTop;
        const isStable = variance <= tolerancePixels;

        return {
            isStable,
            variance,
            tolerancePixels,
            minTop,
            maxTop,
            measurements: this.measurements,
            message: isStable
                ? `✓ Stable! Variance: ${variance}px (tolerance: ${tolerancePixels}px)`
                : `✗ Unstable! Variance: ${variance}px exceeds tolerance: ${tolerancePixels}px`,
        };
    }

    /**
     * Get height consistency check
     * Checks if button group height remains consistent
     */
    checkHeightConsistency(tolerancePixels = 2) {
        if (this.measurements.length < 2) {
            return {
                isConsistent: true,
                message: 'Not enough measurements',
            };
        }

        const heights = this.measurements.map(m => m.buttonGroupHeight);
        const minHeight = Math.min(...heights);
        const maxHeight = Math.max(...heights);
        const heightVariance = maxHeight - minHeight;
        const isConsistent = heightVariance <= tolerancePixels;

        return {
            isConsistent,
            heightVariance,
            tolerancePixels,
            minHeight,
            maxHeight,
            message: isConsistent
                ? `✓ Height consistent! Variance: ${heightVariance}px`
                : `✗ Height inconsistent! Variance: ${heightVariance}px`,
        };
    }

    /**
     * Generate detailed report
     */
    report() {
        const stability = this.checkStability();
        const heightConsistency = this.checkHeightConsistency();

        console.log('\n' + '='.repeat(60));
        console.log('📊 LAYOUT STABILITY REPORT');
        console.log('='.repeat(60) + '\n');

        console.log('📍 Button Position Stability:');
        console.log(`   ${stability.message}`);
        if (stability.measurements.length > 0) {
            console.log(`   Min Top: ${stability.minTop}px`);
            console.log(`   Max Top: ${stability.maxTop}px`);
        }

        console.log('\n📏 Button Height Consistency:');
        console.log(`   ${heightConsistency.message}`);
        if (heightConsistency.minHeight !== undefined) {
            console.log(`   Min Height: ${heightConsistency.minHeight}px`);
            console.log(`   Max Height: ${heightConsistency.maxHeight}px`);
        }

        console.log('\n📋 Detailed Measurements:');
        console.log('   Question | Top | Bottom | Height | Box Height');
        console.log('   ' + '-'.repeat(56));
        this.measurements.forEach(m => {
            console.log(
                `   ${(m.questionId || 'N/A').padEnd(8)} | ` +
                `${String(m.buttonGroupTop).padStart(3)} | ` +
                `${String(m.buttonGroupBottom).padStart(6)} | ` +
                `${String(m.buttonGroupHeight).padStart(6)} | ` +
                `${String(m.questionBoxHeight).padStart(10)}`
            );
        });

        console.log('\n' + '='.repeat(60) + '\n');

        return {
            stability,
            heightConsistency,
            measurements: this.measurements,
        };
    }
}

/**
 * Simulate user interactions and measure layout changes
 */
async function simulateNavigation(monitor) {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    if (!yesBtn || !noBtn) {
        console.error('Buttons not found');
        return;
    }

    // Measure initial state
    monitor.record('q1');
    await sleep(300);

    // Click Yes to go to next question
    console.log('Navigating: q1 → q2');
    yesBtn.click();
    await sleep(600);  // Wait for animation and question load
    monitor.record('q2');
    await sleep(300);

    // Click Yes to continue
    console.log('Navigating: q2 → q3');
    yesBtn.click();
    await sleep(600);
    monitor.record('q3');
    await sleep(300);

    // Click No to try different path
    console.log('Navigating: q3 → q4');
    noBtn.click();
    await sleep(600);
    monitor.record('q4');
    await sleep(300);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test Suite
 */
function runTests() {
    console.log('\n🧪 Layout Stability Test Suite\n');

    // Verify that DOM elements exist
    function testDOMElementsExist() {
        const questionBox = document.querySelector('.question-box');
        const buttonGroup = document.querySelector('.button-group');
        const questionH2 = document.querySelector('.question-box h2');

        console.assert(questionBox, '✓ .question-box exists');
        console.assert(buttonGroup, '✓ .button-group exists');
        console.assert(questionH2, '✓ .question-box h2 exists');

        return questionBox && buttonGroup && questionH2;
    }

    // Verify CSS flex properties
    function testFlexProperties() {
        const questionBox = document.querySelector('.question-box');
        const questionSection = document.querySelector('.question-section');
        const buttonGroup = document.querySelector('.button-group');

        const boxDisplay = window.getComputedStyle(questionBox).display;
        const boxFlex = window.getComputedStyle(questionBox).flex;
        const sectionDisplay = window.getComputedStyle(questionSection).display;
        const groupShrink = window.getComputedStyle(buttonGroup).flexShrink;

        console.assert(
            boxDisplay === 'flex',
            `✓ .question-box is flex (actual: ${boxDisplay})`
        );
        console.assert(
            sectionDisplay === 'flex',
            `✓ .question-section is flex (actual: ${sectionDisplay})`
        );
        console.assert(
            groupShrink === '0',
            `✓ .button-group has flex-shrink: 0 (actual: ${groupShrink})`
        );
    }

    // Test button dimensions
    function testButtonDimensions() {
        const yesBtn = document.getElementById('yes-btn');
        const noBtn = document.getElementById('no-btn');

        if (!yesBtn || !noBtn) {
            console.log('✗ Buttons not found');
            return;
        }

        const yesRect = yesBtn.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();

        console.log(`✓ Yes button: ${Math.round(yesRect.width)}x${Math.round(yesRect.height)}px`);
        console.log(`✓ No button: ${Math.round(noRect.width)}x${Math.round(noRect.height)}px`);

        // Buttons should have similar heights
        const heightDiff = Math.abs(yesRect.height - noRect.height);
        console.assert(
            heightDiff < 2,
            `✓ Buttons have same height (diff: ${heightDiff}px)`
        );
    }

    console.log('1️⃣ DOM Elements:');
    testDOMElementsExist();

    console.log('\n2️⃣ CSS Properties:');
    testFlexProperties();

    console.log('\n3️⃣ Button Dimensions:');
    testButtonDimensions();

    console.log('\n4️⃣ Navigation Test:');
    const monitor = new LayoutMonitor();
    simulateNavigation(monitor).then(() => {
        const report = monitor.report();

        if (!report.stability.isStable) {
            console.error('❌ LAYOUT INSTABILITY DETECTED');
            console.error(`Button top position varies by ${report.stability.variance}px`);
        } else {
            console.log('✅ LAYOUT STABILITY VERIFIED');
        }

        if (!report.heightConsistency.isConsistent) {
            console.error('❌ BUTTON HEIGHT INCONSISTENCY DETECTED');
            console.error(`Button height varies by ${report.heightConsistency.heightVariance}px`);
        } else {
            console.log('✅ BUTTON HEIGHT CONSISTENCY VERIFIED');
        }
    });
}

/**
 * Export for use in browser console
 */
if (typeof window !== 'undefined') {
    window.LayoutMonitor = LayoutMonitor;
    window.runLayoutTests = runTests;
    window.simulateNavigation = simulateNavigation;
}

module.exports = { LayoutMonitor, runTests, simulateNavigation };
