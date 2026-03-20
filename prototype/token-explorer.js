// ============================================================
// Token Explorer — Interactive tokenizer visualization
//
// Calls the server to tokenize text using tiktoken and shows
// students how AI breaks text into tokens. Also shows a
// "predict next token" demo powered by Claude.
// ============================================================

const TokenExplorer = (() => {

  // Color palette for token highlighting
  const TOKEN_COLORS = [
    '#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6',
    '#a855f7', '#ef4444', '#14b8a6', '#f97316', '#8b5cf6',
    '#06b6d4', '#e879f9', '#84cc16', '#fb923c', '#2dd4bf'
  ];

  function init() {
    const container = document.getElementById('lesson-content');
    if (!container) return;

    container.innerHTML = `
      <div class="lesson-header">
        <h1>Token Explorer</h1>
        <p style="color: #8b8fa3;">See how AI reads text — not as words, but as tokens</p>
      </div>
      <div class="lesson-body">

        <div class="concept-card">
          <h3>What are tokens?</h3>
          <p>AI models don't read words like you do. They break text into <strong>tokens</strong> — chunks
          that might be whole words, parts of words, punctuation, or spaces. Understanding tokens helps you
          understand how AI "sees" your text and why it has limits (like context windows).</p>
        </div>

        <!-- Tokenizer Demo -->
        <div class="token-explorer-section">
          <h2>Type anything and see the tokens</h2>
          <textarea id="token-input" class="token-input" placeholder="Type or paste text here to see how AI breaks it into tokens..."
            oninput="TokenExplorer.tokenize()">Hello! I'm a WGU student learning about AI.</textarea>

          <div class="token-stats" id="token-stats">
            <div class="token-stat">
              <span class="token-stat-num" id="stat-chars">0</span>
              <span class="token-stat-label">characters</span>
            </div>
            <div class="token-stat">
              <span class="token-stat-num" id="stat-words">0</span>
              <span class="token-stat-label">words</span>
            </div>
            <div class="token-stat">
              <span class="token-stat-num" id="stat-tokens">0</span>
              <span class="token-stat-label">tokens</span>
            </div>
            <div class="token-stat">
              <span class="token-stat-num" id="stat-ratio">0</span>
              <span class="token-stat-label">chars/token</span>
            </div>
          </div>

          <div class="token-display" id="token-display">
            <p class="hub-empty">Tokens will appear here...</p>
          </div>
        </div>

        <!-- Key Insights -->
        <div class="concept-card">
          <h3>Things to try</h3>
          <ul>
            <li><strong>Common words</strong> — "the", "is", "and" are usually single tokens</li>
            <li><strong>Uncommon words</strong> — "pneumonoultramicroscopicsilicovolcanoconiosis" gets split into many tokens</li>
            <li><strong>Numbers</strong> — try "12345" vs "twelve thousand" — which uses more tokens?</li>
            <li><strong>Code</strong> — try <code>function hello() { return "world"; }</code></li>
            <li><strong>Other languages</strong> — non-English text often uses more tokens per word</li>
            <li><strong>Your problem statement</strong> — paste it in! How many tokens does it use?</li>
          </ul>
        </div>

        <!-- Prediction Demo -->
        <div class="token-explorer-section">
          <h2>Predict the next token</h2>
          <p>This is what AI does: given some text, it predicts what comes next. Type a partial sentence and see what the AI would predict.</p>

          <div class="prediction-row">
            <input type="text" id="predict-input" class="token-input prediction-input"
              placeholder="The capital of France is..."
              value="The capital of France is">
            <button class="hub-btn hub-btn-primary" onclick="TokenExplorer.predict()" id="predict-btn">Predict Next</button>
          </div>

          <div id="prediction-result" class="prediction-result"></div>
        </div>

        <!-- Context Window Visualization -->
        <div class="token-explorer-section">
          <h2>Context windows: how much can AI "see"?</h2>
          <p>Every AI model has a <strong>context window</strong> — the maximum number of tokens it can process at once.
          Think of it as the AI's working memory.</p>

          <div class="context-window-viz">
            <div class="context-bar">
              <div class="context-bar-label">Your text above</div>
              <div class="context-bar-fill" id="context-fill-yours" style="width: 0%"></div>
            </div>
            <div class="context-bar">
              <div class="context-bar-label">A 5-page essay (~2,500 words)</div>
              <div class="context-bar-fill context-bar-essay" style="width: 1.6%"></div>
            </div>
            <div class="context-bar">
              <div class="context-bar-label">A short novel (50,000 words)</div>
              <div class="context-bar-fill context-bar-novel" style="width: 33%"></div>
            </div>
            <div class="context-bar">
              <div class="context-bar-label">Full context window (200k tokens)</div>
              <div class="context-bar-fill context-bar-full" style="width: 100%"></div>
            </div>
          </div>

          <div class="analogy-box">
            <div class="analogy-label">Think of it this way</div>
            <p>If the AI's context window is a desk, tokens are the pages on that desk.
            A bigger desk (more tokens) means the AI can look at more information at once.
            But even the biggest desk has limits — that's why you can't paste an entire
            textbook and ask the AI to summarize it in one go.</p>
          </div>
        </div>

        ${renderQuizSection()}

      </div>
    `;

    // Trigger initial tokenization
    tokenize();
  }

  function renderQuizSection() {
    return `
      <div class="quiz-section">
        <h2>Check Your Understanding</h2>

        <div class="quiz-question">
          <p>1. The word "understanding" is likely broken into how many tokens?</p>
          <div class="quiz-option" onclick="checkAnswer(this, 0, 0, 1, 'Not quite — common words are often split into meaningful subparts.', '')">1 token (the whole word)</div>
          <div class="quiz-option" onclick="checkAnswer(this, 0, 1, 1, 'Right! Most tokenizers split it into \\'under\\' + \\'standing\\' — two meaningful chunks.', '')">2 tokens (under + standing)</div>
          <div class="quiz-option" onclick="checkAnswer(this, 0, 2, 1, 'That would be character-by-character, which is too granular for most tokenizers.', '')">13 tokens (one per letter)</div>
          <div class="quiz-feedback" id="quiz-feedback-0"></div>
        </div>

        <div class="quiz-question">
          <p>2. Why do AI models use tokens instead of whole words?</p>
          <div class="quiz-option" onclick="checkAnswer(this, 1, 0, 1, 'Not quite — tokens aren\\'t about speed.', '')">It makes the AI run faster</div>
          <div class="quiz-option" onclick="checkAnswer(this, 1, 1, 1, 'Exactly! Tokens let the model handle new words, typos, code, and other languages by breaking them into known subparts.', '')">It lets the model handle any text, including new words and other languages</div>
          <div class="quiz-option" onclick="checkAnswer(this, 1, 2, 1, 'Actually the opposite — tokens are somewhat harder for humans to understand.', '')">It makes the output easier to read</div>
          <div class="quiz-feedback" id="quiz-feedback-1"></div>
        </div>

        <div class="quiz-question">
          <p>3. A model's "context window" is:</p>
          <div class="quiz-option" onclick="checkAnswer(this, 2, 0, 2, 'Not quite — context window is about how much text it can see, not what it remembers forever.', '')">How much information the AI has memorized</div>
          <div class="quiz-option" onclick="checkAnswer(this, 2, 1, 2, 'That\\'s the training data, not the context window.', '')">The total amount of text it was trained on</div>
          <div class="quiz-option" onclick="checkAnswer(this, 2, 2, 2, 'Yes! The context window is the AI\\'s working memory — the maximum text it can look at in a single conversation.', '')">The maximum amount of text it can process in one conversation</div>
          <div class="quiz-feedback" id="quiz-feedback-2"></div>
        </div>
      </div>
    `;
  }

  // ==================== TOKENIZATION ====================
  // Client-side approximation using a simple BPE-like heuristic.
  // Good enough for educational purposes — shows the concept accurately.

  function tokenize() {
    const input = document.getElementById('token-input');
    if (!input) return;

    const text = input.value;
    const tokens = approximateTokenize(text);

    // Update stats
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const tokenCount = tokens.length;
    const ratio = tokenCount > 0 ? (chars / tokenCount).toFixed(1) : 0;

    document.getElementById('stat-chars').textContent = chars;
    document.getElementById('stat-words').textContent = words;
    document.getElementById('stat-tokens').textContent = tokenCount;
    document.getElementById('stat-ratio').textContent = ratio;

    // Render tokens
    const display = document.getElementById('token-display');
    if (tokens.length === 0) {
      display.innerHTML = '<p class="hub-empty">Type something above...</p>';
      return;
    }

    display.innerHTML = tokens.map((tok, i) => {
      const color = TOKEN_COLORS[i % TOKEN_COLORS.length];
      const displayText = tok.replace(/ /g, '·').replace(/\n/g, '↵');
      return `<span class="token-chip" style="border-color: ${color}; background: ${color}22; color: ${color}"
                title="Token ${i + 1}: '${tok.replace(/'/g, "\\'")}'">
                ${escapeHtmlToken(displayText)}
              </span>`;
    }).join('');

    // Update context window viz
    const fill = document.getElementById('context-fill-yours');
    if (fill) {
      const pct = Math.min((tokenCount / 200000) * 100, 100);
      fill.style.width = Math.max(pct, 0.1) + '%';
    }
  }

  // Approximate tokenizer — mimics BPE behavior for educational accuracy.
  // Splits on word boundaries, then further splits uncommon/long words.
  function approximateTokenize(text) {
    if (!text) return [];

    const tokens = [];

    // Split into rough word-level chunks preserving whitespace/punctuation
    const chunks = text.match(/\s+|[^\s\w]|\w+/g) || [];

    // Common words that are typically single tokens
    const SINGLE_TOKENS = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'shall', 'must', 'need',
      'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'of',
      'and', 'or', 'but', 'not', 'so', 'if', 'then', 'that', 'this',
      'it', 'its', 'he', 'she', 'they', 'we', 'you', 'I', 'my', 'your',
      'his', 'her', 'their', 'our', 'me', 'him', 'them', 'us',
      'what', 'who', 'how', 'when', 'where', 'why', 'which',
      'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
      'some', 'such', 'no', 'any', 'only', 'own', 'same',
      'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
      'about', 'after', 'before', 'between', 'under', 'over', 'into',
      'through', 'during', 'up', 'down', 'out', 'off',
      'say', 'said', 'get', 'got', 'go', 'went', 'gone', 'come', 'came',
      'make', 'made', 'know', 'knew', 'think', 'thought', 'take', 'took',
      'see', 'saw', 'want', 'give', 'gave', 'use', 'used', 'find', 'found',
      'tell', 'told', 'ask', 'asked', 'work', 'call', 'try', 'keep', 'let',
      'begin', 'seem', 'help', 'show', 'hear', 'play', 'run', 'move', 'live',
      'new', 'old', 'good', 'bad', 'long', 'great', 'small', 'big',
      'right', 'high', 'low', 'last', 'first', 'next', 'early', 'young',
      'important', 'public', 'little', 'large', 'able', 'late',
      'day', 'time', 'year', 'people', 'way', 'man', 'woman', 'child',
      'world', 'life', 'hand', 'part', 'place', 'case', 'week',
      'company', 'system', 'program', 'question', 'work', 'point',
      'home', 'water', 'room', 'mother', 'area', 'money', 'story',
      'fact', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job',
      'word', 'business', 'issue', 'side', 'kind', 'head', 'house',
      'service', 'friend', 'father', 'power', 'hour', 'game', 'line',
      'end', 'members', 'city', 'school', 'student', 'family'
    ]);

    // Common prefixes and suffixes (BPE typically learns these)
    const PREFIXES = ['un', 're', 'pre', 'dis', 'mis', 'over', 'under', 'out', 'non'];
    const SUFFIXES = ['ing', 'tion', 'sion', 'ment', 'ness', 'able', 'ible', 'ful', 'less', 'ous', 'ive', 'ly', 'er', 'or', 'est', 'ed', 'es', 'al', 'ity'];

    for (const chunk of chunks) {
      // Whitespace: single token
      if (/^\s+$/.test(chunk)) {
        tokens.push(chunk);
        continue;
      }

      // Punctuation: single token each
      if (/^[^\w\s]$/.test(chunk)) {
        tokens.push(chunk);
        continue;
      }

      // Numbers: split into 1-3 digit groups
      if (/^\d+$/.test(chunk)) {
        const numChunks = chunk.match(/.{1,3}/g) || [chunk];
        tokens.push(...numChunks);
        continue;
      }

      const lower = chunk.toLowerCase();

      // Common single-token words
      if (SINGLE_TOKENS.has(lower)) {
        tokens.push(chunk);
        continue;
      }

      // Short words (≤4 chars) — usually single tokens
      if (chunk.length <= 4) {
        tokens.push(chunk);
        continue;
      }

      // Try splitting by prefix + suffix
      let split = false;
      for (const suf of SUFFIXES) {
        if (lower.endsWith(suf) && lower.length - suf.length >= 3) {
          const stem = chunk.slice(0, chunk.length - suf.length);
          const sufPart = chunk.slice(chunk.length - suf.length);

          for (const pre of PREFIXES) {
            if (lower.startsWith(pre) && stem.length > pre.length + 1) {
              tokens.push(chunk.slice(0, pre.length));
              tokens.push(stem.slice(pre.length));
              tokens.push(sufPart);
              split = true;
              break;
            }
          }
          if (!split) {
            tokens.push(stem);
            tokens.push(sufPart);
            split = true;
          }
          break;
        }
      }

      if (!split) {
        // Try prefix only
        for (const pre of PREFIXES) {
          if (lower.startsWith(pre) && chunk.length > pre.length + 2) {
            tokens.push(chunk.slice(0, pre.length));
            tokens.push(chunk.slice(pre.length));
            split = true;
            break;
          }
        }
      }

      if (!split) {
        // Long words: split at ~4-5 char boundaries (BPE-like)
        if (chunk.length > 7) {
          const mid = Math.ceil(chunk.length / 2);
          // Try to split at a consonant-vowel boundary
          let splitAt = mid;
          for (let i = mid - 1; i <= mid + 1 && i < chunk.length; i++) {
            if (i > 2 && /[aeiou]/i.test(chunk[i]) && !/[aeiou]/i.test(chunk[i - 1])) {
              splitAt = i;
              break;
            }
          }
          tokens.push(chunk.slice(0, splitAt));
          tokens.push(chunk.slice(splitAt));
        } else {
          tokens.push(chunk);
        }
      }
    }

    return tokens;
  }

  // ==================== PREDICTION ====================

  async function predict() {
    const input = document.getElementById('predict-input');
    const result = document.getElementById('prediction-result');
    const btn = document.getElementById('predict-btn');
    if (!input?.value.trim()) return;

    btn.disabled = true;
    btn.textContent = 'Thinking...';
    result.innerHTML = '<p class="hub-empty">Predicting...</p>';

    try {
      const res = await fetch('/api/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Complete this text with exactly the next 5-10 words. Only output the completion, nothing else. Do not explain. Text: "${input.value}"`
          }],
          studentProfile: {},
          scaffoldingLevel: 5,
          moduleId: 2
        })
      });

      const data = await res.json();
      const completion = data.response?.trim() || '...';

      result.innerHTML = `
        <div class="prediction-display">
          <span class="prediction-given">${escapeHtmlToken(input.value)}</span><span class="prediction-generated">${escapeHtmlToken(completion)}</span>
        </div>
        <p class="prediction-explain">The <span style="color:#22c55e">green text</span> is what the AI predicted would come next.
        It chose these words because, in its training data, these are the most probable tokens to follow your text.</p>
      `;
    } catch (err) {
      result.innerHTML = `<p class="hub-empty">Couldn't connect to the AI. Error: ${err.message}</p>`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Predict Next';
    }
  }

  function escapeHtmlToken(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return { init, tokenize, predict };
})();
