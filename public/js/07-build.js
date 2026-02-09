/* ============================================================
   MODULE 07: BUILD (V13.0)
   ビルド画面・名前構築・姓名判断表示
   ============================================================ */

let selectedPieces = [];

/**
 * ストック画面を開く
 */
function openStock() {
    console.log("BUILD: Opening stock screen");
    renderStock();
    changeScreen('scr-stock');
}

/**
 * ストック一覧のレンダリング
 */
function renderStock() {
    const container = document.getElementById('stock-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (liked.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 text-center py-20">
                <p class="text-[#bca37f] italic text-lg mb-2">まだストックがありません</p>
                <p class="text-sm text-[#a6967a]">スワイプ画面で漢字を選びましょう</p>
            </div>
        `;
        return;
    }
    
    // スロット別に表示
    segments.forEach((seg, idx) => {
        const items = liked.filter(item => item.slot === idx);
        
        if (items.length > 0) {
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'stock-card';
                card.onclick = () => showDetailByData(item);
                
                card.innerHTML = `
                    <div class="stock-kanji">${item['漢字']}</div>
                    <div class="text-xs text-[#bca37f] font-bold mt-2">${item['画数']}画</div>
                    <div class="text-[10px] text-[#a6967a] mt-1">${idx + 1}文字目: ${seg}</div>
                    ${item.isSuper ? '<div class="text-[#8ab4f8] text-2xl mt-2">★</div>' : ''}
                `;
                container.appendChild(card);
            });
        }
    });
}

/**
 * ビルド画面を開く
 */
function openBuild() {
    console.log("BUILD: Opening build screen");
    selectedPieces = [];
    renderBuildSelection();
    changeScreen('scr-build');
}

/**
 * ビルド選択画面のレンダリング
 */
function renderBuildSelection() {
    const container = document.getElementById('build-selection');
    if (!container) return;
    
    container.innerHTML = '';
    
    segments.forEach((seg, idx) => {
        const row = document.createElement('div');
        row.className = 'mb-6';
        
        row.innerHTML = `
            <p class="text-[11px] font-black text-[#bca37f] uppercase mb-3 tracking-widest flex items-center gap-2">
                <span class="bg-[#bca37f] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">${idx + 1}</span>
                ${idx + 1}文字目: ${seg}
            </p>
        `;
        
        const scrollBox = document.createElement('div');
        scrollBox.className = 'flex overflow-x-auto pb-2 no-scrollbar gap-1';
        
        const items = liked.filter(item => item.slot === idx);
        
        if (items.length === 0) {
            scrollBox.innerHTML = '<div class="text-[#bca37f] text-sm italic px-4 py-6">候補なし（スワイプ画面で選んでください）</div>';
        } else {
            items.forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'build-piece-btn';
                btn.onclick = () => selectBuildPiece(idx, item, btn);
                
                btn.innerHTML = `
                    <div class="build-kanji-text">${item['漢字']}</div>
                    <div class="text-[10px] text-[#a6967a] font-bold mt-1">${item['画数']}画</div>
                    ${item.isSuper ? '<div class="text-[#8ab4f8] text-sm mt-1">★</div>' : ''}
                `;
                scrollBox.appendChild(btn);
            });
        }
        
        row.appendChild(scrollBox);
        container.appendChild(row);
    });
}

/**
 * ビルドピース選択
 */
function selectBuildPiece(slot, data, btnElement) {
    console.log(`BUILD: Selected piece for slot ${slot}:`, data['漢字']);
    
    selectedPieces[slot] = data;
    
    // 同じスロットの他のボタンの選択解除
    const parent = btnElement.parentElement;
    parent.querySelectorAll('.build-piece-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 現在のボタンを選択状態に
    btnElement.classList.add('selected');
    
    // 全スロット選択済みならビルド実行
    const allSelected = selectedPieces.filter(x => x).length === segments.length;
    if (allSelected) {
        setTimeout(() => executeBuild(), 300);
    }
}

/**
 * ビルド実行
 */
function executeBuild() {
    console.log("BUILD: Executing build with selected pieces");
    
    const givenName = selectedPieces.map(p => p['漢字']).join('');
    const fullName = surnameStr + givenName;
    const reading = segments.join('');
    
    const givArr = selectedPieces.map(p => ({ 
        kanji: p['漢字'], 
        strokes: parseInt(p['画数']) || 0
    }));
    
    // 姓名判断実行
    let fortune = null;
    if (typeof FortuneLogic !== 'undefined' && FortuneLogic.calculate) {
        if (surnameData && surnameData.length > 0) {
            fortune = FortuneLogic.calculate(surnameData, givArr);
        } else {
            // 名字なしの場合、仮の名字で計算
            const tempSurname = [{ kanji: '', strokes: 1 }];
            fortune = FortuneLogic.calculate(tempSurname, givArr);
        }
    }
    
    // 結果を保存
    currentBuildResult = {
        fullName: fullName,
        reading: reading,
        fortune: fortune,
        combination: selectedPieces,
        givenName: givenName,
        timestamp: new Date().toISOString()
    };
    
    // 結果表示
    renderBuildResult();
}

/**
 * ビルド結果のレンダリング
 */
function renderBuildResult() {
    const container = document.getElementById('build-result-area');
    if (!container) return;
    
    const r = currentBuildResult;
    
    container.innerHTML = `
        <div class="glass-card rounded-[50px] p-10 mb-6 shadow-xl animate-fade-in">
            <h3 class="text-5xl font-black text-center mb-6 text-[#5d5444] tracking-tight">${r.fullName}</h3>
            
            <div class="text-center mb-8">
                <div class="inline-flex flex-wrap justify-center gap-2">
                    ${surnameStr ? `
                        <div class="reading-part-box">
                            <span class="reading-label-mini">姓</span>
                            <span class="reading-text-main">${surnameStr}</span>
                        </div>
                    ` : ''}
                    <div class="reading-part-box">
                        <span class="reading-label-mini">名</span>
                        <span class="reading-text-main">${r.reading}</span>
                    </div>
                </div>
            </div>
            
            ${r.fortune ? `
                <div class="text-center mb-8 p-6 bg-gradient-to-br from-[#fdfaf5] to-white rounded-[30px]">
                    <div class="text-3xl font-black ${r.fortune.so.res.color} mb-2">
                        総格 ${r.fortune.so.val}画
                    </div>
                    <div class="text-xl font-bold ${r.fortune.so.res.color} mb-4">
                        ${r.fortune.so.res.label}
                    </div>
                    <button onclick="showFortuneDetail()" class="text-sm text-[#bca37f] font-bold border-b-2 border-[#bca37f] pb-1 hover:text-[#8b7e66] hover:border-[#8b7e66] transition-colors">
                        詳細な姓名判断を見る →
                    </button>
                </div>
            ` : ''}
            
            <div class="grid grid-cols-2 gap-3 mt-8">
                <button onclick="generateOrigin()" class="btn-gold py-4">由来を生成</button>
                <button onclick="saveName()" class="btn-premium-select !mb-0 py-4">保存する</button>
            </div>
        </div>
    `;
}

/**
 * 姓名判断詳細モーダル表示
 */
function showFortuneDetail() {
    const modal = document.getElementById('modal-fortune-detail');
    if (!modal || !currentBuildResult.fortune) return;
    
    const f = currentBuildResult.fortune;
    
    document.getElementById('for-name').innerText = currentBuildResult.fullName;
    
    const grid = document.getElementById('for-grid');
    grid.innerHTML = `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center p-4 bg-[#fdfaf5] rounded-3xl border border-[#eee5d8]">
                <div class="text-[10px] font-black text-[#bca37f] mb-2 uppercase tracking-wider">天格</div>
                <div class="text-4xl font-black ${f.ten.res.color} mb-1">${f.ten.val}</div>
                <div class="text-xs text-[#a6967a] font-bold">${f.ten.res.label}</div>
            </div>
            <div class="text-center p-4 bg-[#fdfaf5] rounded-3xl border border-[#eee5d8]">
                <div class="text-[10px] font-black text-[#bca37f] mb-2 uppercase tracking-wider">人格</div>
                <div class="text-4xl font-black ${f.jin.res.color} mb-1">${f.jin.val}</div>
                <div class="text-xs text-[#a6967a] font-bold">${f.jin.res.label}</div>
            </div>
            <div class="text-center p-4 bg-[#fdfaf5] rounded-3xl border border-[#eee5d8]">
                <div class="text-[10px] font-black text-[#bca37f] mb-2 uppercase tracking-wider">地格</div>
                <div class="text-4xl font-black ${f.chi.res.color} mb-1">${f.chi.val}</div>
                <div class="text-xs text-[#a6967a] font-bold">${f.chi.res.label}</div>
            </div>
            <div class="text-center p-4 bg-[#fdfaf5] rounded-3xl border border-[#eee5d8]">
                <div class="text-[10px] font-black text-[#bca37f] mb-2 uppercase tracking-wider">外格</div>
                <div class="text-4xl font-black ${f.gai.res.color} mb-1">${f.gai.val}</div>
                <div class="text-xs text-[#a6967a] font-bold">${f.gai.res.label}</div>
            </div>
        </div>
        
        <div class="text-center p-6 bg-gradient-to-br from-[#fdfaf5] to-white rounded-3xl border-2 border-[#bca37f] mb-6">
            <div class="text-[11px] font-black text-[#bca37f] mb-3 uppercase tracking-wider">総格（総合運）</div>
            <div class="text-6xl font-black ${f.so.res.color} mb-3">${f.so.val}</div>
            <div class="text-lg font-bold ${f.so.res.color}">${f.so.res.label}</div>
        </div>
    `;
    
    const desc = document.getElementById('for-desc');
    desc.innerHTML = `
        <div class="space-y-4 text-[#7a6f5a] leading-relaxed">
            <div class="p-4 bg-white rounded-2xl">
                <p class="font-bold text-[#5d5444] mb-1">天格 ${f.ten.val}画</p>
                <p class="text-xs">${f.ten.role}</p>
            </div>
            <div class="p-4 bg-white rounded-2xl">
                <p class="font-bold text-[#5d5444] mb-1">人格 ${f.jin.val}画</p>
                <p class="text-xs">${f.jin.role}</p>
            </div>
            <div class="p-4 bg-white rounded-2xl">
                <p class="font-bold text-[#5d5444] mb-1">地格 ${f.chi.val}画</p>
                <p class="text-xs">${f.chi.role}</p>
            </div>
            <div class="p-4 bg-white rounded-2xl">
                <p class="font-bold text-[#5d5444] mb-1">外格 ${f.gai.val}画</p>
                <p class="text-xs">${f.gai.role}</p>
            </div>
            <div class="p-4 bg-white rounded-2xl">
                <p class="font-bold text-[#5d5444] mb-1">総格 ${f.so.val}画</p>
                <p class="text-xs">${f.so.role}</p>
            </div>
            
            <div class="p-4 bg-[#fdfaf5] rounded-2xl border border-dashed border-[#bca37f]">
                <p class="font-bold text-[#8b7e66] mb-2">三才配置</p>
                <div class="flex justify-center gap-2 mb-2">
                    <span class="px-3 py-1 bg-white rounded-full text-xs font-bold">${f.sansai.t}</span>
                    <span class="px-3 py-1 bg-white rounded-full text-xs font-bold">${f.sansai.j}</span>
                    <span class="px-3 py-1 bg-white rounded-full text-xs font-bold">${f.sansai.c}</span>
                </div>
                <p class="text-xs font-bold ${f.sansai.label === '大吉' ? 'text-amber-600' : 'text-[#81c995]'}">${f.sansai.label}</p>
                <p class="text-xs mt-1">${f.sansai.desc}</p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

/**
 * 姓名判断詳細モーダルを閉じる
 */
function closeFortuneDetail() {
    const modal = document.getElementById('modal-fortune-detail');
    if (modal) modal.classList.remove('active');
}

console.log("BUILD: Module loaded");
