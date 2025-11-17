# 🚀 クイックリファレンス

新機能をUX心理学に基づいて設計する時の、サッと見られるチェックリストと実装パターン。

## 📋 実装前チェックリスト

新しいUIを作る前に、以下を確認：

```
□ 目的を明確にした？
  └ 「このUIの目的は何か」をひと言で言えるか

□ ユーザーが迷わないか？
  └ 「次にやること」が明確か

□ 必要な情報だけか？
  └ 認知負荷は高くないか

□ 最後の印象は良いか？
  └ ユーザーが満足して終わるか

□ 全ユーザーが使えるか？
  └ 色覚異常、キーボード操作、スクリーンリーダー

□ 高速に反応するか？
  └ すべての操作が0.4秒以内
```

---

## 🎨 すぐに使える実装パターン

### 1️⃣ ボタンの基本パターン

```html
<!-- セマンティックなボタン -->
<button class="btn btn-primary">
    <span class="btn-label">主アクション</span>
    <span class="btn-sublabel">補足説明</span>
</button>
```

```css
.btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 18px 30px;
    font-size: 16px;
    transition: all 0.2s ease;
}

.btn-label {
    font-weight: 600;
}

.btn-sublabel {
    font-size: 12px;
    opacity: 0.85;
}

/* ホバー：浮く感覚 */
.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
}

/* アクティブ：押した感覚 */
.btn:active {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}
```

---

### 2️⃣ 成功画面パターン

```html
<div class="success-screen">
    <!-- ピーク：ビジュアルで盛り上げる -->
    <div class="success-icon">✨</div>
    <h2>成功しました！</h2>

    <!-- コンテンツ -->
    <div class="success-content">
        <!-- メッセージ -->
    </div>

    <!-- エンド：前向きなCTA -->
    <p class="encouragement">次のステップに進みますか？</p>
    <button class="btn btn-primary">次へ進む</button>
</div>
```

```css
@keyframes popIn {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }
    60% {
        transform: scale(1.08);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.success-icon {
    font-size: 56px;
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-content {
    background: linear-gradient(135deg, #f5f7fa 0%, #f9fafb 100%);
    border-left: 5px solid var(--color-primary);
    padding: 28px;
    border-radius: 12px;
    margin: 20px 0;
}

.encouragement {
    color: var(--color-text-light);
    margin: 20px 0;
}
```

---

### 3️⃣ フォーム要素のパターン

```html
<!-- ラベル付きフォーム -->
<div class="form-group">
    <label for="email" class="form-label">メールアドレス</label>
    <input
        type="email"
        id="email"
        class="form-input"
        placeholder="example@example.com"
    >
    <p class="form-hint">大文字小文字は区別されません</p>
</div>
```

```css
.form-group {
    margin-bottom: 24px;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text);
}

.form-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    transition: border-color 0.2s ease;
}

/* フォーカス時：目立たせる */
.form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-hint {
    font-size: 12px;
    color: var(--color-text-light);
    margin-top: 6px;
}
```

---

### 4️⃣ プログレスバーパターン

```html
<div class="progress-container">
    <div class="progress-bar">
        <div id="progress-fill" class="progress-fill"></div>
    </div>
    <p class="progress-text">ステップ <span id="step">1</span>/5</p>
</div>
```

```css
.progress-container {
    margin-bottom: 30px;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background-color: var(--color-border);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
    text-align: center;
    margin-top: 12px;
    font-size: 13px;
    color: var(--color-text-light);
}
```

---

### 5️⃣ カード要素パターン

```html
<div class="card">
    <div class="card-header">
        <h3>タイトル</h3>
    </div>
    <div class="card-body">
        <!-- コンテンツ -->
    </div>
    <div class="card-footer">
        <button class="btn btn-secondary">詳しく</button>
    </div>
</div>
```

```css
.card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: box-shadow 0.3s ease;
}

/* ホバー時：深い影 */
.card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
    padding: 20px;
    border-bottom: 1px solid var(--color-border);
}

.card-body {
    padding: 20px;
}

.card-footer {
    padding: 20px;
    background-color: var(--color-bg);
    border-top: 1px solid var(--color-border);
}
```

---

## 🎯 状況別チェックリスト

### 「ユーザーが迷っている」と感じたら

```
□ 視覚的階層を確認
  - 重要な要素は大きいか？
  - 色分けは明確か？

□ テキストを確認
  - 必要な情報だけか？
  - 複雑な専門用語を使っていないか？

□ ラベルを追加
  - ボタンに説明があるか？
  - フォーム項目にラベルがあるか？

□ ステップを表示
  - 「今どこにいるか」が分かるか？
  - 「後どのくらいあるか」が分かるか？
```

