/* ============================================================
   MODULE 06: UI PHYSICS (V13.1 - 正しい修正版)
   スワイプ物理演算・アニメーション
   ============================================================ */

let isDragging = false;
let startX = 0;
let currentX = 0;
let currentCard = null;
let badgeLike, badgeNope, badgeSuper;

/**
 * カードの物理演算をセットアップ
 */
function setupPhysics(card, data) {
    currentCard = card;
    badgeLike = document.getElementById('badge-like');
    badgeNope = document.getElementById('badge-nope');
    badgeSuper = document.getElementById('badge-super');
    
    if (!card) return;
    
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('touchstart', handleStart, { passive: false });
    
    card.dataset.kanji = JSON.stringify(data);
}

/**
 * ドラッグ開始
 */
function handleStart(e) {
    if (!currentCard) return;
    
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    
    currentCard.style.transition = 'none';
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
    
    if (e.cancelable) e.preventDefault();
}

/**
 * ドラッグ中
 */
function handleMove(e) {
    if (!isDragging || !currentCard) return;
    
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;
    const rotate = deltaX / 10;
    const opacity = 1 - Math.abs(deltaX) / 500;
    
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    currentCard.style.opacity = opacity;
    
    updateBadges(deltaX);
    
    if (e.cancelable) e.preventDefault();
}

/**
 * ドラッグ終了
 */
function handleEnd() {
    if (!isDragging || !currentCard) return;
    
    isDragging = false;
    const deltaX = currentX - startX;
    const threshold = 100;
    
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
    
    hideBadges();
    
    if (Math.abs(deltaX) > threshold) {
        const direction = deltaX > 0 ? 'right' : 'left';
        const data = JSON.parse(currentCard.dataset.kanji || '{}');
        executeSwipe(direction, data);
    } else {
        currentCard.style.transition = 'transform 0.3s, opacity 0.3s';
        currentCard.style.transform = '';
        currentCard.style.opacity = '1';
    }
}

/**
 * バッジ更新
 */
function updateBadges(deltaX) {
    const threshold = 50;
    
    if (badgeLike) badgeLike.style.opacity = deltaX > threshold ? '1' : '0';
    if (badgeNope) badgeNope.style.opacity = deltaX < -threshold ? '1' : '0';
    if (badgeSuper) badgeSuper.style.opacity = '0';
}

/**
 * バッジ非表示
 */
function hideBadges() {
    if (badgeLike) badgeLike.style.opacity = '0';
    if (badgeNope) badgeNope.style.opacity = '0';
    if (badgeSuper) badgeSuper.style.opacity = '0';
}

/**
 * 手動スワイプ（ボタン押下時）
 */
function manual(dir) {
    const data = stack[currentIdx];
    if (data) {
        executeSwipe(dir, data);
    } else {
        console.warn("PHYSICS: No data available for manual swipe");
    }
}

/**
 * スワイプの実行
 */
function executeSwipe(dir, data) {
    const el = document.querySelectorAll('.card')[0]; 
    if (!el) {
        console.error("PHYSICS: Card element not found");
        return;
    }
    
    // 既にスワイプ中なら無視（重複防止）
    if (el.classList.contains('swipe-right') || 
        el.classList.contains('swipe-left') || 
        el.classList.contains('swipe-up')) {
        return;
    }

    // アニメーション開始
    el.style.transition = 'transform 0.5s ease-in, opacity 0.4s';
    el.classList.add('swipe-' + dir);
    
    // データ処理（左以外はストック）
    if (data && dir !== 'left') {
        // 重複チェック：既に同じ漢字が同じスロットに存在しないか確認
        const isDuplicate = liked.some(item => 
            item.slot === currentPos && item['漢字'] === data['漢字']
        );
        
        if (!isDuplicate) {
            seen.add(data['漢字']);
            liked.push({ 
                ...data, 
                slot: currentPos,
                type: (dir === 'up') ? 'super' : 'like',  // type追加
                isSuper: (dir === 'up')  // 互換性のため残す
            });
        } else {
            console.log(`PHYSICS: Duplicate detected - ${data['漢字']} already in slot ${currentPos}`);
        }
    }

    // DOM削除と次のカード表示
    setTimeout(() => {
        el.remove();
        currentIdx++;
        
        if (typeof render === 'function') {
            render();
        }
        
        if (typeof handleSwipeProgress === 'function') {
            handleSwipeProgress();
        }
        
        swipes++;
        console.log(`PHYSICS: Swipe ${dir} executed (total: ${swipes})`);
        
        // 10枚スワイプしたら選択肢を表示
        if (swipes % 10 === 0) {
            console.log(`PHYSICS: 10 swipes reached, opening choice modal`);
            if (typeof openChoice === 'function') {
                openChoice();
            }
        }
    }, 400);
}

/**
 * スワイプ進行状況の処理（オプション）
 */
function handleSwipeProgress() {
    // 将来的な拡張用（アナリティクスなど）
}

console.log("PHYSICS: Module loaded (v13.1)");
