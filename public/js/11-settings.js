/* ============================================================
   MODULE 11: SETTINGS (V4.0 - カード型デザイン)
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
    
    renderSettingsCards();
    modal.classList.add('active');
}

/**
 * カード型設定画面のレンダリング
 */
function renderSettingsCards() {
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
        <div class="settings-cards">
            <!-- 基本設定 -->
            <div class="settings-card" onclick="openSurnameInput()">
                <div class="card-icon" style="background: #fef2f2; color: #f87171;">👤</div>
                <div class="card-content">
                    <div class="card-title">苗字</div>
                    <div class="card-value">${surnameStr || '未設定'}</div>
                </div>
                <div class="card-arrow">›</div>
            </div>
            
            <div class="settings-card" onclick="openGenderInput()">
                <div class="card-icon" style="background: #f0fdf4; color: #4ade80;">👶</div>
                <div class="card-content">
                    <div class="card-title">性別</div>
                    <div class="card-value">${genderText}</div>
                </div>
                <div class="card-arrow">›</div>
            </div>
            
            <div class="settings-card" onclick="editImageTags()">
                <div class="card-icon" style="background: #fef9c3; color: #facc15;">🎨</div>
                <div class="card-content">
                    <div class="card-title">イメージ</div>
                    <div class="card-value">${tagCount}</div>
                </div>
                <div class="card-arrow">›</div>
            </div>
            
            <div class="settings-card" onclick="editReading()">
                <div class="card-icon" style="background: #eff6ff; color: #60a5fa;">あ</div>
                <div class="card-content">
                    <div class="card-title">読み方</div>
                    <div class="card-value">${segments.join('') || '未設定'}</div>
                </div>
                <div class="card-arrow">›</div>
            </div>
            
            <div class="settings-card" onclick="openReadingStyleInput()">
                <div class="card-icon" style="background: #f5f3ff; color: #a78bfa;">🔍</div>
                <div class="card-content">
                    <div class="card-title">読みの厳密さ</div>
                    <div class="card-value">${strictText}</div>
                </div>
                <div class="card-arrow">›</div>
            </div>
            
            <div class="settings-card" onclick="editFortunePriority()">
                <div class="card-icon" style="background: #fef3c7; color: #f59e0b;">⭐</div>
                <div class="card-content">
                    <div class="card-title">姓名判断</div>
                    <div class="card-value">${fortuneText}</div>
                </div>
                <div class="card-arrow">›</div>
            </div>
            
            <!-- その他 -->
            <div class="settings-divider"></div>
            
            <div class="settings-card" onclick="showGuide()">
                <div class="card-icon" style="background: #f0f9ff; color: #0ea5e9;">📖</div>
                <div class="card-content">
                    <div class="card-title">使い方ガイド</div>
                </div>
                <div class="card-arrow">›</div>
            </div>
            
            <!-- 閉じるボタン -->
            <div class="settings-close-btn">
                <button onclick="closeSettings()" class="btn-gold w-full py-4">
                    閉じる
                </button>
            </div>
        </div>
    `;
}

/**
 * 苗字入力画面を開く
 */
function openSurnameInput() {
    closeSettings();
    
    const inputScreen = `
        <div class="overlay active" id="input-screen">
            <div class="input-screen-container">
                <div class="input-screen-header">
                    <button class="back-btn" onclick="cancelInput()">‹ 戻る</button>
                    <h2>苗字を入力</h2>
                    <div></div>
                </div>
                
                <div class="input-screen-content">
                    <div class="input-section">
                        <label class="input-label">苗字</label>
                        <input type="text" 
                               id="input-surname" 
                               class="large-input" 
                               placeholder="田中"
                               value="${surnameStr || ''}"
                               maxlength="4">
                        <div class="input-underline"></div>
                        <p class="input-hint">姓名判断で使用します</p>
                    </div>
                </div>
                
                <div class="input-screen-footer">
                    <button onclick="saveSurname()" class="btn-gold w-full py-5 text-lg">
                        保存
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', inputScreen);
    
    // 入力欄にフォーカス
    setTimeout(() => {
        document.getElementById('input-surname')?.focus();
    }, 100);
}

function saveSurname() {
    const input = document.getElementById('input-surname');
    if (!input) return;
    
    const newValue = input.value.trim();
    if (newValue) {
        surnameStr = newValue;
        
        // 苗字データを更新
        if (typeof updateSurnameData === 'function') {
            const surnameInput = document.getElementById('in-surname');
            if (surnameInput) {
                surnameInput.value = surnameStr;
                updateSurnameData();
            }
        }
        
        saveSettings();
        cancelInput();
        openSettings();
    }
}

