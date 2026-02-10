/* ============================================================
   MODULE 11: SETTINGS (V1.0)
   設定画面一覧化
   ============================================================ */

/**
 * 設定画面を開く
 */
function openSettings() {
    const modal = document.getElementById('modal-settings');
    if (!modal) {
        console.error("SETTINGS: Modal not found");
        return;
    }
    
    renderSettings();
    modal.classList.add('active');
}

/**
 * 設定画面のレンダリング
 */
function renderSettings() {
    const container = document.getElementById('settings-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- 名字設定 -->
            <div class="bg-white rounded-[30px] p-6 border border-[#eee5d8] shadow-sm">
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">👤</span> 名字
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-[#a6967a] w-16">漢字</span>
                        <div class="flex-1 px-3 py-2 bg-[#fdfaf5] rounded-xl border border-[#eee5d8] text-sm">${surnameStr || '未設定'}</div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-[#a6967a] w-16">読み</span>
                        <div class="flex-1 px-3 py-2 bg-[#fdfaf5] rounded-xl border border-[#eee5d8] text-sm">${surnameReading || '未設定'}</div>
                    </div>
                </div>
            </div>
            
            <!-- 名前の読み -->
            <div class="bg-white rounded-[30px] p-6 border border-[#eee5d8] shadow-sm">
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">✨</span> 名前の読み
                </h3>
                <div class="flex-1 px-3 py-2 bg-[#fdfaf5] rounded-xl border border-[#eee5d8] text-sm">
                    ${segments.join('・') || '未設定'}
                </div>
            </div>
            
            <!-- 性別 -->
            <div class="bg-white rounded-[30px] p-6 border border-[#eee5d8] shadow-sm">
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">🎯</span> 性別
                </h3>
                <div class="grid grid-cols-3 gap-2">
                    <button onclick="updateGender('male')" class="py-3 rounded-xl border-2 text-xs font-bold transition-all ${gender === 'male' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'}">
                        男の子
                    </button>
                    <button onclick="updateGender('female')" class="py-3 rounded-xl border-2 text-xs font-bold transition-all ${gender === 'female' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'}">
                        女の子
                    </button>
                    <button onclick="updateGender('unspecified')" class="py-3 rounded-xl border-2 text-xs font-bold transition-all ${gender === 'unspecified' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'}">
                        指定なし
                    </button>
                </div>
            </div>
            
            <!-- 画数の好み -->
            <div class="bg-white rounded-[30px] p-6 border border-[#eee5d8] shadow-sm">
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">📊</span> 画数の好み
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-[#7a6f5a]">シンプル（〜10画）</span>
                        <label class="relative inline-block w-12 h-6">
                            <input type="checkbox" ${favorSimple ? 'checked' : ''} onchange="updateFavorSimple(this.checked)" class="sr-only peer">
                            <div class="w-full h-full bg-[#eee5d8] peer-checked:bg-[#bca37f] rounded-full transition-all"></div>
                            <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-[#7a6f5a]">複雑（15画〜）</span>
                        <label class="relative inline-block w-12 h-6">
                            <input type="checkbox" ${favorComplex ? 'checked' : ''} onchange="updateFavorComplex(this.checked)" class="sr-only peer">
                            <div class="w-full h-full bg-[#eee5d8] peer-checked:bg-[#bca37f] rounded-full transition-all"></div>
                            <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- マッチングルール -->
            <div class="bg-white rounded-[30px] p-6 border border-[#eee5d8] shadow-sm">
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">🎯</span> マッチングルール
                </h3>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="updateRule('strict')" class="py-3 rounded-xl border-2 text-xs font-bold transition-all ${rule === 'strict' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'}">
                        厳密
                    </button>
                    <button onclick="updateRule('flexible')" class="py-3 rounded-xl border-2 text-xs font-bold transition-all ${rule === 'flexible' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'}">
                        柔軟
                    </button>
                </div>
                <p class="text-[10px] text-[#a6967a] mt-3 text-center">
                    ${rule === 'strict' ? '完全一致のみ表示' : '部分一致も表示'}
                </p>
            </div>
            
            <!-- 姓名判断 -->
            <div class="bg-white rounded-[30px] p-6 border border-[#eee5d8] shadow-sm">
                <h3 class="text-sm font-black text-[#5d5444] mb-4 flex items-center gap-2">
                    <span class="text-lg">🔮</span> 姓名判断
                </h3>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-[#7a6f5a]">運勢を優先</span>
                    <label class="relative inline-block w-12 h-6">
                        <input type="checkbox" ${prioritizeFortune ? 'checked' : ''} onchange="updatePrioritizeFortune(this.checked)" class="sr-only peer">
                        <div class="w-full h-full bg-[#eee5d8] peer-checked:bg-[#bca37f] rounded-full transition-all"></div>
                        <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                    </label>
                </div>
            </div>
        </div>
    `;
}

/**
 * 設定更新関数
 */
function updateGender(value) {
    gender = value;
    renderSettings();
    console.log(`SETTINGS: Gender updated to ${value}`);
}

function updateFavorSimple(value) {
    favorSimple = value;
    console.log(`SETTINGS: Favor simple updated to ${value}`);
}

function updateFavorComplex(value) {
    favorComplex = value;
    console.log(`SETTINGS: Favor complex updated to ${value}`);
}

function updateRule(value) {
    rule = value;
    renderSettings();
    console.log(`SETTINGS: Rule updated to ${value}`);
}

function updatePrioritizeFortune(value) {
    prioritizeFortune = value;
    console.log(`SETTINGS: Prioritize fortune updated to ${value}`);
}

/**
 * 設定画面を閉じる
 */
function closeSettings() {
    const modal = document.getElementById('modal-settings');
    if (modal) modal.classList.remove('active');
}

console.log("SETTINGS: Module loaded");
