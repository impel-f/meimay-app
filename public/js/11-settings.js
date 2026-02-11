/* ============================================================
   MODULE 11: SETTINGS (V3.0 - iOS風 + イメージタグ)
   設定画面
   ============================================================ */

// イメージタグの定義
const IMAGE_TAGS = [
    { id: 'none', label: 'こだわらない', icon: '✨', color: '#d4c5af' },
    { id: 'nature', label: '自然・植物', icon: '🌿', color: '#4ade80' },
    { id: 'brightness', label: '明るさ・太陽', icon: '☀️', color: '#fbbf24' },
    { id: 'water', label: '水・海', icon: '🌊', color: '#60a5fa' },
    { id: 'strength', label: '力強さ', icon: '💪', color: '#f87171' },
    { id: 'kindness', label: '優しさ・愛', icon: '💗', color: '#f472b6' },
    { id: 'intelligence', label: '知性・賢さ', icon: '📚', color: '#8b5cf6' },
    { id: 'honesty', label: '誠実・真面目', icon: '🎯', color: '#3b82f6' },
    { id: 'elegance', label: '品格・気品', icon: '👑', color: '#a78bfa' },
    { id: 'tradition', label: '伝統・古風', icon: '🎎', color: '#d97706' },
    { id: 'beauty', label: '美しさ', icon: '✨', color: '#ec4899' },
    { id: 'success', label: '成功・向上', icon: '🚀', color: '#10b981' },
    { id: 'peace', label: '安定・平和', icon: '☮️', color: '#6366f1' },
    { id: 'leadership', label: 'リーダー性', icon: '⭐', color: '#f59e0b' },
    { id: 'hope', label: '希望・未来', icon: '🌈', color: '#14b8a6' },
    { id: 'spirituality', label: '精神性', icon: '🕊️', color: '#8b7e66' }
];

// グローバル変数
let selectedImageTags = ['none']; // デフォルトは「こだわらない」

/**
 * 設定画面を開く
 */
function openSettings() {
    const modal = document.getElementById('modal-settings');
    if (!modal) {
        console.error("SETTINGS: Modal not found");
        return;
    }
    
    renderSettingsIOS();
    modal.classList.add('active');
}

/**
 * iOS風設定画面のレンダリング
 */
function renderSettingsIOS() {
    const container = document.getElementById('settings-content');
    if (!container) return;
    
    // 性別の表示テキスト
    const genderText = gender === 'male' ? '男の子' : 
                       gender === 'female' ? '女の子' : '指定なし';
    
    // イメージタグの表示テキスト
    const tagCount = selectedImageTags.includes('none') ? 
                     'こだわらない' : 
                     `${selectedImageTags.length}個選択`;
    
    // 読みの厳密さ
    const strictText = rule === 'strict' ? '厳格' : '柔軟';
    
    // 姓名判断
    const fortuneText = prioritizeFortune ? '重視する' : '参考程度';
    
    container.innerHTML = `
        <div class="ios-settings">
            <!-- あなたとお子さま -->
            <div class="settings-section">
                <div class="section-header">あなたとお子さま</div>
                <div class="settings-group">
                    <div class="settings-item" onclick="editSurname()">
                        <span>お名字</span>
                        <div class="settings-value">
                            <span class="value-text">${surnameStr || '未設定'}</span>
                            <span class="chevron">›</span>
                        </div>
                    </div>
                    <div class="settings-item" onclick="editGender()">
                        <span>性別</span>
                        <div class="settings-value">
                            <span class="value-text">${genderText}</span>
                            <span class="chevron">›</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 名前の希望 -->
            <div class="settings-section">
                <div class="section-header">名前の希望</div>
                <div class="settings-group">
                    <div class="settings-item" onclick="editImageTags()">
                        <span>イメージ</span>
                        <div class="settings-value">
                            <span class="value-text">${tagCount}</span>
                            <span class="chevron">›</span>
                        </div>
                    </div>
                    <div class="settings-item" onclick="editReading()">
                        <span>読み方</span>
                        <div class="settings-value">
                            <span class="value-text">${segments.join('') || '未設定'}</span>
                            <span class="chevron">›</span>
                        </div>
                    </div>
                    <div class="settings-item" onclick="editReadingStyle()">
                        <span>読みの厳密さ</span>
                        <div class="settings-value">
                            <span class="value-text">${strictText}</span>
                            <span class="chevron">›</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 姓名判断 -->
            <div class="settings-section">
                <div class="section-header">姓名判断</div>
                <div class="settings-group">
                    <div class="settings-item" onclick="editFortunePriority()">
                        <span>重視度</span>
                        <div class="settings-value">
                            <span class="value-text">${fortuneText}</span>
                            <span class="chevron">›</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- その他 -->
            <div class="settings-section">
                <div class="section-header">その他</div>
                <div class="settings-group">
                    <div class="settings-item" onclick="showGuide()">
                        <span>使い方ガイド</span>
                        <div class="settings-value">
                            <span class="chevron">›</span>
                        </div>
                    </div>
                    <div class="settings-item" onclick="resetData()">
                        <span class="text-red-500">データをリセット</span>
                        <div class="settings-value">
                            <span class="chevron">›</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 閉じるボタン -->
            <div class="settings-close">
                <button onclick="closeSettings()" class="btn-gold w-full py-4">
                    閉じる
                </button>
            </div>
        </div>
    `;
}

