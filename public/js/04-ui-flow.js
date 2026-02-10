/* ============================================================
   MODULE 04: UI FLOW (V14.0 - 修正版)
   性別選択・ルール設定・スワイプ開始
   ============================================================ */

/**
 * 性別選択
 */
function setGender(g) {
    console.log(`UI_FLOW: Gender set to ${g}`);
    gender = g;
    
    const buttons = ['btn-male', 'btn-female', 'btn-neutral'];
    buttons.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'btn-' + g) {
                el.classList.add('active-gender');
            } else {
                el.classList.remove('active-gender');
            }
        }
    });
}

/**
 * ルール設定
 */
function setRule(r) {
    console.log(`UI_FLOW: Rule set to ${r}`);
    rule = r;
    
    const bStrict = document.getElementById('btn-strict');
    const bLax = document.getElementById('btn-lax');
    
    if (bStrict) bStrict.classList.toggle('active', r === 'strict');
    if (bLax) bLax.classList.toggle('active', r === 'flexible');
}

/**
 * 読み入力完了→パターン選択へ
 */
function confirmReading() {
    console.log("UI_FLOW: confirmReading called");
    
    const input = document.getElementById('in-reading');
    if (!input) {
        console.error("UI_FLOW: input element not found");
        return;
    }
    
    const reading = toHira(input.value.trim());
    console.log(`UI_FLOW: Reading input = "${reading}"`);
    
    if (!reading || reading.length === 0) {
        alert('読み方を入力してください');
        return;
    }
    
    // パターン選択画面を表示
    if (typeof showReadingPatternSelector === 'function') {
        console.log("UI_FLOW: Calling showReadingPatternSelector");
        showReadingPatternSelector(reading);
    } else {
        console.warn("UI_FLOW: showReadingPatternSelector not found, using fallback");
        // フォールバック：そのまま開始
        segments = [reading];
        if (typeof startSwiping === 'function') {
            startSwiping();
        } else {
            console.error("UI_FLOW: startSwiping not found");
        }
    }
}

// 旧関数名のエイリアス（互換性のため）
function calcSegments() {
    console.log("UI_FLOW: calcSegments called (redirecting to confirmReading)");
    confirmReading();
}

/**
 * スワイプモード開始
 */
function startSwiping() {
    console.log("UI_FLOW: Starting swipe mode");
    console.log("UI_FLOW: Segments =", segments);
    
    // ナビゲーション表示
    const nav = document.getElementById('bottom-nav');
    if (nav) {
        nav.classList.remove('hidden');
    }

    // 状態リセット
    currentPos = 0;
    swipes = 0;
    liked = [];
    seen.clear();
    
    // 同じ読みの自動引き継ぎをチェック
    autoInheritSameReadings();

    // スタック生成
    if (typeof loadStack === 'function') {
        loadStack();
    } else {
        console.error("UI_FLOW: loadStack() not found");
        return;
    }

    // メイン画面へ遷移
    changeScreen('scr-main');
}

/**
 * 同じ読みの自動引き継ぎ
 */
function autoInheritSameReadings() {
    if (!segments || segments.length === 0) return;
    
    // 読みの出現回数をカウント
    const readingCount = {};
    segments.forEach(seg => {
        readingCount[seg] = (readingCount[seg] || 0) + 1;
    });
    
    // 同じ読みが2回以上出現する場合
    Object.keys(readingCount).forEach(reading => {
        if (readingCount[reading] >= 2) {
            console.log(`UI_FLOW: Found duplicate reading "${reading}" (${readingCount[reading]} times)`);
        }
    });
}

console.log("UI FLOW: Module loaded (v14.0)");
