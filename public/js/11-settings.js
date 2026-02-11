/* ============================================================
   MODULE 11: SETTINGS (V5.0 - 統一テイスト)
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
let selectedImageTags = ['none'];

/**
 * 設定画面を開く
 */
function openSettings() {
    const modal = document.getElementById('modal-settings');
    if (!modal) {
        console.error("SETTINGS: Modal not found");
        return;
    }
    
    renderSettingsUnified();
    modal.classList.add('active');
}

/**
 * 統一テイスト設定画面のレンダリング
 */
function renderSettingsUnified() {
    const container = document.getElementById('settings-content');
    if (!container) return;
    
    const genderText = gender === 'male' ? '男の子' : 
                       gender === 'female' ? '女の子' : '指定なし';
    
    const tagCount = selectedImageTags.includes('none') ? 
                     'こだわらない' : 
                     `${selectedImageTags.length}個選択`;
    
    const strictText = rule === 'strict' ? '厳格' : '柔軟';
    const fortuneText = prioritizeFortune ? '重視する' : '参考程度';
    
    container.innerHTML = `
        <div class="settings-unified">
            <div class="settings-item-unified" onclick="openSurnameInput()">
                <div class="item-icon-circle" style="background: #fef2f2;">
                    <span style="color: #f87171;">👤</span>
                </div>
                <div class="item-content-unified">
                    <div class="item-title-unified">苗字</div>
                    <div class="item-value-unified">${surnameStr || '未設定'}</div>
                </div>
                <div class="item-arrow-unified">›</div>
            </div>
            
            <div class="settings-item-unified" onclick="openGenderInput()">
                <div class="item-icon-circle" style="background: #f0fdf4;">
                    <span style="color: #4ade80;">👶</span>
                </div>
                <div class="item-content-unified">
                    <div class="item-title-unified">性別</div>
                    <div class="item-value-unified">${genderText}</div>
                </div>
                <div class="item-arrow-unified">›</div>
            </div>
            
            <div class="settings-item-unified" onclick="editImageTags()">
                <div class="item-icon-circle" style="background: #fef9c3;">
                    <span style="color: #facc15;">🎨</span>
                </div>
                <div class="item-content-unified">
                    <div class="item-title-unified">イメージ</div>
                    <div class="item-value-unified">${tagCount}</div>
                </div>
                <div class="item-arrow-unified">›</div>
            </div>
            
            <div class="settings-item-unified" onclick="openReadingInput()">
                <div class="item-icon-circle" style="background: #eff6ff;">
                    <span style="color: #60a5fa;">あ</span>
                </div>
                <div class="item-content-unified">
                    <div class="item-title-unified">読み方</div>
                    <div class="item-value-unified">${segments.join('') || '未設定'}</div>
                </div>
                <div class="item-arrow-unified">›</div>
            </div>
            
            <div class="settings-item-unified" onclick="openReadingStyleInput()">
                <div class="item-icon-circle" style="background: #f5f3ff;">
                    <span style="color: #a78bfa;">🔍</span>
                </div>
                <div class="item-content-unified">
                    <div class="item-title-unified">読みの厳密さ</div>
                    <div class="item-value-unified">${strictText}</div>
                </div>
                <div class="item-arrow-unified">›</div>
            </div>
            
            <div class="settings-item-unified" onclick="editFortunePriority()">
                <div class="item-icon-circle" style="background: #fef3c7;">
                    <span style="color: #f59e0b;">⭐</span>
                </div>
                <div class="item-content-unified">
                    <div class="item-title-unified">姓名判断</div>
                    <div class="item-value-unified">${fortuneText}</div>
                </div>
                <div class="item-arrow-unified">›</div>
            </div>
            
            <div class="settings-divider-unified"></div>
            
            <div class="settings-item-unified" onclick="showGuide()">
                <div class="item-icon-circle" style="background: #f0f9ff;">
                    <span style="color: #0ea5e9;">📖</span>
                </div>
                <div class="item-content-unified">
                    <div class="item-title-unified">使い方ガイド</div>
                </div>
                <div class="item-arrow-unified">›</div>
            </div>
            
            <div class="settings-close-area">
                <button onclick="closeSettings()" class="btn-close-settings">
                    閉じる
                </button>
            </div>
        </div>
    `;
}

/**
 * 苗字入力画面
 */
function openSurnameInput() {
    closeSettings();
    showInputModal('苗字を入力', 'text', surnameStr, '', (value) => {
        if (value) {
            surnameStr = value;
            if (typeof updateSurnameData === 'function') {
                const input = document.getElementById('in-surname');
                if (input) {
                    input.value = surnameStr;
                    updateSurnameData();
                }
            }
            saveSettings();
        }
    });
}

/**
 * 性別入力画面
 */
function openGenderInput() {
    closeSettings();
    showChoiceModal('性別を選択', '選んだ性別に合う漢字が優先表示されます', [
        { label: '男の子', value: 'male' },
        { label: '女の子', value: 'female' },
        { label: '指定なし', value: 'neutral' }
    ], gender, (value) => {
        gender = value;
        saveSettings();
    });
}

/**
 * 読み方入力画面（設定内で完結）
 */
