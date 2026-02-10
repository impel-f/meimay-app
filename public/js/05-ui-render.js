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
                    <p class="text-sm text-[#a6967a] mb-6">設定を変更するか、<br>次の文字に進んでください</p>
                    ${currentPos < segments.length - 1 ? 
                        '<button onclick="proceedToNextSlot()" class="btn-gold py-4 px-8">次の文字へ進む →</button>' : 
                        '<button onclick="openBuild()" class="btn-gold py-4 px-8">ビルド画面へ →</button>'
                    }
                </div>
            </div>
        `;
        return;
    }
    
    const data = stack[currentIdx];
    const card = document.createElement('div');
    card.className = 'card';
    
    // 背景グラデーション追加
    card.style.background = 'linear-gradient(135deg, #fffefb 0%, #fdfaf5 50%, #f8f5ef 100%)';
    
    const meaning = clean(data['意味']);
    const shortMeaning = meaning.length > 60 ? meaning.substring(0, 60) + '...' : meaning;
    
    // 読みを取得
    const readings = [data['音'], data['訓'], data['伝統名のり']]
        .filter(x => clean(x))
        .join(',')
        .split(/[、,，\s/]+/)
        .filter(x => clean(x))
        .slice(0, 3);
    const readingText = readings.join('・');
    
    // 分類タグを取得
    const tags = [];
    const imageTag = clean(data['名前のイメージ']);
    const categoryTag = clean(data['分類']);
    
    if (imageTag) {
        imageTag.split(/[、,，\s/]+/).slice(0, 2).forEach(t => {
            if (t && t !== '---') tags.push(t);
        });
    }
    if (categoryTag && !tags.includes(categoryTag)) {
        categoryTag.split(/[、,，\s/]+/).slice(0, 1).forEach(t => {
            if (t && t !== '---') tags.push(t);
        });
    }
    
    const tagsHTML = tags.length > 0 ? 
        tags.map(t => `<span class="px-3 py-1 bg-[#bca37f] bg-opacity-20 text-[#8b7e66] rounded-full text-xs font-bold">#${t}</span>`).join(' ') :
        '';
    
    card.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center">
            <div class="text-[140px] font-black text-[#5d5444] leading-none mb-4">${data['漢字']}</div>
            <div class="text-[#bca37f] font-black text-xl mb-2">${data['画数']}画</div>
            ${readingText ? `<div class="text-[#a6967a] text-sm font-bold mb-4">${readingText}</div>` : ''}
            ${tagsHTML ? `<div class="flex gap-2 mb-6">${tagsHTML}</div>` : ''}
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
 * 次のスロットへ進む
 */
function proceedToNextSlot() {
    if (currentPos < segments.length - 1) {
        currentPos++;
        currentIdx = 0;
        if (typeof loadStack === 'function') {
            loadStack();
        }
        changeScreen('scr-main');
    }
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
