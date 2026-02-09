// UI Physics Module  
let startX, startY, currentX, currentY, isDragging = false;

function attachSwipeListeners(card) {
    card.addEventListener('touchstart', handleStart);
    card.addEventListener('touchmove', handleMove);
    card.addEventListener('touchend', handleEnd);
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseup', handleEnd);
}

function handleStart(e) {
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
}

function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches ? e.touches[0] : e;
    currentX = touch.clientX;
    currentY = touch.clientY;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const rotation = deltaX * 0.1;
    
    const card = document.getElementById('current-card');
    if (card) {
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        card.style.transition = 'none';
        
        if (deltaX > 50) showBadge('like');
        else if (deltaX < -50) showBadge('nope');
        else if (deltaY < -50) showBadge('super');
        else hideBadges();
    }
}

function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    if (deltaX > 100) executeSwipe('right');
    else if (deltaX < -100) executeSwipe('left');
    else if (deltaY < -100) executeSwipe('up');
    else resetCard();
}

function executeSwipe(direction) {
    const card = document.getElementById('current-card');
    if (!card) return;
    
    hideBadges();
    
    if (direction === 'right') {
        card.classList.add('swipe-right');
        const k = stack[currentIdx];
        k.reading = toHira(segments[currentPos]);
        k.slot = currentPos;
        k.isSuper = false;
        liked.push(k);
        seen.add(k['漢字']);
    } else if (direction === 'left') {
        card.classList.add('swipe-left');
        seen.add(stack[currentIdx]['漢字']);
    } else if (direction === 'up') {
        card.classList.add('swipe-up');
        const k = stack[currentIdx];
        k.reading = toHira(segments[currentPos]);
        k.slot = currentPos;
        k.isSuper = true;
        liked.push(k);
        seen.add(k['漢字']);
    }
    
    setTimeout(() => {
        handleSwipeProgress();
    }, 600);
}

function resetCard() {
    const card = document.getElementById('current-card');
    if (card) {
        card.style.transform = '';
        card.style.transition = 'transform 0.3s';
    }
    hideBadges();
}

function showBadge(type) {
    hideBadges();
    const badge = document.getElementById(`badge-${type}`);
    if (badge) badge.style.opacity = '1';
}

function hideBadges() {
    ['like', 'nope', 'super'].forEach(type => {
        const badge = document.getElementById(`badge-${type}`);
        if (badge) badge.style.opacity = '0';
    });
}

function manual(dir) {
    const dirMap = { left: 'left', right: 'right', up: 'up' };
    executeSwipe(dirMap[dir]);
}

console.log("✅ UI-PHYSICS Module Loaded");
