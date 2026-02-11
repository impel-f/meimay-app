/* ============================================================
   MODULE 10: CHOICE (V13.1 - スワイプ回数表示修正)
   進捗管理・10枚完了時のモーダル
   ============================================================ */

/**
 * 選択完了モーダルを開く（10枚スワイプごと）
 */
function openChoice() {
    console.log("CHOICE: Opening choice modal");
    
    const modal = document.getElementById('modal-choice');
    const countLabel = document.getElementById('choice-count-label');
    const message = document.getElementById('choice-message');
    const mainBtn = document.getElementById('choice-main-btn');
    
    if (countLabel) countLabel.innerText = `${swipes}`;
    
    const isLastSlot = currentPos >= segments.length - 1;
    const nextStep = isLastSlot ? "ビルド画面" : `${currentPos + 2}文字目`;
    const currentChar = segments[currentPos] || '';
    
    if (message) {
        message.innerHTML = `
            <div class="mb-4">
                <span class="text-2xl font-black text-[#bca37f]">${swipes}枚</span>
                <span class="text-sm">スワイプしました</span>
            </div>
            <p class="text-sm text-[#7a6f5a] leading-relaxed">
                <b class="text-[#5d5444]">${currentPos + 1}文字目「${currentChar}」</b>の候補を見ています。<br>
                このまま<b class="text-[#8b7e66]">${nextStep}</b>に進みますか？
            </p>
            <p class="text-xs text-[#a6967a] mt-4 italic">
                ${isLastSlot ? '全ての文字が揃ったら、名前を組み立てましょう' : 'もちろん、さらに候補を探すこともできます'}
            </p>
        `;
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
                if (typeof openBuild === 'function') {
                    openBuild();
                }
            }
        };
    }
    
    modal.classList.add('active');
}

function closeChoice() {
    const modal = document.getElementById('modal-choice');
    if (modal) modal.classList.remove('active');
}

function closeChoiceAndRefetch() {
    closeChoice();
    // もっと探す：そのまま続ける
}

console.log("CHOICE: Module loaded (v13.1)");
