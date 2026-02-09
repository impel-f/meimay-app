/* ============================================================
   MODULE 10: CHOICE (V13.0)
   進捗管理・10枚完了時のモーダル
   ============================================================ */

/**
 * 選択数チェック（10枚ごとにモーダル表示）
 */
function checkChoiceLimit(forceCount) {
    const count = forceCount || liked.filter(item => item.slot === currentPos).length;
    
    if (count > 0 && count % 10 === 0) {
        console.log(`CHOICE: ${count} items reached for slot ${currentPos}`);
        openChoiceModal(currentPos);
    }
}

/**
 * 選択完了モーダルを開く
 */
function openChoiceModal(slotIdx) {
    const modal = document.getElementById('modal-choice');
    const label = document.getElementById('choice-count-label');
    const msg = document.getElementById('choice-message');
    const btn = document.getElementById('choice-main-btn');
    
    if (!modal) {
        console.error("CHOICE: Modal not found");
        return;
    }
    
    const itemCount = liked.filter(item => item.slot === slotIdx).length;
    
    // カウント表示
    if (label) label.innerText = itemCount;
    
    // 最終スロット判定
    const isLastSlot = (slotIdx === segments.length - 1);
    const nextStep = isLastSlot ? "姓名判断・ビルド" : `${slotIdx + 2}文字目`;
    const currentChar = segments[slotIdx] || '';

    // メッセージ作成
    if (msg) {
        msg.innerHTML = `
            <div class="mb-4">
                <span class="text-2xl font-black text-[#bca37f]">${itemCount}枚</span>
                <span class="text-sm">の候補が集まりました</span>
            </div>
            <p class="text-sm text-[#7a6f5a] leading-relaxed">
                <b class="text-[#5d5444]">${slotIdx + 1}文字目「${currentChar}」</b>の候補が十分に揃いました。<br>
                このまま<b class="text-[#8b7e66]">${nextStep}</b>に進みますか？
            </p>
            <p class="text-xs text-[#a6967a] mt-4 italic">
                ${isLastSlot ? '全ての文字が揃ったら、名前を組み立てましょう' : 'もちろん、さらに候補を探すこともできます'}
            </p>
        `;
    }
    
    // ボタンの動作設定
    if (btn) {
        btn.onclick = () => {
            closeChoiceModal();
            
            if (isLastSlot) {
                // 最終スロット：ビルド画面へ
                openBuild();
            } else {
                // 次のスロットへ
                currentPos++;
                currentIdx = 0;
                
                if (typeof loadStack === 'function') {
                    loadStack();
                }
                
                changeScreen('scr-main');
            }
        };
    }
    
    // モーダル表示
    modal.classList.add('active');
    
    console.log(`CHOICE: Modal opened for slot ${slotIdx} (${itemCount} items)`);
}

/**
 * モーダルを閉じる
 */
function closeChoiceModal() {
    const modal = document.getElementById('modal-choice');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * モーダルを閉じて続行
 */
function closeChoiceAndRefetch() {
    console.log("CHOICE: User chose to continue searching");
    closeChoiceModal();
    // スワイプ画面に戻る
    changeScreen('scr-main');
}

/**
 * 進捗状況の取得
 */
function getProgress() {
    const progress = segments.map((seg, idx) => {
        const items = liked.filter(item => item.slot === idx);
        return {
            slot: idx,
            segment: seg,
            count: items.length,
            completed: items.length >= 10
        };
    });
    
    return progress;
}

/**
 * 全スロット完了チェック
 */
function isAllSlotsCompleted() {
    return segments.every((seg, idx) => {
        const items = liked.filter(item => item.slot === idx);
        return items.length >= 1; // 最低1つずつ
    });
}

/**
 * 進捗状況の表示（デバッグ用）
 */
function showProgress() {
    const progress = getProgress();
    console.log("=== PROGRESS REPORT ===");
    progress.forEach(p => {
        console.log(`  Slot ${p.slot + 1} (${p.segment}): ${p.count} items ${p.completed ? '✓' : ''}`);
    });
    console.log("=======================");
}

console.log("CHOICE: Module loaded");
