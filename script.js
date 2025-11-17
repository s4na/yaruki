let decisionTree = {};
let currentQuestion = 'q1';

// DOM要素の取得
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const restartBtn = document.getElementById('restart-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const actionContent = document.getElementById('action-content');

// 決定木JSONを読み込む
async function loadDecisionTree() {
    try {
        const response = await fetch('decision-tree.json');
        decisionTree = await response.json();
        showQuestion(currentQuestion);
    } catch (error) {
        console.error('Failed to load decision tree:', error);
        questionText.textContent = 'エラー: データの読み込みに失敗しました';
    }
}

// 質問を表示
function showQuestion(questionId) {
    const node = decisionTree[questionId];

    if (!node) {
        console.error('Question not found:', questionId);
        return;
    }

    // アクション（結果）か質問かを判定
    if (questionId.startsWith('action_')) {
        showAction(node);
    } else {
        // 質問の表示
        questionContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        questionText.textContent = node.text;
        currentQuestion = questionId;

        // プログレスバーの更新
        updateProgress(node.step);

        // ボタンのイベントリスナー
        yesBtn.onclick = () => handleAnswer('yes', node);
        noBtn.onclick = () => handleAnswer('no', node);
    }
}

// 回答を処理
function handleAnswer(answer, node) {
    const nextId = answer === 'yes' ? node.yes : node.no;

    if (nextId) {
        showQuestion(nextId);
    }
}

// アクション（結果）を表示
function showAction(node) {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    const resultTitle = document.getElementById('result-title');
    resultTitle.textContent = node.title;
    actionContent.innerHTML = node.content;

    // スクロール位置を上に
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// プログレスバーの更新
function updateProgress(step) {
    const totalSteps = 7; // 質問は7つ
    const percentage = (step / totalSteps) * 100;

    progressFill.style.width = percentage + '%';
    progressText.textContent = `質問 ${step}/${totalSteps}`;
}

// 最初から始める
restartBtn.addEventListener('click', () => {
    currentQuestion = 'q1';
    showQuestion('q1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 初期化
loadDecisionTree();
