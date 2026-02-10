/* ============================================================
   MODULE 12: HISTORY (V1.0)
   履歴・保存機能
   ============================================================ */

/**
 * 名前を保存
 */
function saveName() {
    if (!currentBuildResult || !currentBuildResult.fullName) {
        alert('保存する名前がありません');
        return;
    }
    
    const saved = getSavedNames();
    
    // 重複チェック
    const isDuplicate = saved.some(item => item.fullName === currentBuildResult.fullName);
    if (isDuplicate) {
        if (!confirm('この名前は既に保存されています。上書きしますか？')) {
            return;
        }
        // 既存を削除
        const filtered = saved.filter(item => item.fullName !== currentBuildResult.fullName);
        localStorage.setItem('meimay_saved', JSON.stringify(filtered));
    }
    
    // 保存データを作成
    const saveData = {
        ...currentBuildResult,
        savedAt: new Date().toISOString(),
        note: ''
    };
    
    saved.unshift(saveData);
    
    // 最大50件まで
    if (saved.length > 50) {
        saved.length = 50;
    }
    
    localStorage.setItem('meimay_saved', JSON.stringify(saved));
    
    alert('✨ 名前を保存しました！');
    console.log('HISTORY: Name saved', saveData);
}

/**
 * 検索履歴に追加
 */
function addToHistory() {
    if (!currentBuildResult || !currentBuildResult.fullName) return;
    
    const history = getSearchHistory();
    
    // 重複を削除（最新を優先）
    const filtered = history.filter(item => item.fullName !== currentBuildResult.fullName);
    
    const historyData = {
        fullName: currentBuildResult.fullName,
        reading: currentBuildResult.reading,
        combination: currentBuildResult.combination,
        fortune: currentBuildResult.fortune ? {
            so: currentBuildResult.fortune.so.val,
            label: currentBuildResult.fortune.so.res.label
        } : null,
        searchedAt: new Date().toISOString()
    };
    
    filtered.unshift(historyData);
    
    // 最大100件まで
    if (filtered.length > 100) {
        filtered.length = 100;
    }
    
    localStorage.setItem('meimay_history', JSON.stringify(filtered));
    console.log('HISTORY: Added to history', historyData);
}

/**
 * 保存済み名前を取得
 */
function getSavedNames() {
    try {
        const data = localStorage.getItem('meimay_saved');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('HISTORY: Failed to load saved names', error);
        return [];
    }
}

/**
 * 検索履歴を取得
 */
function getSearchHistory() {
    try {
        const data = localStorage.getItem('meimay_history');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('HISTORY: Failed to load history', error);
        return [];
    }
}

/**
 * 保存済み・履歴画面を開く
 */
function openHistory() {
    const modal = document.getElementById('modal-history');
    if (!modal) {
        console.error("HISTORY: Modal not found");
        return;
    }
    
    renderHistory();
    modal.classList.add('active');
}

/**
 * 履歴画面のレンダリング
 */
function renderHistory() {
    const container = document.getElementById('history-content');
    if (!container) return;
    
    const saved = getSavedNames();
    const history = getSearchHistory();
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- 保存済み -->
            <div>
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">⭐</span> 保存済み（${saved.length}件）
                </h3>
                ${saved.length > 0 ? `
                    <div class="space-y-3">
                        ${saved.map((item, index) => `
                            <div class="bg-white rounded-2xl p-4 border border-[#eee5d8] shadow-sm">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div class="text-lg font-black text-[#5d5444]">${item.fullName}</div>
                                        <div class="text-xs text-[#a6967a]">${item.reading}</div>
                                    </div>
                                    ${item.fortune ? `
                                        <div class="text-right">
                                            <div class="text-sm font-bold ${item.fortune.so.res?.color || 'text-[#bca37f]'}">${item.fortune.so.val || item.fortune.so}画</div>
                                            <div class="text-xs ${item.fortune.so.res?.color || 'text-[#bca37f]'}">${item.fortune.so.res?.label || item.fortune.label}</div>
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="flex gap-2 mt-3">
                                    <button onclick="loadSavedName(${index})" class="flex-1 py-2 bg-[#fdfaf5] rounded-xl text-xs font-bold text-[#7a6f5a] hover:bg-[#bca37f] hover:text-white transition-all">
                                        詳細を見る
                                    </button>
                                    <button onclick="deleteSavedName(${index})" class="px-4 py-2 bg-[#fef2f2] rounded-xl text-xs font-bold text-[#f28b82] hover:bg-[#f28b82] hover:text-white transition-all">
                                        削除
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-10 text-sm text-[#a6967a]">
                        保存された名前はまだありません
                    </div>
                `}
            </div>
            
            <!-- 検索履歴 -->
            <div>
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">🕐</span> 検索履歴（${history.length}件）
                </h3>
                ${history.length > 0 ? `
                    <div class="space-y-2">
                        ${history.slice(0, 20).map((item, index) => `
                            <div class="bg-[#fdfaf5] rounded-xl p-3 flex items-center justify-between">
                                <div>
                                    <span class="text-sm font-bold text-[#5d5444]">${item.fullName}</span>
                                    <span class="text-xs text-[#a6967a] ml-2">${item.reading}</span>
                                </div>
                                ${item.fortune ? `
                                    <div class="text-xs ${item.fortune.label === '大吉' ? 'text-amber-600' : 'text-[#bca37f]'} font-bold">
                                        ${item.fortune.label}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="clearHistory()" class="w-full mt-4 py-3 bg-[#fef2f2] rounded-xl text-xs font-bold text-[#f28b82] hover:bg-[#f28b82] hover:text-white transition-all">
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

/**
 * 保存済み名前を読み込む
 */
function loadSavedName(index) {
    const saved = getSavedNames();
    if (index < 0 || index >= saved.length) return;
    
    const item = saved[index];
    currentBuildResult = item;
    
    closeHistory();
    
    // ビルド画面に遷移
    changeScreen('scr-build');
    renderBuildResult();
    
    console.log('HISTORY: Loaded saved name', item);
}

/**
 * 保存済み名前を削除
 */
function deleteSavedName(index) {
    if (!confirm('この名前を削除しますか？')) return;
    
    const saved = getSavedNames();
    saved.splice(index, 1);
    localStorage.setItem('meimay_saved', JSON.stringify(saved));
    
    renderHistory();
    console.log('HISTORY: Deleted saved name at index', index);
}

/**
 * 検索履歴をクリア
 */
function clearHistory() {
    if (!confirm('検索履歴をすべて削除しますか？')) return;
    
    localStorage.removeItem('meimay_history');
    renderHistory();
    console.log('HISTORY: Cleared history');
}

/**
 * 履歴画面を閉じる
 */
function closeHistory() {
    const modal = document.getElementById('modal-history');
    if (modal) modal.classList.remove('active');
}

// ビルド実行時に自動的に履歴に追加
const originalExecuteBuild = window.executeBuild;
if (typeof originalExecuteBuild === 'function') {
    window.executeBuild = function() {
        originalExecuteBuild.apply(this, arguments);
        setTimeout(() => addToHistory(), 500);
    };
}

console.log("HISTORY: Module loaded");
