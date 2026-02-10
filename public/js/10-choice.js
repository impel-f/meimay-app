/* ============================================================
   MODULE 10: CHOICE (V17.0 - 選択肢拡充版)
   ============================================================ */

function openChoice() {
    console.log("CHOICE: Opening choice modal");
    
    const modal = document.getElementById('modal-choice');
    if (!modal) return;
    
    const countLabel = document.getElementById('choice-count-label');
    const message = document.getElementById('choice-message');
    const mainBtn = document.getElementById('choice-main-btn');
    
    if (countLabel) countLabel.innerText = `${swipes}`;
    
    if (message) {
        message.innerText = currentPos < segments.length - 1 
            ? '次の文字に進みますか？'
            : 'ビルド画面で名前を確認しましょう！';
    }
    
    if (mainBtn) {
        mainBtn.onclick = () => {
            if (currentPos < segments.length - 1) {
                closeChoice();
                currentPos++;
                currentIdx = 0;
                swipes = 0;
                if (typeof loadStack === 'function') {
                    loadStack();
                }
                changeScreen('scr-main');
            } else {
                closeChoice();
                if (typeof addToSearchHistory === 'function') {
                    addToSearchHistory();
                }
                if (typeof openBuild === 'function') {
                    openBuild();
                }
            }
        };
    }
    
    modal.classList.add('active');
}

// 選びなおす
function restartSelection() {
    if (!confirm('現在のスロットの選択をリセットしますか？')) return;
    
    // 現在のスロットの選択のみクリア
    liked = liked.filter(k => k.slot !== currentPos);
    seen = new Set(liked.map(k => k['漢字']));
    
    currentIdx = 0;
    swipes = 0;
    
    closeChoice();
    
    if (typeof loadStack === 'function') {
        loadStack();
    }
    
    changeScreen('scr-main');
}

// 追加検索
function continueSearching() {
    closeChoice();
    swipes = 0;
    changeScreen('scr-main');
}

function closeChoice() {
    const modal = document.getElementById('modal-choice');
    if (modal) modal.classList.remove('active');
}

function closeChoiceAndRefetch() {
    closeChoice();
    continueSearching();
}

console.log("CHOICE: Module loaded (Expanded)");
