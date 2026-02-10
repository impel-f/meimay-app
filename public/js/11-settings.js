/* ============================================================
   MODULE 11: SETTINGS (V2.0)
   設定画面（スクリーンショットに合わせた design）
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
    
    const settings = [
        {
            icon: '👤',
            iconBg: '#fef2f2',
            iconColor: '#f87171',
            title: '苗字',
            value: surnameStr || '未設定',
            action: 'editSurname()'
        },
        {
            icon: '💚',
            iconBg: '#f0fdf4',
            iconColor: '#4ade80',
            title: '性別',
            value: gender === 'male' ? '男の子' : gender === 'female' ? '女の子' : '指定なし',
            action: 'editGender()'
        },
        {
            icon: '💗',
            iconBg: '#fdf2f8',
            iconColor: '#f472b6',
            title: 'ニックネーム',
            value: '未設定',
            action: 'editNickname()'
        },
        {
            icon: 'Ｔ',
            iconBg: '#eff6ff',
            iconColor: '#60a5fa',
            title: '希望する読み方',
            value: segments.join('') || '未設定',
            action: 'editReading()'
        },
        {
            icon: '✂️',
            iconBg: '#f5f3ff',
            iconColor: '#a78bfa',
            title: '読み方スタイル',
            value: rule === 'strict' ? '正統派' : '柔軟',
            action: 'editReadingStyle()'
        },
        {
            icon: '✏️',
            iconBg: '#fef9c3',
            iconColor: '#facc15',
            title: '使いたい漢字',
            value: '未設定',
            action: 'editPreferredKanji()'
        },
        {
            icon: '⭐',
            iconBg: '#fef3c7',
            iconColor: '#f59e0b',
            title: '姓名判断',
            value: prioritizeFortune ? '重視する' : '気にしない',
            action: 'editFortunePriority()'
        }
    ];
    
    container.innerHTML = `
        <div class="space-y-3">
            ${settings.map(item => `
                <div onclick="${item.action}" class="bg-white rounded-2xl p-4 border border-[#eee5d8] flex items-center justify-between cursor-pointer hover:shadow-md transition-all active:scale-98">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl" style="background: ${item.iconBg}; color: ${item.iconColor};">
                            ${item.icon}
                        </div>
                        <div>
                            <div class="text-sm font-bold text-[#5d5444]">${item.title}</div>
                            <div class="text-xs text-[#a6967a] mt-1">${item.value}</div>
                        </div>
                    </div>
                    <div class="text-[#bca37f] text-2xl">›</div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * 苗字編集
 */
function editSurname() {
    const newValue = prompt('苗字を入力してください', surnameStr || '');
    if (newValue !== null) {
        surnameStr = newValue.trim();
        
        // 苗字データを更新
        if (typeof updateSurnameData === 'function') {
            const input = document.getElementById('in-surname');
            if (input) {
                input.value = surnameStr;
                updateSurnameData();
            }
        }
        
        renderSettings();
        console.log(`SETTINGS: Surname updated to ${surnameStr}`);
    }
}

/**
 * 性別編集
 */