/**
 * 苗字編集
 */
function editSurname() {
    const newValue = prompt('お名字を入力してください', surnameStr || '');
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
        
        // 保存
        saveSettings();
        renderSettingsIOS();
        console.log(`SETTINGS: Surname updated to ${surnameStr}`);
    }
}

/**
 * 性別編集
 */
function editGender() {
    closeSettings();
    
    const genderOptions = `
        <div class="overlay active" id="gender-selector">
            <div class="detail-sheet max-w-md" onclick="event.stopPropagation()">
                <button class="modal-close-btn" onclick="cancelGenderSelection()">✕</button>
                <h3 class="text-xl font-black text-[#5d5444] mb-6 text-center">性別を選択</h3>
                <p class="text-sm text-[#a6967a] mb-6 text-center">
                    選んだ性別に合う漢字が優先表示されます
                </p>
                <div class="space-y-3">
                    <button onclick="selectGender('male')" 
                            class="w-full py-5 rounded-2xl border-2 font-bold text-base transition-all
                            ${gender === 'male' ? 'bg-[#4ade80] text-white border-[#4ade80]' : 'bg-white text-[#7a6f5a] border-[#eee5d8] hover:border-[#bca37f]'}">
                        👦 男の子
                    </button>
                    <button onclick="selectGender('female')" 
                            class="w-full py-5 rounded-2xl border-2 font-bold text-base transition-all
                            ${gender === 'female' ? 'bg-[#f472b6] text-white border-[#f472b6]' : 'bg-white text-[#7a6f5a] border-[#eee5d8] hover:border-[#bca37f]'}">
                        👧 女の子
                    </button>
                    <button onclick="selectGender('neutral')" 
                            class="w-full py-5 rounded-2xl border-2 font-bold text-base transition-all
                            ${gender === 'neutral' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8] hover:border-[#bca37f]'}">
                        ⭐ 指定なし
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', genderOptions);
    
    // 背景クリックで閉じる
    document.getElementById('gender-selector').addEventListener('click', (e) => {
        if (e.target.id === 'gender-selector') {
            cancelGenderSelection();
        }
    });
}

function selectGender(value) {
    gender = value;
    document.getElementById('gender-selector')?.remove();
    saveSettings();
    openSettings();
    console.log(`SETTINGS: Gender updated to ${value}`);
}

function cancelGenderSelection() {
    document.getElementById('gender-selector')?.remove();
    openSettings();
}

/**
 * イメージタグ編集
 */
function editImageTags() {
    closeSettings();
    
    const tagsHTML = IMAGE_TAGS.map(tag => {
        const isSelected = selectedImageTags.includes(tag.id);
        const isNone = tag.id === 'none';
        
        return `
            <button onclick="toggleImageTag('${tag.id}')" 
                    class="tag-button ${isSelected ? 'selected' : ''}"
                    style="border-color: ${tag.color}; ${isSelected ? `background: ${tag.color}; color: white;` : `color: ${tag.color};`}">
                <span class="tag-icon">${tag.icon}</span>
                <span class="tag-label">${tag.label}</span>
                ${isSelected ? '<span class="tag-check">✓</span>' : ''}
            </button>
        `;
    }).join('');
    
    const tagSelector = `
        <div class="overlay active" id="tag-selector">
            <div class="detail-sheet max-w-md max-h-[80vh] overflow-y-auto" onclick="event.stopPropagation()">
                <button class="modal-close-btn" onclick="cancelTagSelection()">✕</button>
                <h3 class="text-xl font-black text-[#5d5444] mb-4 text-center">名前のイメージ</h3>
                <p class="text-sm text-[#a6967a] mb-6 text-center">
                    複数選択できます<br>
                    選んだイメージの漢字が優先表示されます
                </p>
                <div class="tag-grid">
                    ${tagsHTML}
                </div>
                <div class="mt-6">
                    <button onclick="saveImageTags()" class="btn-gold w-full py-4">
                        完了
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', tagSelector);
    
    // 背景クリックで閉じる
    document.getElementById('tag-selector').addEventListener('click', (e) => {
        if (e.target.id === 'tag-selector') {
            cancelTagSelection();
        }
    });
}

