// UI Flow Module
function openStock() {
    changeScreen('scr-stock');
    renderStock();
}

function renderStock() {
    const container = document.getElementById('stock-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (liked.length === 0) {
        container.innerHTML = '<div class="col-span-2 text-center py-20 text-[#a6967a]">まだストックがありません</div>';
        return;
    }
    
    liked.forEach(item => {
        const card = document.createElement('div');
        card.className = 'stock-card';
        card.innerHTML = `
            <div class="stock-kanji">${item['漢字']}</div>
            <div class="text-[10px] text-[#a6967a] mt-2">${item['画数']}画</div>
        `;
        card.onclick = () => showDetail(item);
        container.appendChild(card);
    });
}

function showDetail(k) {
    const modal = document.getElementById('modal-detail');
    document.getElementById('det-kanji').innerText = k['漢字'];
    document.getElementById('det-strokes').innerText = k['画数'] + '画';
    document.getElementById('det-meaning').innerText = k['意味'] || '';
    
    const rdBox = document.getElementById('det-readings');
    rdBox.innerHTML = '';
    const rds = (k['音'] + ',' + k['訓']).split(/[、,，]+/).filter(x => x);
    rds.forEach(r => {
        const tag = document.createElement('span');
        tag.className = 'read-tag';
        tag.innerText = r;
        rdBox.appendChild(tag);
    });
    
    modal.classList.add('active');
}

function closeDetail() {
    document.getElementById('modal-detail').classList.remove('active');
}

function handleSwipeProgress() {
    swipes++;
    console.log(`Swipes: ${swipes}`);
    
    if (swipes > 0 && swipes % 10 === 0) {
        showDecisionModal();
    } else {
        currentIdx++;
        if (typeof render === 'function') render();
    }
}

function showDecisionModal() {
    const modal = document.getElementById('modal-choice');
    const isLast = (currentPos === segments.length - 1);
    const msg = document.getElementById('choice-message');
    const btn = document.getElementById('choice-main-btn');
    
    if (msg && btn) {
        if (isLast) {
            msg.innerHTML = '全てのパーツが揃いました！<br>DIYビルドを開始しましょう。';
            btn.innerText = '⚒️ DIYビルド画面へ';
            btn.onclick = () => {
                modal.classList.remove('active');
                openBuild();
            };
        } else {
            msg.innerHTML = `次の文字「${segments[currentPos+1]}」へ進みますか？`;
            btn.innerText = '次の文字へ';
            btn.onclick = goToNextReadingSlot;
        }
    }
    modal.classList.add('active');
}

function closeChoiceAndRefetch() {
    document.getElementById('modal-choice').classList.remove('active');
    currentIdx++;
    if (typeof render === 'function') render();
}

function goToNextReadingSlot() {
    document.getElementById('modal-choice').classList.remove('active');
    currentPos++;
    swipes = 0;
    currentIdx = 0;
    loadStack();
}

console.log("✅ UI-FLOW Module Loaded");