function cancelInput() {
    document.getElementById('input-screen')?.remove();
}

/**
 * 性別入力画面を開く
 */
function openGenderInput() {
    closeSettings();
    
    const inputScreen = `
        <div class="overlay active" id="input-screen">
            <div class="input-screen-container">
                <div class="input-screen-header">
                    <button class="back-btn" onclick="cancelInput()">‹ 戻る</button>
                    <h2>性別を選択</h2>
                    <div></div>
                </div>
                
                <div class="input-screen-content">
                    <p class="input-description">選んだ性別に合う漢字が優先表示されます</p>
                    
                    <div class="pill-buttons">
                        <button class="pill-btn ${gender === 'male' ? 'active' : ''}" 
                                onclick="selectGenderInline('male')">
                            男の子
                        </button>
                        <button class="pill-btn ${gender === 'female' ? 'active' : ''}" 
                                onclick="selectGenderInline('female')">
                            女の子
                        </button>
                        <button class="pill-btn ${gender === 'neutral' ? 'active' : ''}" 
                                onclick="selectGenderInline('neutral')">
                            指定なし
                        </button>
                    </div>
                </div>
                
                <div class="input-screen-footer">
                    <button onclick="saveGender()" class="btn-gold w-full py-5 text-lg">
                        完了
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', inputScreen);
}

function selectGenderInline(value) {
    gender = value;
    
    // ボタンの選択状態を更新
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function saveGender() {
    saveSettings();
    cancelInput();
    openSettings();
}

/**
 * 読みの厳密さ入力画面を開く
 */
function openReadingStyleInput() {
    closeSettings();
    
    const inputScreen = `
        <div class="overlay active" id="input-screen">
            <div class="input-screen-container">
                <div class="input-screen-header">
                    <button class="back-btn" onclick="cancelInput()">‹ 戻る</button>
                    <h2>読みの厳密さ</h2>
                    <div></div>
                </div>
                
                <div class="input-screen-content">
                    <div class="radio-options">
                        <label class="radio-option ${rule === 'strict' ? 'active' : ''}">
                            <input type="radio" 
                                   name="reading-style" 
                                   value="strict" 
                                   ${rule === 'strict' ? 'checked' : ''}
                                   onchange="selectReadingStyle('strict')">
                            <div class="radio-content">
                                <div class="radio-title">厳格モード（読み一致）</div>
                                <div class="radio-desc">読みが完全一致する漢字のみ表示</div>
                            </div>
                        </label>
                        
                        <label class="radio-option ${rule === 'flexible' ? 'active' : ''}">
                            <input type="radio" 
                                   name="reading-style" 
                                   value="flexible" 
                                   ${rule === 'flexible' ? 'checked' : ''}
                                   onchange="selectReadingStyle('flexible')">
                            <div class="radio-content">
                                <div class="radio-title">柔軟モード（ぶった切り）</div>
                                <div class="radio-desc">読みの一部が一致すれば表示</div>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="input-screen-footer">
                    <button onclick="saveReadingStyle()" class="btn-gold w-full py-5 text-lg">
                        完了
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', inputScreen);
}

function selectReadingStyle(value) {
    rule = value;
    
    // ラジオオプションの選択状態を更新
    document.querySelectorAll('.radio-option').forEach(opt => {
        opt.classList.remove('active');
    });
    event.target.closest('.radio-option').classList.add('active');
}

function saveReadingStyle() {
    saveSettings();
    cancelInput();
    openSettings();
}

/**
 * イメージタグ編集
 */
function editImageTags() {
    closeSettings();
    
    const tagsHTML = IMAGE_TAGS.map(tag => {
        const isSelected = selectedImageTags.includes(tag.id);
        
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
        selectedImageTags = ['none'];
    } else {
        const index = selectedImageTags.indexOf(tagId);
        if (index > -1) {
            selectedImageTags.splice(index, 1);
        } else {
            selectedImageTags.push(tagId);
        }
        
        const noneIndex = selectedImageTags.indexOf('none');
        if (noneIndex > -1) {
            selectedImageTags.splice(noneIndex, 1);
        }
        
        if (selectedImageTags.length === 0) {
            selectedImageTags = ['none'];
        }
    }
    
    editImageTags();
}

function saveImageTags() {
    document.getElementById('tag-selector')?.remove();
    saveSettings();
    openSettings();
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

console.log("SETTINGS: Module loaded (v4.0 - Card Design)");
