/* ============================================================
   MODULE 07: BUILD & STOCK (V17.0 - 完全版)
   ============================================================ */

// ストック画面を開く（スーパーライク優先、1文字目除外、横4文字）
function openStock() {
    console.log("BUILD: Opening stock screen");
    
    if (!liked || liked.length === 0) {
        alert('まだストックがありません。\nスワイプで漢字を選んでください。');
        return;
    }
    
    // スーパーライク優先でソート、1文字目を除外
    const superLiked = liked.filter(k => k.type === 'super' && k.slot > 0);
    const normalLiked = liked.filter(k => k.type !== 'super' && k.slot > 0);
    const sortedLiked = [...superLiked, ...normalLiked];
    
    const container = document.getElementById('stock-grid');
    if (!container) {
        console.error("BUILD: stock-grid not found");
        return;
    }
    
    container.innerHTML = sortedLiked.map(k => `
        <div onclick="showStockKanjiDetailAI('${k['漢字']}')" class="relative bg-white rounded-3xl border-2 ${k.type === 'super' ? 'border-[#8ab4f8]' : 'border-[#eee5d8]'} p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all active:scale-95" style="aspect-ratio: 1;">
            ${k.type === 'super' ? '<div class="absolute top-2 right-2 text-lg">⭐</div>' : ''}
            <div class="text-4xl font-black text-[#5d5444] mb-1">${k['漢字']}</div>
            <div class="text-[10px] text-[#a6967a] font-bold">${k['画数']}画</div>
        </div>
    `).join('');
    
    changeScreen('scr-stock');
}

// ストックの漢字詳細（AI生成）
async function showStockKanjiDetailAI(kanji) {
    const data = liked.find(k => k['漢字'] === kanji);
    if (!data) return;
    
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
        modal.innerHTML = `
            <div class="detail-sheet max-w-md">
                <button class="modal-close-btn" onclick="closeKanjiDetail()">✕</button>
                <p class="text-sm text-center text-[#a6967a] py-8">詳細情報の取得に失敗しました</p>
            </div>
        `;
    }
}

// ビルド画面を開く
function openBuild() {
    // モーダルを全て閉じる
    document.querySelectorAll(".overlay.active").forEach(m => m.classList.remove("active"));
    console.log("BUILD: Opening build screen");
    changeScreen('scr-build');
    executeBuild();
}

