/* ============================================================
   MODULE 05: UI RENDER (V16.0 - AI詳細完全版)
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
    const shortMeaning = meaning.length > 50 ? meaning.substring(0, 50) + '...' : meaning;
    
    const readings = [data['音'], data['訓'], data['伝統名のり']]
        .filter(x => clean(x))
        .join(',')
        .split(/[、,，\s/]+/)
        .filter(x => clean(x))
        .slice(0, 3);
    
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
    
    const bgGradient = getGradientFromTags(tags);
    card.style.background = bgGradient;
    
    const tagsHTML = tags.length > 0 ? 
        tags.map(t => `<span class="px-3 py-1 bg-white bg-opacity-80 text-[#8b7e66] rounded-full text-xs font-bold shadow-sm">#${t}</span>`).join(' ') : '';
    
    const readingsHTML = readings.length > 0 ?
        readings.map(r => `<span class="px-2 py-1 bg-white bg-opacity-60 rounded-lg text-xs font-bold text-[#7a6f5a]">${r}</span>`).join(' ') : '';
    
    card.innerHTML = `
        <div class="flex-1 flex flex-col justify-center items-center px-4" onclick="showKanjiDetailAI(${currentIdx})">
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
    
    if (typeof setupPhysics === 'function') {
        setupPhysics(card, data);
    }
    
    container.appendChild(card);
}

function getGradientFromTags(tags) {
    const colorMap = {
        '自然': ['#f0fdf4', '#dcfce7', '#bbf7d0'],
        '植物': ['#f0fdf4', '#dcfce7', '#bbf7d0'],
        '花': ['#fef2f2', '#fce7f3', '#fbcfe8'],
        '海': ['#eff6ff', '#dbeafe', '#bfdbfe'],
        '水': ['#f0f9ff', '#e0f2fe', '#bae6fd'],
        '太陽': ['#fef3c7', '#fde68a', '#fcd34d'],
        '光': ['#fefce8', '#fef9c3', '#fef08a'],
        '月': ['#faf5ff', '#f3e8ff', '#e9d5ff'],
        '星': ['#faf5ff', '#f3e8ff', '#e9d5ff'],
        '繰り返し': ['#fdfaf5', '#f8f5ef', '#f0ebe0']
    };
    
    const colors = tags.slice(0, 2).map(tag => colorMap[tag] || null).filter(c => c !== null);
    
    if (colors.length === 2) {
        return `linear-gradient(135deg, ${colors[0][0]} 0%, ${colors[0][1]} 30%, ${colors[1][1]} 70%, ${colors[1][2]} 100%)`;
    } else if (colors.length === 1) {
        return `linear-gradient(135deg, ${colors[0][0]} 0%, ${colors[0][1]} 50%, ${colors[0][2]} 100%)`;
    }
    
    return 'linear-gradient(135deg, #fffefb 0%, #fdfaf5 50%, #f8f5ef 100%)';
}

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
 * AI漢字詳細表示（故事成語・四字熟語・成り立ち）
 */
async function showKanjiDetailAI(idx) {
    const data = stack[idx];
    const modal = document.getElementById('modal-kanji-detail');
    if (!modal) return;
    
    modal.classList.add('active');
    modal.innerHTML = `
        <div class="detail-sheet max-w-md">
            <button class="modal-close-btn" onclick="closeKanjiDetail()">✕</button>
            <div class="text-center mb-6">
                <div class="text-6xl font-black text-[#5d5444] mb-3">${data['漢字']}</div>
                <div class="text-sm text-[#a6967a]">${data['画数']}画</div>
            </div>
            <div class="flex items-center justify-center py-12">
                <div class="w-10 h-10 border-4 border-[#eee5d8] border-t-[#bca37f] rounded-full animate-spin"></div>
            </div>
            <p class="text-xs text-center text-[#a6967a]">AIで詳細情報を取得中...</p>
        </div>
    `;
    
    try {
        const aiContent = await generateKanjiDetailAI(data);
        modal.innerHTML = `
            <div class="detail-sheet max-w-md max-h-[80vh] overflow-y-auto">
                <button class="modal-close-btn" onclick="closeKanjiDetail()">✕</button>
                <div class="text-center mb-6">
                    <div class="text-6xl font-black text-[#5d5444] mb-3">${data['漢字']}</div>
                    <div class="text-sm text-[#a6967a]">${data['画数']}画</div>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <h3 class="text-xs font-bold text-[#a6967a] mb-2">読み方</h3>
                        <div class="text-sm text-[#5d5444] p-3 bg-[#fdfaf5] rounded-2xl">
                            ${[data['音'], data['訓'], data['伝統名のり']].filter(x => clean(x)).join('、')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xs font-bold text-[#a6967a] mb-2">意味</h3>
                        <div class="text-sm text-[#5d5444] p-3 bg-[#fdfaf5] rounded-2xl leading-relaxed">
                            ${clean(data['意味'])}
                        </div>
                    </div>
                    
                    ${aiContent}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('AI詳細生成エラー:', error);
        modal.innerHTML = `
            <div class="detail-sheet max-w-md">
                <button class="modal-close-btn" onclick="closeKanjiDetail()">✕</button>
                <div class="text-center mb-6">
                    <div class="text-6xl font-black text-[#5d5444] mb-3">${data['漢字']}</div>
                </div>
                <p class="text-sm text-center text-[#a6967a] py-8">
                    詳細情報の取得に失敗しました
                </p>
            </div>
        `;
    }
}

async function generateKanjiDetailAI(data) {
    const prompt = `
漢字「${data['漢字']}」について、以下の情報を簡潔に教えてください：

1. 四字熟語（この漢字を含む代表的な四字熟語を3つ、それぞれ簡潔な説明付き）
2. 故事成語（関連する故事成語があれば1-2個）
3. 漢字の成り立ち（字源や由来を50文字程度で）

【出力形式】
## 四字熟語
- 熟語1：説明
- 熟語2：説明
- 熟語3：説明

## 故事成語
- 成語1：説明

## 成り立ち
説明文
    `.trim();
    
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const result = await response.json();
        const text = result.text || '';
        
        // マークダウンをHTMLに変換
        const html = text
            .replace(/## (.+)/g, '<h3 class="text-sm font-bold text-[#5d5444] mt-4 mb-2">$1</h3>')
            .replace(/- (.+?)：(.+)/g, '<div class="mb-2 p-3 bg-white rounded-xl border border-[#eee5d8]"><div class="font-bold text-sm text-[#5d5444]">$1</div><div class="text-xs text-[#7a6f5a] mt-1">$2</div></div>')
            .replace(/\n\n/g, '<br>');
        
        return `<div class="mt-4">${html}</div>`;
        
    } catch (error) {
        return '<p class="text-xs text-[#a6967a] text-center py-4">AI詳細情報は現在利用できません</p>';
    }
}

function closeKanjiDetail() {
    const modal = document.getElementById('modal-kanji-detail');
    if (modal) modal.classList.remove('active');
}

console.log("UI RENDER: Module loaded (AI Detail)");
