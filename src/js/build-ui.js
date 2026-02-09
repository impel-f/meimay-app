// build-ui.js - 統合版からの抜粋
function openBuild() {
    if (!segments || segments.length === 0) {
        alert("名前の読みが設定されていません");
        return;
    }
    
    const selectionArea = document.getElementById('build-selection');
    if (!selectionArea) return;
    selectionArea.innerHTML = '';
    
    segments.forEach((reading, slotIdx) => {
        let slotItems = liked.filter(item => toHira(item.reading) === toHira(reading));
        
        const seen = new Set();
        slotItems = slotItems.filter(el => {
            const duplicate = seen.has(el['漢字']);
            seen.add(el['漢字']);
            return !duplicate;
        });
        
        if (slotIdx > 0 && reading === segments[slotIdx - 1]) {
            slotItems.push({ '漢字': '々', '画数': '々', 'reading': reading, 'isSuper': false });
        }
        
        slotItems.sort((a, b) => (b.isSuper ? 1 : 0) - (a.isSuper ? 1 : 0));
        
        const wrapper = document.createElement('div');
        wrapper.className = "mb-6 animate-fade-in";
        wrapper.innerHTML = `
            <div class="flex justify-between items-center px-4 mb-2">
                <div class="reading-part-box" style="padding: 4px 16px;">
                    <span class="reading-label-mini">Part ${slotIdx + 1}</span>
                    <span class="reading-text-main">${reading}</span>
                </div>
            </div>
            <div class="flex flex-nowrap gap-4 overflow-x-auto pb-4 px-4 no-scrollbar" id="build-slot-${slotIdx}"></div>
        `;
        selectionArea.appendChild(wrapper);
        
        const scrollBox = document.getElementById(`build-slot-${slotIdx}`);
        slotItems.forEach((data, i) => {
            const btn = document.createElement('div');
            btn.className = `build-piece-btn ${i === 0 ? 'selected' : ''}`;
            const strokeDisp = (data['画数'] === '々') ? "同" : data['画数'];
            btn.innerHTML = `
                <div class="build-kanji-text">${data['漢字']}</div>
                <div class="text-[10px] font-black mt-1">${strokeDisp}画</div>
            `;
            btn.dataset.kanji = data['漢字'];
            btn.dataset.strokes = data['画数'];
            btn.onclick = () => {
                Array.from(scrollBox.children).forEach(c => c.classList.remove('selected'));
                btn.classList.add('selected');
                updateBuildResult();
            };
            scrollBox.appendChild(btn);
        });
    });
    
    updateBuildResult();
    changeScreen('scr-build');
}

function updateBuildResult() {
    const area = document.getElementById('build-result-area');
    if (!area) return;
    area.innerHTML = '';
    
    const selectedCombination = [];
    for (let idx = 0; idx < segments.length; idx++) {
        const box = document.getElementById(`build-slot-${idx}`);
        if (!box) break;
        const selected = Array.from(box.children).find(c => c.classList.contains('selected'));
        if (!selected) {
            area.innerHTML = '<div class="text-center py-10 opacity-30">漢字を選択してください</div>';
            return;
        }
        const kanji = selected.dataset.kanji;
        const strokesRaw = selected.dataset.strokes;
        let strokeValue = 0;
        if (strokesRaw === '々') {
            if (selectedCombination.length > 0) {
                strokeValue = selectedCombination[selectedCombination.length - 1].strokes;
            }
        } else {
            strokeValue = parseInt(strokesRaw) || 0;
        }
        selectedCombination.push({ kanji, strokes: strokeValue });
    }
    
    const givenName = selectedCombination.map(e => e.kanji).join('');
    const fullName = surnameStr + givenName;
    const combinedReading = segments.join('');
    const fortuneRes = (typeof FortuneLogic !== 'undefined') ? FortuneLogic.calculate(surnameData, selectedCombination) : null;
    
    currentBuildResult = { fullName, reading: combinedReading, fortune: fortuneRes, combination: selectedCombination, givenName, timestamp: new Date() };
    
    const card = document.createElement('div');
    card.className = "flex flex-col gap-4 w-full animate-fade-in pb-12";
    card.innerHTML = `
        <div class="build-card-premium p-8 bg-white border border-[#eee5d8] rounded-[50px] shadow-2xl">
            <div class="flex flex-col items-center mb-8">
                <div class="flex items-baseline gap-3">
                    <span class="text-[26px] font-black text-[#d4c5af]">${surnameStr}</span>
                    <span class="text-[56px] font-black text-[#5d5444]">${givenName}</span>
                </div>
                <div class="text-[16px] font-bold text-[#bca37f] mt-4">${combinedReading}</div>
            </div>
            <div class="flex flex-col gap-3">
                <button onclick="handleShowFortuneReport()" class="w-full py-5 bg-[#fdfaf5] border-2 border-[#bca37f]/40 rounded-[28px]">⚖️ 姓名判断</button>
                <button onclick="handleShowNameOrigin()" class="w-full py-5 bg-white border-2 border-[#eee5d8] rounded-[28px]">📜 名前の由来</button>
                <button onclick="handleSaveName()" class="w-full py-5 bg-[#5d5444] text-white rounded-[28px]">💾 この候補を保存</button>
                <textarea id="build-name-message" class="premium-textarea h-24 text-[12px]" placeholder="想いをメモ..."></textarea>
            </div>
        </div>
    `;
    area.appendChild(card);
}

console.log("✅ BUILD-UI Module Loaded");
