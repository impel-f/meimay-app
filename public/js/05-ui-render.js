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
    
    // 分類タグを取得（【】を除去して#で分割）
    const tags = [];
    const imageTag = clean(data['名前のイメージ']);
    const categoryTag = clean(data['分類']);
    
    if (imageTag) {
        imageTag.replace(/【|】/g, '').split(/[、,，\s/#]+/).slice(0, 2).forEach(t => {
            if (t && t.length > 0 && t !== '---') tags.push(t);
        });
    }
    if (categoryTag && !tags.some(tag => categoryTag.includes(tag))) {
        categoryTag.replace(/【|】/g, '').split(/[、,，\s/#]+/).slice(0, 1).forEach(t => {
            if (t && t.length > 0 && t !== '---') tags.push(t);
        });
    }
    
    // 背景色をイメージに連動
    const bgGradient = getGradientFromTags(tags);
    card.style.background = bgGradient;
    
    const tagsHTML = tags.length > 0 ? 
        tags.map(t => `<span class="px-3 py-1 bg-white bg-opacity-70 text-[#8b7e66] rounded-full text-xs font-bold shadow-sm">#${t}</span>`).join(' ') :
        '';
    
    card.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center">
            ${tagsHTML ? `<div class="flex gap-2 mb-4">${tagsHTML}</div>` : ''}
            <div class="text-[140px] font-black text-[#5d5444] leading-none mb-4">${data['漢字']}</div>
            <div class="text-[#bca37f] font-black text-xl mb-2">${data['画数']}画</div>
            ${readingText ? `<div class="text-[#a6967a] text-sm font-bold mb-4">${readingText}</div>` : ''}
            <div class="text-[#7a6f5a] text-sm text-center leading-relaxed px-6 max-w-xs">
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
 * タグからグラデーションを生成
 */
function getGradientFromTags(tags) {
    const colorMap = {
        '自然': ['#f0fdf4', '#dcfce7', '#bbf7d0'],
        '植物': ['#f0fdf4', '#dcfce7', '#bbf7d0'],
        '樹木': ['#ecfdf5', '#d1fae5', '#a7f3d0'],
        '花': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '華やか': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '美しい': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '海': ['#eff6ff', '#dbeafe', '#bfdbfe'],
        '水': ['#f0f9ff', '#e0f2fe', '#bae6fd'],
        '川': ['#ecfeff', '#cffafe', '#a5f3fc'],
        '空': ['#eff6ff', '#dbeafe', '#bfdbfe'],
        '太陽': ['#fef3c7', '#fde68a', '#fcd34d'],
        '光': ['#fefce8', '#fef9c3', '#fef08a'],
        '月': ['#faf5ff', '#f3e8ff', '#e9d5ff'],
        '星': ['#faf5ff', '#f3e8ff', '#e9d5ff'],
        '春': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '夏': ['#ecfeff', '#cffafe', '#a5f3fc'],
        '秋': ['#fff7ed', '#ffedd5', '#fed7aa'],
        '冬': ['#f0f9ff', '#e0f2fe', '#bae6fd'],
        '優しい': ['#fef2f2', '#fee2e2', '#fecaca'],
        '強い': ['#fef2f2', '#fde68a', '#fcd34d'],
        '明るい': ['#fefce8', '#fef9c3', '#fef08a'],
        '穏やか': ['#f0fdf4', '#dcfce7', '#bbf7d0']
    };
    
    // 最初の2つのタグから色を取得
    const colors = tags.slice(0, 2)
        .map(tag => colorMap[tag] || null)
        .filter(c => c !== null);
    
    if (colors.length === 2) {
        return `linear-gradient(135deg, ${colors[0][0]} 0%, ${colors[0][1]} 30%, ${colors[1][1]} 70%, ${colors[1][2]} 100%)`;
    } else if (colors.length === 1) {
        return `linear-gradient(135deg, ${colors[0][0]} 0%, ${colors[0][1]} 50%, ${colors[0][2]} 100%)`;
    }
    
    // デフォルト
    return 'linear-gradient(135deg, #fffefb 0%, #fdfaf5 50%, #f8f5ef 100%)';
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