function toggleImageTag(tagId) {
    if (tagId === 'none') {
        // 「こだわらない」を選択
        selectedImageTags = ['none'];
    } else {
        // 他のタグを選択
        const index = selectedImageTags.indexOf(tagId);
        if (index > -1) {
            // 既に選択済み → 解除
            selectedImageTags.splice(index, 1);
        } else {
            // 未選択 → 追加
            selectedImageTags.push(tagId);
        }
        
        // 「こだわらない」を自動解除
        const noneIndex = selectedImageTags.indexOf('none');
        if (noneIndex > -1) {
            selectedImageTags.splice(noneIndex, 1);
        }
        
        // 何も選択されていない場合は「こだわらない」に戻す
        if (selectedImageTags.length === 0) {
            selectedImageTags = ['none'];
        }
    }
    
    // UI更新
    editImageTags();
}

function saveImageTags() {
    document.getElementById('tag-selector')?.remove();
    saveSettings();
    openSettings();
    console.log(`SETTINGS: Image tags updated to`, selectedImageTags);
}

function cancelTagSelection() {
    document.getElementById('tag-selector')?.remove();
    openSettings();
}

/**
 * 読み方編集
 */
function editReading() {
    closeSettings();
    changeScreen('scr-input-reading');
}

/**
 * 読み方スタイル編集
 */
