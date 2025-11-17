let decisionTree = {};
let currentQuestion = 'q1';
let answerHistory = []; // 回答履歴を保存

// LocalStorageから状態を復元
function loadStateFromStorage() {
    const savedQuestion = localStorage.getItem('yaruki-current-question');
    const savedHistory = localStorage.getItem('yaruki-answer-history');

    // 結果ページから戻された場合、キャッシュをリセット
    const savedResult = localStorage.getItem('yaruki-result');
    if (savedResult && !savedQuestion) {
        // 結果ページが存在するのにcurrentQuestionがない = 不整合
        // キャッシュをクリアして新規開始
        localStorage.removeItem('yaruki-result');
        localStorage.removeItem('yaruki-answer-history');
        currentQuestion = 'q1';
        answerHistory = [];
        return;
    }

    if (savedQuestion) {
        currentQuestion = savedQuestion;
    }

    if (savedHistory) {
        try {
            answerHistory = JSON.parse(savedHistory);
        } catch (error) {
            console.error('Failed to parse answer history:', error);
            answerHistory = [];
        }
    }
}

// DOM要素の取得
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
// resultContainerはresult.htmlにのみ存在するため、nullチェック付きで取得
const resultContainer = document.getElementById('result-container');

// 決定木JSONを読み込む
async function loadDecisionTree() {
    try {
        const response = await fetch('decision-tree.json');

        // HTTPエラーをチェック
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        decisionTree = await response.json();

        // JSONが正しい形式かバリデーション
        if (!decisionTree || typeof decisionTree !== 'object') {
            throw new Error('Invalid decision tree format');
        }

        showQuestion(currentQuestion);
    } catch (error) {
        console.error('Failed to load decision tree:', error);
        // データ読み込み失敗時はキャッシュをクリアして新規開始
        clearDecisionTreeCache();
        if (questionText) {
            questionText.textContent = 'エラー: データの読み込みに失敗しました。キャッシュをクリアして再度お試しください。';
        }
    }
}

// 決定木読み込み失敗時のキャッシュクリア
function clearDecisionTreeCache() {
    localStorage.removeItem('yaruki-result');
    localStorage.removeItem('yaruki-answer-history');
    localStorage.removeItem('yaruki-current-question');
    currentQuestion = 'q1';
    answerHistory = [];
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
        if (questionContainer) {
            questionContainer.classList.remove('hidden');
        }
        // resultContainerはresult.htmlにのみ存在する
        if (resultContainer) {
            resultContainer.classList.add('hidden');
        }

        if (questionText) {
            questionText.textContent = node.text;
        }
        currentQuestion = questionId;

        // プログレスバーの更新
        updateProgress(node.step);

        // ボタンのイベントリスナー
        if (yesBtn && noBtn) {
            yesBtn.onclick = () => handleAnswer('yes', node);
            noBtn.onclick = () => handleAnswer('no', node);
        }
    }
}

// 回答を処理
function handleAnswer(answer, node) {
    const nextId = answer === 'yes' ? node.yes : node.no;

    // 回答履歴に追加
    answerHistory.push({
        question: node.text,
        answer: answer
    });

    // LocalStorageに保存
    localStorage.setItem('yaruki-answer-history', JSON.stringify(answerHistory));
    localStorage.setItem('yaruki-current-question', nextId);

    if (nextId) {
        showQuestion(nextId);
    }
}

// アクション（結果）を表示
function showAction(node) {
    // 結果をLocalStorageに保存
    localStorage.setItem('yaruki-result', JSON.stringify({
        title: node.title,
        content: node.content
    }));

    // 回答履歴をLocalStorageに保存
    localStorage.setItem('yaruki-answer-history', JSON.stringify(answerHistory));

    // 結果ページにリダイレクト
    window.location.href = 'result.html';
}


// プログレスバーの更新
function updateProgress(step) {
    const totalSteps = 7; // 質問は7つ
    const percentage = (step / totalSteps) * 100;

    progressFill.style.width = percentage + '%';
    progressText.textContent = `質問 ${step}/${totalSteps}`;
}

// index.htmlのみでボタンのイベントリスナーを設定
if (yesBtn && noBtn) {
    // これらのイベントリスナーはshowQuestion内で設定されます
}

// クイズをリセット
function resetQuionnaire() {
    // 状態をリセット
    answerHistory = [];
    currentQuestion = 'q1';

    // キャッシュをすべてクリア
    localStorage.removeItem('yaruki-result');
    localStorage.removeItem('yaruki-answer-history');
    localStorage.removeItem('yaruki-current-question');

    // index.htmlにリダイレクト
    window.location.href = 'index.html';
}

// 初期化（index.htmlでのみ実行）
if (questionContainer) {
    loadStateFromStorage();
    loadDecisionTree();
}
