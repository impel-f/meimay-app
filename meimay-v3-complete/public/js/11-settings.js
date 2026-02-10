/* ============================================================
   MODULE 11: SETTINGS (V17.0 - シンプル版)
   ============================================================ */

function openSettings() {
    const modal = document.getElementById('modal-settings');
    if (!modal) return;
    
    renderSettings();
    modal.classList.add('active');
}

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
            icon: '⭐',
            iconBg: '#fef3c7',
            iconColor: '#f59e0b',
            title: '姓名判断',
            value: prioritizeFortune ? '重視する' : '重視しない',
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

function editSurname() {
    closeSettings();
    changeScreen('scr-surname-settings');
}

function editGender() {
    const options = [
        { value: 'male', label: '男の子' },
        { value: 'female', label: '女の子' },
        { value: 'unspecified', label: '指定なし' }
    ];
    
    showSimpleSelector('性別を選択', options, (value) => {
        gender = value;
        renderSettings();
    });
}

function editReading() {
    closeSettings();
    changeScreen('scr-input-reading');
}

function editReadingStyle() {
    const options = [
        { value: 'strict', label: '正統派', desc: '完全一致のみ' },
        { value: 'flexible', label: '柔軟', desc: '部分一致も含む' }
    ];
    
    showSimpleSelector('読み方スタイル', options, (value) => {
        rule = value;
        renderSettings();
    });
}

function editFortunePriority() {
    const options = [
        { value: true, label: '重視する', desc: '運勢の良い順に表示' },
        { value: false, label: '重視しない', desc: '画数を考慮しない' }
    ];
    
    showSimpleSelector('姓名判断', options, (value) => {
        prioritizeFortune = value;
        renderSettings();
    });
}

function showSimpleSelector(title, options, callback) {
    const modal = document.createElement('div');
    modal.className = 'overlay active';
    modal.id = 'simple-selector';
    
    modal.innerHTML = `
        <div class="detail-sheet" onclick="event.stopPropagation()">
            <h3 class="text-lg font-black text-[#5d5444] mb-4">${title}</h3>
            <div class="space-y-3">
                ${options.map(opt => `
                    <button onclick="selectOption('${typeof opt.value === 'boolean' ? opt.value : opt.value}')" class="w-full py-4 rounded-xl border-2 border-[#eee5d8] hover:border-[#bca37f] text-left px-4">
                        <div class="font-bold text-sm text-[#5d5444]">${opt.label}</div>
                        ${opt.desc ? `<div class="text-xs text-[#a6967a] mt-1">${opt.desc}</div>` : ''}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentSelectorCallback = callback;
}

function selectOption(value) {
    const parsedValue = value === 'true' ? true : value === 'false' ? false : value;
    
    if (window.currentSelectorCallback) {
        window.currentSelectorCallback(parsedValue);
    }
    
    const modal = document.getElementById('simple-selector');
    if (modal) modal.remove();
    
    openSettings();
}

function closeSettings() {
    const modal = document.getElementById('modal-settings');
    if (modal) modal.classList.remove('active');
}

console.log("SETTINGS: Module loaded (Simple)");
