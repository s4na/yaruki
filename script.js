let decisionTree = {};
let currentQuestion = 'q1';
let answerHistory = []; // 回答履歴を保存

// キャッシュバージョン（スクリプト更新時は + 1）
const CACHE_VERSION = '2';

// LocalStorageから状態を復元
function loadStateFromStorage() {
    // キャッシュバージョンをチェック
    const cachedVersion = localStorage.getItem('yaruki-cache-version');
    if (cachedVersion !== CACHE_VERSION) {
        // バージョンが異なる場合は古いキャッシュをクリア
        console.warn(`キャッシュバージョン不一致: ${cachedVersion} -> ${CACHE_VERSION}`);
        clearAllYarukiCache();
        localStorage.setItem('yaruki-cache-version', CACHE_VERSION);
        return;
    }

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

// 全てのyarukiキャッシュをクリア
function clearAllYarukiCache() {
    localStorage.removeItem('yaruki-result');
    localStorage.removeItem('yaruki-answer-history');
    localStorage.removeItem('yaruki-current-question');
    localStorage.removeItem('yaruki-cache-version');
    currentQuestion = 'q1';
    answerHistory = [];
}

// DOM要素の取得
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const backBtn = document.getElementById('back-btn');
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
    clearAllYarukiCache();
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

        // 戻るボタンの表示制御（q1では非表示、それ以外は表示）
        if (backBtn) {
            if (answerHistory.length === 0) {
                backBtn.style.display = 'none';
            } else {
                backBtn.style.display = 'block';
                backBtn.onclick = () => goToPreviousQuestion();
            }
        }

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

// 前の質問に戻る
function goToPreviousQuestion() {
    if (answerHistory.length === 0) {
        return; // 回答履歴がない場合は何もしない
    }

    // 最後の回答を削除
    answerHistory.pop();

    // 前の質問を特定
    let previousQuestionId = 'q1';
    let previousNode = decisionTree['q1'];

    // 回答履歴から前の質問のIDを再現
    if (answerHistory.length > 0) {
        previousQuestionId = 'q1';
        previousNode = decisionTree['q1'];

        for (let i = 0; i < answerHistory.length; i++) {
            const answer = answerHistory[i].answer;
            const nextId = answer === 'yes' ? previousNode.yes : previousNode.no;
            previousQuestionId = nextId;
            previousNode = decisionTree[nextId];
        }
    }

    currentQuestion = previousQuestionId;

    // LocalStorageに保存
    localStorage.setItem('yaruki-answer-history', JSON.stringify(answerHistory));
    localStorage.setItem('yaruki-current-question', previousQuestionId);

    // 前の質問を表示
    showQuestion(previousQuestionId);
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
    // キャッシュをすべてクリア
    clearAllYarukiCache();

    // index.htmlにリダイレクト
    window.location.href = 'index.html';
}

// 初期化（index.htmlでのみ実行）
if (questionContainer) {
    loadStateFromStorage();
    loadDecisionTree();
}
