/* ============================================================
   MODULE 04: UI FLOW (V13.0)
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
    if (bLax) bLax.classList.toggle('active', r === 'lax');
}

/**
 * スワイプモード開始
 */
function startSwiping() {
    console.log("UI_FLOW: Starting swipe mode");
    
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

console.log("UI_FLOW: Module loaded");
