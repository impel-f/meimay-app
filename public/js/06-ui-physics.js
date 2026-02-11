/* ============================================================
   MODULE 06: UI PHYSICS (V13.1 - スワイプ回数カウント修正)
   スワイプ物理演算・アニメーション
   ============================================================ */

let isDragging = false;
let startX = 0;
let currentX = 0;
let currentCard = null;
let badgeLike, badgeNope, badgeSuper;

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
        animateSwipe(direction);
    } else {
        currentCard.style.transition = 'transform 0.3s, opacity 0.3s';
        currentCard.style.transform = '';
        currentCard.style.opacity = '1';
    }
}

function updateBadges(deltaX) {
    const threshold = 50;
    
    if (badgeLike) badgeLike.style.opacity = deltaX > threshold ? '1' : '0';
    if (badgeNope) badgeNope.style.opacity = deltaX < -threshold ? '1' : '0';
    if (badgeSuper) badgeSuper.style.opacity = '0';
}

function hideBadges() {
    if (badgeLike) badgeLike.style.opacity = '0';
    if (badgeNope) badgeNope.style.opacity = '0';
    if (badgeSuper) badgeSuper.style.opacity = '0';
}

function manual(direction) {
    if (!currentCard) {
        console.error("PHYSICS: No current card");
        return;
    }
    animateSwipe(direction);
}

function animateSwipe(dir) {
    if (!currentCard) return;
    
    const data = JSON.parse(currentCard.dataset.kanji || '{}');
    const exitX = dir === 'right' ? 1000 : dir === 'left' ? -1000 : 0;
    const exitY = dir === 'up' ? -1000 : 0;
    
    currentCard.style.transition = 'transform 0.4s, opacity 0.4s';
    currentCard.style.transform = `translateX(${exitX}px) translateY(${exitY}px) rotate(${exitX / 5}deg)`;
    currentCard.style.opacity = '0';
    
    if (dir === 'right') {
        data.type = 'like';
        liked.push({ ...data, slot: currentPos });
        seen.add(data['漢字']);
        if (badgeLike) badgeLike.style.opacity = '1';
    } else if (dir === 'up') {
        data.type = 'super';
        liked.push({ ...data, slot: currentPos });
        seen.add(data['漢字']);
        if (badgeSuper) badgeSuper.style.opacity = '1';
    } else if (dir === 'left') {
        if (badgeNope) badgeNope.style.opacity = '1';
    }
    
    if (typeof StorageBox !== 'undefined') {
        StorageBox.saveState();
    }
    
    setTimeout(() => {
        hideBadges();
        currentIdx++;
        
        if (currentIdx < stack.length) {
            if (typeof render === 'function') {
                render();
            }
        } else {
            const container = document.getElementById('stack');
            if (container) {
                container.innerHTML = `
                    <div class="flex items-center justify-center h-full text-center px-6">
                        <div>
                            <p class="text-[#bca37f] font-bold text-lg mb-4">候補が終わりました</p>
                            <p class="text-sm text-[#a6967a] mb-6">次の文字に進むか、<br>ビルド画面で名前を確認しましょう</p>
                            ${currentPos < segments.length - 1 ? 
                                '<button onclick="proceedToNextSlot()" class="btn-gold py-4 px-8">次の文字へ進む →</button>' : 
                                '<button onclick="openBuild()" class="btn-gold py-4 px-8">ビルド画面へ →</button>'
                            }
                        </div>
                    </div>
                `;
            }
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
