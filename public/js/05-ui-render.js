/* ============================================================
   MODULE 05: UI RENDER (V14.0)
   カード描画・詳細表示（修正版）
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
    console.log("RENDER: Rendering card", currentIdx, data['漢字']);
    
    const card = document.createElement('div');
    card.className = 'card';
    
    const meaning = clean(data['意味']);
    const shortMeaning = meaning.length > 50 ? meaning.substring(0, 50) + '...' : meaning;
    
    // 読みを取得
    const readings = [data['音'], data['訓'], data['伝統名のり']]
        .filter(x => clean(x))
        .join(',')
        .split(/[、,，\s/]+/)
        .filter(x => clean(x))
        .slice(0, 3);
    
    // 分類タグを取得
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
    
    // タグHTML
    const tagsHTML = tags.length > 0 ? 
        tags.map(t => `<span class="px-3 py-1 bg-white bg-opacity-80 text-[#8b7e66] rounded-full text-xs font-bold shadow-sm">#${t}</span>`).join(' ') :
        '';
    
    // 読みHTML
    const readingsHTML = readings.length > 0 ?
        readings.map(r => `<span class="px-2 py-1 bg-white bg-opacity-60 rounded-lg text-xs font-bold text-[#7a6f5a]">${r}</span>`).join(' ') :
        '';
    
    card.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center px-4" onclick="showKanjiDetailByIndex(${currentIdx})">
            ${tagsHTML ? `<div class="flex gap-2 mb-4">${tagsHTML}</div>` : ''}
            
            <div class="text-[120px] font-black text-[#5d5444] leading-none mb-3">${data['漢字']}</div>
            
            <div class="text-[#bca37f] font-black text-lg mb-3">${data['画数']}画</div>
            
            ${readingsHTML ? `<div class="flex gap-2 mb-4 flex-wrap justify-center">${readingsHTML}</div>` : ''}
            
            <div class="w-full max-w-xs bg-white bg-opacity-70 rounded-2xl px-4 py-3 shadow-sm">
                <p class="text-xs leading-relaxed text-[#7a6f5a] text-center">${shortMeaning || '意味情報なし'}</p>
            </div>
        </div>
        <div class="text-center text-[9px] text-[#d4c5af] font-bold tracking-widest pb-2">
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
    console.log("RENDER: Card appended to container");
}

/**
 * タグからグラデーションを生成（大幅拡充版）
 */
function getGradientFromTags(tags) {
    const colorMap = {
        // 自然系
        '自然': ['#f0fdf4', '#dcfce7', '#bbf7d0'],
        '植物': ['#f0fdf4', '#dcfce7', '#bbf7d0'],
        '樹木': ['#ecfdf5', '#d1fae5', '#a7f3d0'],
        '草': ['#f0fdf4', '#dcfce7', '#bbf7d0'],
        '木': ['#ecfdf5', '#d1fae5', '#a7f3d0'],
        '森': ['#ecfdf5', '#d1fae5', '#a7f3d0'],
        
        // 花系
        '花': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '華やか': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '桜': ['#fff1f2', '#ffe4e6', '#fecdd3'],
        
        // 水系
        '海': ['#eff6ff', '#dbeafe', '#bfdbfe'],
        '水': ['#f0f9ff', '#e0f2fe', '#bae6fd'],
        '川': ['#ecfeff', '#cffafe', '#a5f3fc'],
        
        // 太陽・光系
        '太陽': ['#fef3c7', '#fde68a', '#fcd34d'],
        '陽': ['#fef3c7', '#fde68a', '#fcd34d'],
        '光': ['#fefce8', '#fef9c3', '#fef08a'],
        
        // 月・星系
        '月': ['#faf5ff', '#f3e8ff', '#e9d5ff'],
        '星': ['#faf5ff', '#f3e8ff', '#e9d5ff'],
        
        // 季節系
        '春': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '夏': ['#ecfeff', '#cffafe', '#a5f3fc'],
        '秋': ['#fff7ed', '#ffedd5', '#fed7aa'],
        '冬': ['#f0f9ff', '#e0f2fe', '#bae6fd'],
        
        // 繰り返し
        '繰り返し': ['#fdfaf5', '#f8f5ef', '#f0ebe0'],
        '記号': ['#fdfaf5', '#f8f5ef', '#f0ebe0']
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
 * 漢字詳細モーダルを表示（インデックス版）
 */
function showKanjiDetailByIndex(idx) {
    if (!stack || idx < 0 || idx >= stack.length) {
        console.error("RENDER: Invalid kanji index", idx);
        return;
    }
    
    const data = stack[idx];
    showKanjiDetail(data);
}

/**
 * 漢字詳細モーダルを表示
 */
async function showKanjiDetail(data) {
    const modal = document.getElementById('modal-kanji-detail');
    if (!modal) {
        console.error("RENDER: Kanji detail modal not found");
        return;
    }
    
    const kanjiEl = document.getElementById('detail-kanji');
    const readingEl = document.getElementById('detail-reading');
    const meaningEl = document.getElementById('detail-meaning');
    const yojijukugoEl = document.getElementById('detail-yojijukugo');
    
    if (!kanjiEl || !readingEl || !meaningEl || !yojijukugoEl) return;
    
    // 基本情報を表示
    kanjiEl.innerText = data['漢字'];
    
    const readings = [data['音'], data['訓'], data['伝統名のり']]
        .filter(x => clean(x))
        .join(',')
        .split(/[、,，\s/]+/)
        .filter(x => clean(x));
    readingEl.innerText = readings.join('、');
    
    meaningEl.innerText = clean(data['意味']) || '意味情報なし';
    
    // 四字熟語生成（簡易版）
    yojijukugoEl.innerHTML = '<p class="text-sm text-[#a6967a]">四字熟語機能は今後実装予定です</p>';
    
    modal.classList.add('active');
}

/**
 * 漢字詳細モーダルを閉じる
 */
function closeKanjiDetail() {
    const modal = document.getElementById('modal-kanji-detail');
    if (modal) modal.classList.remove('active');
}

console.log("UI RENDER: Module loaded (Fixed version)");
