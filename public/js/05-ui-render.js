/* ============================================================
   MODULE 05: UI RENDER (V13.0)
   カード描画・詳細表示
   ============================================================ */

/**
 * カードのレンダリング
 */
function render() {
    const container = document.getElementById('stack');
    if (!container) {
        console.error("RENDER: 'stack' container not found");
        return;
    }
    
    container.innerHTML = '';
    
    // スタック終了チェック
    if (!stack || stack.length === 0 || currentIdx >= stack.length) {
        container.innerHTML = `
            <div class="flex items-center justify-center h-full text-center px-6">
                <div>
                    <p class="text-[#bca37f] font-bold text-lg mb-4">候補がありません</p>
                    <p class="text-sm text-[#a6967a]">設定を変更するか、<br>次の文字に進んでください</p>
                </div>
            </div>
        `;
        return;
    }
    
    const data = stack[currentIdx];
    const card = document.createElement('div');
    card.className = 'card';
    
    const meaning = clean(data['意味']);
    const shortMeaning = meaning.length > 60 ? meaning.substring(0, 60) + '...' : meaning;
    
    card.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center">
            <div class="text-[140px] font-black text-[#5d5444] leading-none mb-8">${data['漢字']}</div>
            <div class="text-[#bca37f] font-black text-2xl mb-6">${data['画数']}画</div>
            <div class="text-[#a6967a] text-sm text-center leading-relaxed px-6 max-w-xs">
                ${shortMeaning || '意味情報なし'}
            </div>
        </div>
        <div class="text-center text-[10px] text-[#d4c5af] font-bold tracking-widest">
            タップで詳細 / スワイプで選択
        </div>
    `;
    
    // 物理演算セットアップ
    if (typeof setupPhysics === 'function') {
        setupPhysics(card, data);
    } else {
        console.error("RENDER: setupPhysics() not found");
    }
    
    container.appendChild(card);
}

/**
 * 詳細モーダル表示
 */
function showDetailByData(data) {
    const modal = document.getElementById('modal-detail');
    if (!modal) {
        console.error("RENDER: 'modal-detail' not found");
        return;
    }
    
    // 漢字と画数
    document.getElementById('det-kanji').innerText = data['漢字'];
    document.getElementById('det-strokes').innerText = data['画数'] + '画';
    
    // 読み
    const readingsDiv = document.getElementById('det-readings');
    readingsDiv.innerHTML = '';
    
    const allReads = [data['音'], data['訓'], data['伝統名のり']]
        .filter(x => clean(x))
        .join(',')
        .split(/[、,，\s/]+/)
        .filter(x => clean(x));
    
    if (allReads.length === 0) {
        readingsDiv.innerHTML = '<span class="text-sm text-[#a6967a] italic">読み情報なし</span>';
    } else {
        allReads.forEach(r => {
            const tag = document.createElement('span');
            tag.className = 'read-tag';
            tag.innerText = r;
            readingsDiv.appendChild(tag);
        });
    }
    
    // 意味
    const meaning = clean(data['意味']) || '意味情報が登録されていません';
    document.getElementById('det-meaning').innerText = meaning;
    
    // モーダル表示
    modal.classList.add('active');
    
    console.log(`RENDER: Detail modal opened for ${data['漢字']}`);
}

/**
 * 詳細モーダルを閉じる
 */
function closeDetail() {
    const modal = document.getElementById('modal-detail');
    if (modal) {
        modal.classList.remove('active');
    }
}

console.log("RENDER: Module loaded");