**改善前後の比較**:
```
❌ 悪い例
<button>Submit</button>

✅ 良い例
<button>
    <span class="btn-label">登録する</span>
    <span class="btn-sublabel">3ステップ完了</span>
</button>
```

---

### 「ユーザーが途中で止める」と感じたら

```
□ 認知負荷を減らす
  - 1画面の選択肢は5個以下？
  - 不要な情報を削除した？

□ 進捗を見える化
  - プログレスバーを表示した？
  - 「次何をする」が明確か？

□ 小さく始められるか？
  - 最初のハードルは低いか？
  - 「1分でできる」という軽さはあるか？

□ ご褒美があるか？
  - 成功時に喜びがあるか？
  - アニメーションで盛り上げているか？
```

---

### 「ユーザーが二度と来ない」と感じたら

```
□ 最後の印象を改善
  - 終わり方は前向きか？
  - ネガティブな感情で終わっていないか？

□ 再利用を促す
  - 「もう一度」というボタンがあるか？
  - 次のアクションが明確か？

□ 達成感を演出
  - 成功アニメーションはあるか？
  - 「すごい！」と感じる瞬間があるか？

□ 記憶に残す
  - 色や音が記憶に残るか？
  - 「あのアプリのあのシーン」と思い出せるか？
```

---

## ⚡ パフォーマンス

すべての操作は **0.4秒以内** に応答すること：

```css
/* ✅ 推奨：高速なアニメーション */
.element {
    transition: all 0.2s ease;        /* 200ms */
    transform: scale(1.05);            /* GPU加速 */
}

/* ⚠️ 注意：ぎりぎりOK */
.element {
    transition: all 0.4s ease;         /* 400ms = ドハティの閾値 */
}

/* ❌ 避ける：遅い */
.element {
    transition: all 1s ease;           /* 1秒は長すぎる */
    width: 100%;                       /* GPU加速されない */
}
```

---

## 📱 モバイル対応チェック

```css
/* モバイル優先 */
.btn {
    padding: 15px 20px;  /* タッチしやすい */
    font-size: 16px;     /* ズームされない */
}

/* デスクトップで調整 */
@media (min-width: 601px) {
    .btn {
        padding: 18px 30px;
        font-size: 16px;
    }
}
```

**チェック項目**:
- [ ] ボタンサイズは44x44px以上？
- [ ] フォント16px以上（ズーム回避）？
- [ ] タッチターゲット同士の間隔は8px以上？
- [ ] ランドスケープでも使える？

---

## ♿ アクセシビリティ

```html
<!-- ❌ 悪い例 -->
<div onclick="submit()">送信</div>

<!-- ✅ 良い例 -->
<button type="submit" aria-label="フォームを送信">送信</button>

<!-- ❌ 悪い例 -->
<span style="color: red">エラーです</span>

<!-- ✅ 良い例 -->
<span style="color: red" role="alert">❌ エラーです</span>
```

**最低限のチェック**:
- [ ] キーボード（Tab）で全て操作できるか？
- [ ] 色だけで情報を伝えていないか？
- [ ] スクリーンリーダーで意味が通じるか？
- [ ] ボタンにはaria-labelがあるか？

---

## 🔗 よくつながるパターン

### 「選択」→「確認」→「成功」の流れ

```
1. 選択画面（認知負荷低い）
   └ ボタン：視覚的に明確

2. 確認画面（念のため）
   └ テキスト：重要な情報だけ

3. 成功画面（ピーク・エンド）
   └ アニメーション + 励ましメッセージ
```

```html
<!-- ステップ1：選択 -->
<button class="btn btn-yes">Yes</button>

<!-- ステップ2：確認 -->
<div class="confirmation">
    <p>本当に削除しますか？</p>
    <button class="btn btn-danger">削除する</button>
</div>

<!-- ステップ3：成功 -->
<div class="success">
    <div class="success-icon">✓</div>
    <p>削除しました</p>
</div>
```

---

## 🎓 学習を深める

**もっと知りたい時**:

| テーマ | 参照先 |
|--------|-------|
| **色選定** | UX-PSYCHOLOGY-GUIDE.md → 色彩心理学セクション |
| **アニメーション詳細** | IMPLEMENTATION-EXAMPLES.md → アニメーションセクション |
| **すべての原則** | UX-PSYCHOLOGY-GUIDE.md → 各原則の詳細 |
| **実装例** | IMPLEMENTATION-EXAMPLES.md |

---

**最後に**: このチェックリストを印刷して、デスクに貼っておくのがおすすめです！

**最終更新**: 2025年11月17日