function editGender() {
    closeSettings();
    
    // 簡易的なモーダル表示
    const genderOptions = `
        <div class="overlay active" id="gender-selector" onclick="this.classList.remove('active')">
            <div class="detail-sheet" onclick="event.stopPropagation()">
                <h3 class="text-lg font-black text-[#5d5444] mb-4">性別を選択</h3>
                <div class="space-y-3">
                    <button onclick="selectGender('male')" class="w-full py-4 rounded-xl border-2 ${gender === 'male' ? 'bg-[#4ade80] text-white border-[#4ade80]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'} text-sm font-bold">
                        男の子
                    </button>
                    <button onclick="selectGender('female')" class="w-full py-4 rounded-xl border-2 ${gender === 'female' ? 'bg-[#f472b6] text-white border-[#f472b6]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'} text-sm font-bold">
                        女の子
                    </button>
                    <button onclick="selectGender('unspecified')" class="w-full py-4 rounded-xl border-2 ${gender === 'unspecified' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'} text-sm font-bold">
                        指定なし
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = genderOptions;
    document.body.appendChild(tempDiv);
}

function selectGender(value) {
    gender = value;
    document.getElementById('gender-selector')?.remove();
    openSettings();
    console.log(`SETTINGS: Gender updated to ${value}`);
}

/**
 * ニックネーム編集
 */
function editNickname() {
    alert('ニックネーム機能は今後実装予定です');
}

/**
 * 読み方編集
 */
function editReading() {
    const newValue = prompt('希望する読み方を入力してください（ひらがな）\n例: けんた、ななみ', segments.join('') || '');
    if (newValue !== null) {
        const trimmed = newValue.trim();
        if (trimmed) {
            // 入力画面に移動して設定
            changeScreen('scr-input-reading');
            const input = document.getElementById('in-reading');
            if (input) {
                input.value = trimmed;
            }
        }
        closeSettings();
    }
}

/**
 * 読み方スタイル編集
 */
function editReadingStyle() {
    closeSettings();
    
    const styleOptions = `
        <div class="overlay active" id="style-selector" onclick="this.classList.remove('active')">
            <div class="detail-sheet" onclick="event.stopPropagation()">
                <h3 class="text-lg font-black text-[#5d5444] mb-4">読み方スタイル</h3>
                <div class="space-y-3">
                    <button onclick="selectStyle('strict')" class="w-full py-4 rounded-xl border-2 ${rule === 'strict' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'} text-sm font-bold">
                        正統派
                        <div class="text-xs opacity-70 mt-1">完全一致のみ</div>
                    </button>
                    <button onclick="selectStyle('flexible')" class="w-full py-4 rounded-xl border-2 ${rule === 'flexible' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'} text-sm font-bold">
                        柔軟
                        <div class="text-xs opacity-70 mt-1">部分一致も含む</div>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = styleOptions;
    document.body.appendChild(tempDiv);
}

function selectStyle(value) {
    rule = value;
    document.getElementById('style-selector')?.remove();
    openSettings();
    console.log(`SETTINGS: Reading style updated to ${value}`);
}

/**
 * 使いたい漢字編集
 */
function editPreferredKanji() {
    alert('使いたい漢字機能は今後実装予定です');
}

/**
 * 姓名判断優先度編集
 */
function editFortunePriority() {
    closeSettings();
    
    const fortuneOptions = `
        <div class="overlay active" id="fortune-selector" onclick="this.classList.remove('active')">
            <div class="detail-sheet" onclick="event.stopPropagation()">
                <h3 class="text-lg font-black text-[#5d5444] mb-4">姓名判断</h3>
                <div class="space-y-3">
                    <button onclick="selectFortune(true)" class="w-full py-4 rounded-xl border-2 ${prioritizeFortune ? 'bg-[#f59e0b] text-white border-[#f59e0b]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'} text-sm font-bold">
                        重視する
                        <div class="text-xs opacity-70 mt-1">運勢の良い順に表示</div>
                    </button>
                    <button onclick="selectFortune(false)" class="w-full py-4 rounded-xl border-2 ${!prioritizeFortune ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8]'} text-sm font-bold">
                        気にしない
                        <div class="text-xs opacity-70 mt-1">画数を考慮しない</div>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = fortuneOptions;
    document.body.appendChild(tempDiv);
}

function selectFortune(value) {
    prioritizeFortune = value;
    document.getElementById('fortune-selector')?.remove();
    openSettings();
    console.log(`SETTINGS: Fortune priority updated to ${value}`);
}

/**
 * 設定画面を閉じる
 */
function closeSettings() {
    const modal = document.getElementById('modal-settings');
    if (modal) modal.classList.remove('active');
}

console.log("SETTINGS: Module loaded (Screenshot design)");
