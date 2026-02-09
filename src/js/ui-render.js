// UI Render Module
function render() {
    const container = document.getElementById('stack');
    if (!container) return;
    container.innerHTML = '';
    
    if (currentIdx >= stack.length) {
        renderEndOfStack(container);
        return;
    }
    
    const k = stack[currentIdx];
    const card = document.createElement('div');
    card.className = 'card';
    card.id = 'current-card';
    
    const rds = (k['音'] + ',' + k['訓']).split(/[、,，]+/).filter(x => x).slice(0, 3);
    
    card.innerHTML = `
        <div class="card-header-zone"></div>
        <div class="card-kanji-zone">
            <div class="text-[120px] font-black text-[#5d5444]">${k['漢字']}</div>
        </div>
        <div class="card-reading-zone">
            <div class="text-center text-[#bca37f] font-bold mb-2">${rds.join(' / ')}</div>
            <div class="text-[11px] text-center text-[#7a6f5a] leading-relaxed px-4">${k['意味'] || ''}</div>
        </div>
        <div class="card-footer-zone">
            <div class="text-center text-[#a6967a] text-[10px] font-black">${k['画数']}画</div>
        </div>
    `;
    
    container.appendChild(card);
    attachSwipeListeners(card);
}

function renderEndOfStack(container) {
    const isLast = (currentPos === segments.length - 1);
    container.innerHTML = `
        <div class="mt-28 text-center px-10">
            <div class="text-4xl mb-6">🏁</div>
            <p class="text-[#a6967a] mb-12 text-sm">全ての候補を確認しました</p>
            <button onclick="${isLast ? 'openBuild()' : 'goToNextReadingSlot()'}" class="btn-gold py-5">
                ${isLast ? '⚒️ ビルド画面へ' : '次の文字へ'}
            </button>
        </div>
    `;
}

console.log("✅ UI-RENDER Module Loaded");
