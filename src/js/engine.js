/**
 * ============================================================
 * MODULE 2: ENGINE (V13.0)
 * 読み分割エンジン ＆ スタック構築
 * ============================================================
 */

function calcSegments() {
    console.log("ENGINE: calcSegments started");
    
    const inputEl = document.getElementById('in-name');
    if (!inputEl) {
        console.error("ENGINE: 'in-name' input missing");
        return;
    }
    
    const rawVal = inputEl.value.trim();
    const nameReading = toHira(rawVal);
    
    if (!nameReading) {
        alert("名前の読みをひらがなで入力してください。");
        return;
    }

    if (!master || master.length === 0) {
        alert("漢字データを読込中です。3〜5秒待ってから再度お試しください。");
        return;
    }

    const optionsContainer = document.getElementById('seg-options');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';
    
    let allPaths = [];

    function findPath(remaining, currentPath) {
        if (currentPath.length > 3) return;

        if (remaining.length === 0) {
            if (currentPath.length >= 1) allPaths.push([...currentPath]);
            return;
        }

        for (let i = 1; i <= Math.min(3, remaining.length); i++) {
            let part = remaining.slice(0, i);
            if (validReadingsSet && validReadingsSet.has(part)) {
                currentPath.push(part);
                findPath(remaining.slice(i), currentPath);
                currentPath.pop();
            }
        }
    }

    try {
        findPath(nameReading, []);
    } catch (e) {
        console.error("ENGINE: Recursive search failed.", e);
    }

    const scoredSplits = allPaths.map(path => {
        let score = 0;
        
        if (path.length === 2) score += 2000;
        if (path.length === 3) score += 1800;
        if (path.length === 1) score += 500;

        path.forEach(p => {
            if (p.length === 2) score += 500;
            if (p.length === 1) {
                if (["た","ま","と","の","か","ほ","ひ","み"].includes(p)) score += 200;
                else score += 50;
            }
        });

        let singleCombo = 0;
        let maxSingleCombo = 0;
        path.forEach(p => {
            if (p.length === 1) singleCombo++;
            else singleCombo = 0;
            maxSingleCombo = Math.max(maxSingleCombo, singleCombo);
        });
        if (maxSingleCombo >= 3) score -= 3000;

        return { path, score };
    });

    scoredSplits.sort((a, b) => b.score - a.score);

    const uniquePaths = [];
    const seenSet = new Set();
    scoredSplits.forEach(item => {
        let s = JSON.stringify(item.path);
        if (!seenSet.has(s) && item.score > -1000) {
            uniquePaths.push(item.path);
            seenSet.add(s);
        }
    });

    if (uniquePaths.length === 0) {
        alert("現在の辞書データでは、その読みを自然に分割できませんでした。");
        return;
    }

    uniquePaths.slice(0, 5).forEach((path) => {
        const btn = document.createElement('button');
        btn.className = "w-full py-6 bg-white text-[#5d5444] font-black rounded-[40px] border-2 border-[#fdfaf5] shadow-sm active:scale-95 transition-all text-xl mb-4 hover:border-[#bca37f] flex items-center justify-center group";
        
        btn.innerHTML = path.map(p => `<span class="px-1">${p}</span>`).join('<span class="text-[#bca37f] text-[10px] px-3 opacity-30 group-hover:opacity-100 transition-opacity">/</span>');
        
        btn.onclick = () => {
            console.log("ENGINE: Chosen segments ->", path);
            segments = path;
            changeScreen('scr-surname-settings');
        };
        optionsContainer.appendChild(btn);
    });

    changeScreen('scr-segment');
}

function loadStack() {
    if (!segments || segments.length === 0) return;
    
    const target = toHira(segments[currentPos]);
    console.log(`ENGINE: Initializing Stack for Slot ${currentPos+1} [${target}]`);
    
    const indicator = document.getElementById('pos-indicator');
    if (indicator) indicator.innerText = `${currentPos + 1}文字目：${target}`;
    
    stack = master.filter(k => {
        if (seen && seen.has(k['漢字'])) return false;
        
        const rds = (k['音'] + ',' + k['訓'] + ',' + k['伝統名のり'])
                    .split(/[、,，\s/]+/).map(x => toHira(x)).filter(x => x);
        
        k.priority = rds.includes(target) ? 1 : (rds.some(r => r.startsWith(target)) ? 2 : 0);
        
        return (rule === 'strict') ? k.priority === 1 : k.priority > 0;
    });

    stack.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        
        const scoreA = calculateKanjiScore(a);
        const scoreB = calculateKanjiScore(b);
        
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a['画数'] - b['画数'];
    });

    console.log(`ENGINE: Stack built with ${stack.length} items.`);
    currentIdx = 0;
    if (typeof render === 'function') render();
}

function calculateKanjiScore(k) {
    let s = (parseInt(k['おすすめ度']) || 0) * 50;
    const tags = ((k['名前のイメージ'] || "") + (k['分類'] || "")).trim();
    
    if (gender === 'male' && /男|剛|健|武|大|朗|太|一|介|助|郎/.test(tags)) s += 500;
    if (gender === 'female' && /女|花|美|優|愛|莉|奈|乃|菜|実/.test(tags)) s += 500;
    
    if (k['画数'] >= 6 && k['画数'] <= 15) s += 100;

    return s;
}

function startSwiping() {
    currentPos = 0;
    swipes = 0;
    currentIdx = 0;
    loadStack();
    changeScreen('scr-main');
}

console.log("MODULE_ENGINE: V13.0 Loaded");