function openReadingInput() {
    closeSettings();
    showInputModal('読み方を入力', 'text', segments.join(''), 'ひらがなで入力（例：はると）', (value) => {
        if (value) {
            // ここで calcSegments を呼ばずに、シンプルに保存
            // 実際の分割は後でスワイプ開始時に行う
            const tempInput = document.getElementById('in-name');
            if (tempInput) {
                tempInput.value = value;
            }
            saveSettings();
        }
    });
}

/**
 * 読みの厳密さ入力画面
 */
function openReadingStyleInput() {
    closeSettings();
    showChoiceModal('読みの厳密さ', '', [
        { label: '厳格モード（読み一致）', value: 'strict', desc: '読みが完全一致する漢字のみ表示' },
        { label: '柔軟モード（ぶった切り）', value: 'flexible', desc: '読みの一部が一致すれば表示' }
    ], rule, (value) => {
        rule = value;
        saveSettings();
    });
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
        <div class="overlay active modal-overlay-dark" id="tag-selector" onclick="if(event.target.id==='tag-selector')cancelTagSelection()">
            <div class="modal-sheet" onclick="event.stopPropagation()">
                <button class="modal-close-x" onclick="cancelTagSelection()">✕</button>
                <h3 class="modal-title">名前のイメージ</h3>
                <p class="modal-desc">複数選択できます<br>選んだイメージの漢字が優先表示されます</p>
                <div class="tag-grid">${tagsHTML}</div>
                <div class="modal-footer">
                    <button onclick="saveImageTags()" class="btn-modal-primary">完了</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', tagSelector);
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
        if (noneIndex > -1) selectedImageTags.splice(noneIndex, 1);
        if (selectedImageTags.length === 0) selectedImageTags = ['none'];
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
 * 姓名判断優先度編集
 */
function editFortunePriority() {
    closeSettings();
    showChoiceModal('姓名判断', '', [
        { label: '重視する', value: true, desc: '良い運勢の組み合わせを優先表示' },
        { label: '参考程度', value: false, desc: '運勢も表示するが、並び順に影響しない' }
    ], prioritizeFortune, (value) => {
        prioritizeFortune = value;
        saveSettings();
    });
}

/**
 * 汎用入力モーダル
 */
function showInputModal(title, type, currentValue, placeholder, onSave) {
    const modal = `
        <div class="overlay active modal-overlay-dark" id="input-modal">
            <div class="modal-sheet" onclick="event.stopPropagation()">
                <button class="modal-close-x" onclick="closeInputModal()">✕</button>
                <h3 class="modal-title">${title}</h3>
                <div class="modal-body">
                    <input type="${type}" 
                           id="modal-input" 
                           class="modal-input-large" 
                           value="${currentValue || ''}"
                           placeholder="${placeholder}"
                           maxlength="10">
                    <div class="modal-input-underline"></div>
                </div>
                <div class="modal-footer">
                    <button onclick="saveInputModal()" class="btn-modal-primary">保存</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    document.getElementById('modal-input')?.focus();
    
    window.inputModalCallback = onSave;
}

function saveInputModal() {
    const input = document.getElementById('modal-input');
    if (input && window.inputModalCallback) {
        window.inputModalCallback(input.value.trim());
    }
    closeInputModal();
    openSettings();
}

function closeInputModal() {
    document.getElementById('input-modal')?.remove();
}

/**
 * 汎用選択モーダル
 */
function showChoiceModal(title, description, options, currentValue, onSave) {
    const optionsHTML = options.map(opt => {
        const isSelected = opt.value === currentValue;
        return `
            <button onclick="selectChoiceOption(${JSON.stringify(opt.value).replace(/"/g, '&quot;')})" 
                    class="choice-option ${isSelected ? 'selected' : ''}">
                <div class="choice-radio ${isSelected ? 'checked' : ''}"></div>
                <div class="choice-content">
                    <div class="choice-label">${opt.label}</div>
                    ${opt.desc ? `<div class="choice-desc">${opt.desc}</div>` : ''}
                </div>
            </button>
        `;
    }).join('');
    
    const modal = `
        <div class="overlay active modal-overlay-dark" id="choice-modal">
            <div class="modal-sheet" onclick="event.stopPropagation()">
                <button class="modal-close-x" onclick="closeChoiceModal()">✕</button>
                <h3 class="modal-title">${title}</h3>
                ${description ? `<p class="modal-desc">${description}</p>` : ''}
                <div class="modal-body">
                    ${optionsHTML}
                </div>
                <div class="modal-footer">
                    <button onclick="saveChoiceModal()" class="btn-modal-primary">完了</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    
    window.choiceModalValue = currentValue;
    window.choiceModalCallback = onSave;
}

function selectChoiceOption(value) {
    window.choiceModalValue = value;
    // UI更新
    document.querySelectorAll('.choice-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.choice-radio').forEach(radio => radio.classList.remove('checked'));
    event.target.closest('.choice-option').classList.add('selected');
    event.target.closest('.choice-option').querySelector('.choice-radio').classList.add('checked');
}

function saveChoiceModal() {
    if (window.choiceModalCallback) {
        window.choiceModalCallback(window.choiceModalValue);
    }
    closeChoiceModal();
    openSettings();
}

function closeChoiceModal() {
    document.getElementById('choice-modal')?.remove();
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
    console.log('SETTINGS: Saved', settings);
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
            console.log('SETTINGS: Loaded', settings);
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

loadSettings();

console.log("SETTINGS: Module loaded (v5.0 - Unified Design)");
