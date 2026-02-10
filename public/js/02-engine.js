/* ============================================================
   MODULE 02: ENGINE (V17.0 - 読みパターン提案版)
   ============================================================ */

// 読みパターン提案機能
function suggestReadingPatterns(reading) {
    const patterns = [];
    const len = reading.length;
    
    // 元のパターン
    patterns.push({
        label: '通常',
        segments: [reading],
        description: `${reading}（1文字）`
    });
    
    // 2文字パターン
    if (len >= 2) {
        for (let i = 1; i < len; i++) {
            const seg1 = reading.substring(0, i);
            const seg2 = reading.substring(i);
            patterns.push({
                label: '2文字',
                segments: [seg1, seg2],
                description: `${seg1}/${seg2}`
            });
        }
    }
    
    // 3文字パターン
    if (len >= 3) {
        for (let i = 1; i < len - 1; i++) {
            for (let j = i + 1; j < len; j++) {
                const seg1 = reading.substring(0, i);
                const seg2 = reading.substring(i, j);
                const seg3 = reading.substring(j);
                patterns.push({
                    label: '3文字',
                    segments: [seg1, seg2, seg3],
                    description: `${seg1}/${seg2}/${seg3}`
                });
            }
        }
    }
    
    return patterns;
}

// 読みパターン選択画面を表示
function showReadingPatternSelector(reading) {
    const patterns = suggestReadingPatterns(reading);
    
    const modal = document.createElement('div');
    modal.className = 'overlay active';
    modal.id = 'pattern-selector';
    
    modal.innerHTML = `
        <div class="detail-sheet max-w-md" onclick="event.stopPropagation()">
            <button class="modal-close-btn" onclick="closePatternSelector()">✕</button>
            <h3 class="text-lg font-black text-[#5d5444] mb-4 text-center">読み方のパターンを選択</h3>
            <p class="text-xs text-[#a6967a] mb-6 text-center">「${reading}」をどう分けますか？</p>
            <div class="space-y-3 max-h-[60vh] overflow-y-auto">
                ${patterns.map((p, i) => `
                    <button onclick="selectPattern(${i})" class="w-full text-left p-4 rounded-2xl border-2 border-[#eee5d8] hover:border-[#bca37f] hover:shadow-md transition-all">
                        <div class="font-bold text-sm text-[#5d5444] mb-1">${p.description}</div>
                        <div class="text-xs text-[#a6967a]">${p.label}分け（${p.segments.length}文字）</div>
                    </button>
                `).join('')}
            </div>
            <button onclick="showCustomPattern()" class="w-full mt-4 py-3 bg-[#fdfaf5] rounded-2xl border-2 border-[#eee5d8] text-sm font-bold text-[#7a6f5a]">
                カスタマイズ →
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentReadingPatterns = patterns;
}

function selectPattern(index) {
    const pattern = window.currentReadingPatterns[index];
    segments = pattern.segments;
    
    closePatternSelector();
    
    if (typeof startSwiping === 'function') {
        startSwiping();
    }
}

function closePatternSelector() {
    const modal = document.getElementById('pattern-selector');
    if (modal) modal.remove();
}

function showCustomPattern() {
    const customInput = prompt('読み方を「/」で区切って入力してください\n例：れ/い/な');
    if (customInput) {
        segments = customInput.split('/').map(s => s.trim()).filter(s => s);
        closePatternSelector();
        
        if (typeof startSwiping === 'function') {
            startSwiping();
        }
    }
}

// 残りは既存のloadStack等の関数（省略）

function loadStack() {
    if (!segments || segments.length === 0) {
        console.error("ENGINE: Segments not defined");
        return;
    }
    
    const target = toHira(segments[currentPos]);
    console.log(`ENGINE: Loading stack for position ${currentPos + 1}: "${target}"`);
    
    const indicator = document.getElementById('pos-indicator');
    if (indicator) {
        const totalSlots = segments.length;
        const slotLabel = totalSlots === 2 ? 
            (currentPos === 0 ? '1文字目' : '2文字目') :
            (currentPos === 0 ? '1文字目' : currentPos === totalSlots - 1 ? `${totalSlots}文字目` : `${currentPos + 1}文字目`);
        
        indicator.innerText = `${slotLabel}：${target}`;
    }
    
    stack = master.filter(k => {
        const isSameReading = currentPos > 0 && segments[currentPos] === segments[currentPos - 1];
        
        if (!isSameReading && seen && seen.has(k['漢字'])) {
            return false;
        }
        
        const readings = (k['音'] + ',' + k['訓'] + ',' + k['伝統名のり'])
            .split(/[、,，\s/]+/)
            .map(x => toHira(x))
            .filter(x => x);
        
        k.priority = readings.includes(target) ? 1 : 
                     (readings.some(r => r.startsWith(target)) ? 2 : 0);
        
        return rule === 'strict' ? k.priority === 1 : k.priority > 0;
    });
    
    if (currentPos > 0 && segments[currentPos] === segments[currentPos - 1]) {
        const prevChoices = liked.filter(item => item.slot === currentPos - 1);
        
        if (prevChoices.length > 0) {
            const noma = {
                '漢字': '々',
                '画数': prevChoices[0]['画数'] || 3,
                '音': target,
                '訓': target,
                '伝統名のり': target,
                '意味': '同じ字を繰り返す記号。前の文字と同じ意味を持ちます。',
                'おすすめ度': 5,
                '名前のイメージ': '繰り返し',
                '分類': '記号',
                priority: 1
            };
            
            stack.unshift(noma);
        }
    }

    stack.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        
        const scoreA = calculateKanjiScore(a);
        const scoreB = calculateKanjiScore(b);
        if (scoreB !== scoreA) return scoreB - scoreA;
        
        return a['画数'] - b['画数'];
    });

    console.log(`ENGINE: Stack built with ${stack.length} candidates`);
    
    if (stack.length === 0) {
        console.warn("ENGINE: No candidates found");
        alert(`「${target}」に対応する漢字が見つかりませんでした。\n柔軟モードをお試しください。`);
        return;
    }
    
    currentIdx = 0;
    if (typeof render === 'function') {
        render();
    }
}

function calculateKanjiScore(k) {
    let score = 0;
    const rec = parseInt(k['おすすめ度']) || 0;
    score += rec * 10;
    
    if (favorSimple && k['画数'] <= 10) score += 5;
    if (favorComplex && k['画数'] >= 15) score += 5;
    
    return score;
}

console.log("ENGINE: Module loaded (Pattern Suggestion)");
