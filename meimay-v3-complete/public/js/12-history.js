/* ============================================================
   MODULE 12: HISTORY (V17.0 - 名前単位履歴)
   ============================================================ */

// 検索履歴に追加（名前単位）
function addToSearchHistory() {
    if (!segments || segments.length === 0) return;
    
    const readingKey = segments.join('');
    const history = getSearchHistory();
    
    // 既存エントリを削除（最新を優先）
    const filtered = history.filter(h => h.reading !== readingKey);
    
    const entry = {
        reading: readingKey,
        segments: [...segments],
        searchedAt: new Date().toISOString(),
        results: liked.filter(k => k.slot > 0).map(k => ({
            kanji: k['漢字'],
            slot: k.slot,
            type: k.type
        }))
    };
    
    filtered.unshift(entry);
    
    if (filtered.length > 50) {
        filtered.length = 50;
    }
    
    localStorage.setItem('meimay_search_history', JSON.stringify(filtered));
}

function getSearchHistory() {
    try {
        const data = localStorage.getItem('meimay_search_history');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
}

// 名前を保存
function saveName() {
    if (!currentBuildResult || !currentBuildResult.fullName) {
        alert('保存する名前がありません');
        return;
    }
    
    // 願いを取得
    const wishInput = document.getElementById('wish-input');
    if (wishInput) {
        currentBuildResult.wish = wishInput.value.trim();
    }
    
    const saved = getSavedNames();
    
    const isDuplicate = saved.some(item => item.fullName === currentBuildResult.fullName);
    if (isDuplicate) {
        if (!confirm('この名前は既に保存されています。上書きしますか？')) {
            return;
        }
        const filtered = saved.filter(item => item.fullName !== currentBuildResult.fullName);
        localStorage.setItem('meimay_saved', JSON.stringify(filtered));
    }
    
    const saveData = {
        ...currentBuildResult,
        savedAt: new Date().toISOString()
    };
    
    saved.unshift(saveData);
    
    if (saved.length > 50) {
        saved.length = 50;
    }
    
    localStorage.setItem('meimay_saved', JSON.stringify(saved));
    
    alert('✨ 名前を保存しました！');
}

function getSavedNames() {
    try {
        const data = localStorage.getItem('meimay_saved');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
}

// 履歴画面を開く
function openHistory() {
    const modal = document.getElementById('modal-history');
    if (!modal) return;
    
    renderHistory();
    modal.classList.add('active');
}

function renderHistory() {
    const container = document.getElementById('history-content');
    if (!container) return;
    
    const saved = getSavedNames();
    const searchHistory = getSearchHistory();
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- 保存済み名前（横4文字）-->
            <div>
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">⭐</span> 保存済み（${saved.length}件）
                </h3>
                ${saved.length > 0 ? `
                    <div class="grid grid-cols-4 gap-3">
                        ${saved.map((item, index) => `
                            <div onclick="loadSavedName(${index})" class="bg-white rounded-2xl border border-[#eee5d8] p-3 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all" style="aspect-ratio: 1;">
                                <div class="text-2xl font-black text-[#5d5444] mb-1">${item.givenName}</div>
                                <div class="text-[9px] text-[#a6967a] text-center">${item.reading}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-10 text-sm text-[#a6967a]">
                        保存された名前はまだありません
                    </div>
                `}
            </div>
            
            <!-- 検索履歴（名前単位）-->
            <div>
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">🔍</span> 検索履歴（${searchHistory.length}件）
                </h3>
                ${searchHistory.length > 0 ? `
                    <div class="space-y-2">
                        ${searchHistory.slice(0, 20).map((item, index) => `
                            <div onclick="loadSearchHistory(${index})" class="bg-[#fdfaf5] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
                                <div>
                                    <span class="text-lg font-black text-[#5d5444]">${item.reading}</span>
                                    <span class="text-xs text-[#a6967a] ml-2">${item.segments.join('/')}</span>
                                </div>
                                <div class="text-xs text-[#bca37f] font-bold">
                                    ${item.results.length}個の漢字
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="clearSearchHistory()" class="w-full mt-4 py-3 bg-[#fef2f2] rounded-xl text-xs font-bold text-[#f28b82] hover:bg-[#f28b82] hover:text-white transition-all">
                        履歴をクリア
                    </button>
                ` : `
                    <div class="text-center py-10 text-sm text-[#a6967a]">
                        検索履歴はまだありません
                    </div>
                `}
            </div>
        </div>
    `;
}

function loadSavedName(index) {
    const saved = getSavedNames();
    if (index < 0 || index >= saved.length) return;
    
    const item = saved[index];
    currentBuildResult = item;
    
    closeHistory();
    changeScreen('scr-build');
    renderBuildResult();
}

function loadSearchHistory(index) {
    const history = getSearchHistory();
    if (index < 0 || index >= history.length) return;
    
    const item = history[index];
    
    // セグメントと選択漢字を復元
    segments = item.segments;
    liked = [];
    
    // ストック画面へ
    closeHistory();
    alert(`「${item.reading}」の検索履歴を読み込みました\nストック画面で確認してください`);
    changeScreen('scr-stock');
}

function clearSearchHistory() {
    if (!confirm('検索履歴をすべて削除しますか？')) return;
    
    localStorage.removeItem('meimay_search_history');
    renderHistory();
}

function closeHistory() {
    const modal = document.getElementById('modal-history');
    if (modal) modal.classList.remove('active');
}

console.log("HISTORY: Module loaded (Name-based)");