// ビルド実行
function executeBuild() {
    console.log("BUILD: Executing build");
    
    // 結果を完全初期化
    currentBuildResult = {
        fullName: '',
        reading: '',
        fortune: null,
        combination: [],
        givenName: '',
        timestamp: null,
        wish: '' // 願い欄追加
    };
    
    // 結果表示エリアをクリア
    const resultArea = document.getElementById('build-result-area');
    if (resultArea) {
        resultArea.innerHTML = '';
    }
    
    if (!liked || liked.length === 0) {
        if (resultArea) {
            resultArea.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-[#a6967a] text-sm mb-4">まだ漢字を選んでいません</p>
                    <button onclick="changeScreen('scr-main')" class="btn-gold py-4 px-8">スワイプ画面へ →</button>
                </div>
            `;
        }
        return;
    }
    
    // 組み合わせ生成（1文字目除外）
    const usableLiked = liked.filter(k => k.slot > 0);
    
    if (usableLiked.length === 0) {
        if (resultArea) {
            resultArea.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-[#a6967a] text-sm mb-4">使用できる漢字がありません</p>
                    <button onclick="changeScreen('scr-main')" class="btn-gold py-4 px-8">スワイプ画面へ →</button>
                </div>
            `;
        }
        return;
    }
    
    // スロットごとにグループ化
    const bySlot = {};
    usableLiked.forEach(k => {
        if (!bySlot[k.slot]) bySlot[k.slot] = [];
        bySlot[k.slot].push(k);
    });
    
    // 各スロットから1つずつ選択
    const slots = Object.keys(bySlot).map(Number).sort();
    const combo = slots.map(slotNum => {
        const candidates = bySlot[slotNum];
        // スーパーライク優先
        const superLikes = candidates.filter(c => c.type === 'super');
        return superLikes.length > 0 ? superLikes[0] : candidates[0];
    });
    
    if (combo.length === 0) {
        if (resultArea) {
            resultArea.innerHTML = `<div class="text-center py-12"><p class="text-[#a6967a] text-sm">組み合わせを作成できませんでした</p></div>`;
        }
        return;
    }
    
    const givenName = combo.map(k => k['漢字']).join('');
    const reading = combo.map((k, i) => segments[k.slot]).join('');
    const fullName = surnameStr + givenName;
    
    // 運勢計算
    let fortune = null;
    if (typeof FortuneLogic !== 'undefined' && surnameData && surnameData.length > 0) {
        const surArr = surnameData.map(s => s.strokes);
        const givArr = combo.map(k => parseInt(k['画数']) || 0);
        fortune = FortuneLogic.calculate(surArr, givArr);
    }
    
    // 結果を保存
    currentBuildResult = {
        fullName,
        reading,
        fortune,
        combination: combo,
        givenName,
        timestamp: new Date().toISOString(),
        wish: ''
    };
    
    renderBuildResult();
}

// ビルド結果のレンダリング（願い欄追加）
function renderBuildResult() {
    const container = document.getElementById('build-result-area');
    if (!container) return;
    
    const r = currentBuildResult;
    const surnameReading = document.getElementById('in-surname-reading')?.value || '';
    
    container.innerHTML = `
        <div class="glass-card rounded-[50px] p-8 mb-6 shadow-xl animate-fade-in">
            <h3 class="text-4xl font-black text-center mb-4 text-[#5d5444] tracking-tight leading-tight">${r.fullName}</h3>
            
            <div class="text-center mb-6">
                <div class="inline-flex flex-wrap justify-center gap-2">
                    ${surnameReading ? `
                        <div class="px-3 py-1 bg-white bg-opacity-60 rounded-lg">
                            <span class="text-[10px] text-[#a6967a] font-bold">姓</span>
                            <span class="text-sm text-[#5d5444] font-bold ml-1">${surnameReading}</span>
                        </div>
                    ` : ''}
                    <div class="px-3 py-1 bg-white bg-opacity-60 rounded-lg">
                        <span class="text-[10px] text-[#a6967a] font-bold">名</span>
                        <span class="text-sm text-[#5d5444] font-bold ml-1">${r.reading}</span>
                    </div>
                </div>
            </div>
            
            ${r.fortune && !prioritizeFortune ? `
                <div class="text-center mb-6">
                    <button onclick="showFortuneDetail()" class="text-xs text-[#bca37f] font-bold border-b-2 border-[#bca37f] pb-1 hover:text-[#8b7e66] hover:border-[#8b7e66] transition-colors">
                        運勢を見る →
                    </button>
                </div>
            ` : r.fortune && prioritizeFortune ? `
                <div class="text-center mb-6 p-5 bg-gradient-to-br from-[#fdfaf5] to-white rounded-[30px]">
                    <div class="text-2xl font-black ${r.fortune.so.res.color} mb-1">
                        総格 ${r.fortune.so.val}画
                    </div>
                    <div class="text-lg font-bold ${r.fortune.so.res.color} mb-3">
                        ${r.fortune.so.res.label}
                    </div>
                    <button onclick="showFortuneDetail()" class="text-xs text-[#bca37f] font-bold border-b-2 border-[#bca37f] pb-1">
                        詳細な姓名判断を見る →
                    </button>
                </div>
            ` : ''}
            
            <div class="bg-white bg-opacity-70 rounded-3xl p-5 mb-6">
                <h4 class="text-xs font-bold text-[#a6967a] mb-3">💫 この名前に込める願い</h4>
                <textarea id="wish-input" placeholder="例：優しく、強く、心豊かに育ってほしい" class="w-full p-3 bg-[#fdfaf5] rounded-2xl border border-[#eee5d8] text-sm text-[#5d5444] resize-none focus:outline-none focus:border-[#bca37f]" rows="3">${r.wish || ''}</textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mt-6">
                <button onclick="generateOrigin()" class="btn-gold py-3 text-sm">由来を生成</button>
                <button onclick="saveNameWithWish()" class="btn-premium-select !mb-0 py-3 text-sm">保存する</button>
            </div>
        </div>
    `;
}

// 願い付きで保存
function saveNameWithWish() {
    const wishInput = document.getElementById('wish-input');
    if (wishInput) {
        currentBuildResult.wish = wishInput.value.trim();
    }
    
    if (typeof saveName === 'function') {
        saveName();
    }
}

// 運勢詳細表示
function showFortuneDetail() {
    if (!currentBuildResult || !currentBuildResult.fortune) {
        alert('運勢データがありません');
        return;
    }
    
    const modal = document.getElementById('modal-fortune-detail');
    if (!modal) return;
    
    const { fullName, fortune } = currentBuildResult;
    
    // GAS版の運勢表示を実装（省略）
    modal.classList.add('active');
    
    // 簡易版表示
    const nameEl = document.getElementById('for-name');
    if (nameEl) nameEl.innerText = fullName;
    
    console.log("FORTUNE: Detail displayed");
}

function closeFortuneDetail() {
    const modal = document.getElementById('modal-fortune-detail');
    if (modal) modal.classList.remove('active');
}

console.log("BUILD: Module loaded (Complete)");