function editReadingStyle() {
    closeSettings();
    
    const styleOptions = `
        <div class="overlay active" id="style-selector">
            <div class="detail-sheet max-w-md" onclick="event.stopPropagation()">
                <button class="modal-close-btn" onclick="cancelStyleSelection()">✕</button>
                <h3 class="text-xl font-black text-[#5d5444] mb-6 text-center">読みの厳密さ</h3>
                <div class="space-y-3">
                    <button onclick="selectStyle('strict')" 
                            class="w-full py-5 rounded-2xl border-2 font-bold text-base transition-all text-left px-5
                            ${rule === 'strict' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8] hover:border-[#bca37f]'}">
                        <div class="font-black text-lg">厳格モード</div>
                        <div class="text-sm opacity-80 mt-1">読みが完全一致する漢字のみ表示</div>
                    </button>
                    <button onclick="selectStyle('flexible')" 
                            class="w-full py-5 rounded-2xl border-2 font-bold text-base transition-all text-left px-5
                            ${rule === 'flexible' ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8] hover:border-[#bca37f]'}">
                        <div class="font-black text-lg">柔軟モード</div>
                        <div class="text-sm opacity-80 mt-1">読みの一部が一致すれば表示（候補が増える）</div>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', styleOptions);
    
    document.getElementById('style-selector').addEventListener('click', (e) => {
        if (e.target.id === 'style-selector') {
            cancelStyleSelection();
        }
    });
}

function selectStyle(value) {
    rule = value;
    document.getElementById('style-selector')?.remove();
    saveSettings();
    openSettings();
    console.log(`SETTINGS: Reading style updated to ${value}`);
}

function cancelStyleSelection() {
    document.getElementById('style-selector')?.remove();
    openSettings();
}

/**
 * 姓名判断優先度編集
 */
function editFortunePriority() {
    closeSettings();
    
    const fortuneOptions = `
        <div class="overlay active" id="fortune-selector">
            <div class="detail-sheet max-w-md" onclick="event.stopPropagation()">
                <button class="modal-close-btn" onclick="cancelFortuneSelection()">✕</button>
                <h3 class="text-xl font-black text-[#5d5444] mb-6 text-center">姓名判断</h3>
                <div class="space-y-3">
                    <button onclick="selectFortune(true)" 
                            class="w-full py-5 rounded-2xl border-2 font-bold text-base transition-all text-left px-5
                            ${prioritizeFortune ? 'bg-[#f59e0b] text-white border-[#f59e0b]' : 'bg-white text-[#7a6f5a] border-[#eee5d8] hover:border-[#bca37f]'}">
                        <div class="font-black text-lg">重視する</div>
                        <div class="text-sm opacity-80 mt-1">良い運勢の組み合わせを優先表示</div>
                    </button>
                    <button onclick="selectFortune(false)" 
                            class="w-full py-5 rounded-2xl border-2 font-bold text-base transition-all text-left px-5
                            ${!prioritizeFortune ? 'bg-[#bca37f] text-white border-[#bca37f]' : 'bg-white text-[#7a6f5a] border-[#eee5d8] hover:border-[#bca37f]'}">
                        <div class="font-black text-lg">参考程度</div>
                        <div class="text-sm opacity-80 mt-1">運勢も表示するが、並び順に影響しない</div>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', fortuneOptions);
    
    document.getElementById('fortune-selector').addEventListener('click', (e) => {
        if (e.target.id === 'fortune-selector') {
            cancelFortuneSelection();
        }
    });
}

function selectFortune(value) {
    prioritizeFortune = value;
    document.getElementById('fortune-selector')?.remove();
    saveSettings();
    openSettings();
    console.log(`SETTINGS: Fortune priority updated to ${value}`);
}

function cancelFortuneSelection() {
    document.getElementById('fortune-selector')?.remove();
    openSettings();
}

/**
 * 使い方ガイド
 */
function showGuide() {
    alert('使い方ガイドは今後実装予定です');
}

/**
 * データリセット
 */
function resetData() {
    if (confirm('すべてのデータをリセットしますか？\nこの操作は取り消せません。')) {
        localStorage.clear();
        location.reload();
    }
}

/**
 * 設定を保存
 */
function saveSettings() {
    const settings = {
        surname: surnameStr,
        gender: gender,
        imageTags: selectedImageTags,
        rule: rule,
        prioritizeFortune: prioritizeFortune,
        segments: segments
    };
    
    localStorage.setItem('meimay_settings', JSON.stringify(settings));
    console.log('SETTINGS: Saved to localStorage', settings);
}

/**
 * 設定を読み込み
 */
function loadSettings() {
    const saved = localStorage.getItem('meimay_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            surnameStr = settings.surname || '';
            gender = settings.gender || 'neutral';
            selectedImageTags = settings.imageTags || ['none'];
            rule = settings.rule || 'flexible';
            prioritizeFortune = settings.prioritizeFortune !== undefined ? settings.prioritizeFortune : false;
            segments = settings.segments || [];
            
            console.log('SETTINGS: Loaded from localStorage', settings);
        } catch (e) {
            console.error('SETTINGS: Failed to load', e);
        }
    }
}

/**
 * 設定画面を閉じる
 */
function closeSettings() {
    const modal = document.getElementById('modal-settings');
    if (modal) modal.classList.remove('active');
}

// 初期化時に設定を読み込み
loadSettings();

console.log("SETTINGS: Module loaded (v3.0 - iOS style + Image tags)");
