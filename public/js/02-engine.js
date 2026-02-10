/* ============================================================
   MODULE 02: ENGINE (V13.0)
   読み分割エンジン・スタック生成・スコアリング
   ============================================================ */

/**
 * 読みの分割パターンを計算
 */
function calcSegments() {
    console.log("ENGINE: calcSegments() called");
    
    const inputEl = document.getElementById('in-name');
    if (!inputEl) {
        console.error("ENGINE: 'in-name' element not found");
        return;
    }
    
    const rawVal = inputEl.value.trim();
    const nameReading = toHira(rawVal);
    
    // 入力チェック
    if (!nameReading) {
        alert("名前の読みをひらがなで入力してください。\n例：なだい、ゆうた");
        return;
    }
    
    if (!/^[ぁ-ん]+$/.test(nameReading)) {
        alert("ひらがなのみで入力してください。");
        return;
    }
    
    // データ読み込みチェック
    if (!master || master.length === 0) {
        alert("漢字データを読み込み中です。\n3〜5秒待ってから再度お試しください。");
        return;
    }

    // オプションコンテナ取得
    const optionsContainer = document.getElementById('seg-options');
    if (!optionsContainer) {
        console.error("ENGINE: 'seg-options' element not found");
        return;
    }
    optionsContainer.innerHTML = '<div class="text-center text-[#bca37f] text-sm">分割パターンを計算中...</div>';
    
    // 分割パターンの探索
    let allPaths = [];

    function findPath(remaining, currentPath) {
        // 最大3文字まで
        if (currentPath.length > 3) return;
        
        // 完了
        if (remaining.length === 0) {
            if (currentPath.length >= 1) {
                allPaths.push([...currentPath]);
            }
            return;
        }

        // 1〜3文字ずつ試行
        for (let i = 1; i <= Math.min(3, remaining.length); i++) {
            let part = remaining.slice(0, i);
            
            // 辞書に存在する読みかチェック
            if (validReadingsSet && validReadingsSet.has(part)) {
                currentPath.push(part);
                findPath(remaining.slice(i), currentPath);
                currentPath.pop();
            }
        }
    }

    try {
        findPath(nameReading, []);
        console.log(`ENGINE: Found ${allPaths.length} raw patterns`);
    } catch (e) {
        console.error("ENGINE: Search failed", e);
        alert("分割計算中にエラーが発生しました。");
        return;
    }

    // スコアリング
    const scoredSplits = allPaths.map(path => {
        let score = 0;
        
        // 文字数ボーナス（2文字が最優先）
        if (path.length === 2) score += 2000;
        else if (path.length === 3) score += 1800;
        else if (path.length === 1) score += 500;

        // 各パーツのスコア
        path.forEach(p => {
            if (p.length === 2) score += 500; // 2音読みは自然
            if (p.length === 1) {
                // 1音で完結しやすい読み
                if (["た","ま","と","の","か","ほ","ひ","み","な","り","さ","こ","あ"].includes(p)) {
                    score += 200;
                } else {
                    score += 50;
                }
            }
        });

        // 1音連続ペナルティ
        let singleCombo = 0;
        let maxSingleCombo = 0;
        path.forEach(p => {
            if (p.length === 1) singleCombo++;
            else singleCombo = 0;
            maxSingleCombo = Math.max(maxSingleCombo, singleCombo);
        });
        if (maxSingleCombo >= 3) score -= 3000; // 3連続1音は不自然

        return { path, score };
    });

    // スコア順にソート
    scoredSplits.sort((a, b) => b.score - a.score);

    // 重複排除
    const uniquePaths = [];
    const seenSet = new Set();
    scoredSplits.forEach(item => {
        let key = JSON.stringify(item.path);
        if (!seenSet.has(key) && item.score > -1000) {
            uniquePaths.push(item.path);
            seenSet.add(key);
        }
    });

    console.log(`ENGINE: ${uniquePaths.length} unique patterns after dedup`);

    // 結果なし
    if (uniquePaths.length === 0) {
        optionsContainer.innerHTML = `
            <div class="text-center py-10">
                <p class="text-[#f28b82] font-bold mb-4">分割できませんでした</p>
                <p class="text-sm text-[#a6967a]">現在の辞書では「${nameReading}」を自然に分割できません。<br>柔軟モードをお試しください。</p>
            </div>
        `;
        return;
    }

    // UI生成（上位5件）
    optionsContainer.innerHTML = '';
    uniquePaths.slice(0, 5).forEach((path, idx) => {
        const btn = document.createElement('button');
        btn.className = "w-full py-6 bg-white text-[#5d5444] font-black rounded-[40px] border-2 border-[#fdfaf5] shadow-sm transition-all text-xl mb-4 hover:border-[#bca37f] hover:shadow-md active:scale-98 flex items-center justify-center group";
        
        const displayParts = path.map(p => 
            `<span class="px-2">${p}</span>`
        ).join('<span class="text-[#d4c5af] text-sm px-2 opacity-40 group-hover:opacity-100 transition-opacity">/</span>');
        
        btn.innerHTML = displayParts;
        btn.onclick = () => selectSegment(path);
        
        // 最初の選択肢を強調
        if (idx === 0) {
            btn.classList.add('border-[#bca37f]');
            btn.innerHTML += '<span class="ml-2 text-xs text-[#bca37f]">おすすめ</span>';
        }
        
        optionsContainer.appendChild(btn);
    });

    // 画面遷移
    changeScreen('scr-segment');
}

/**
 * 分割パターン選択
 */
function selectSegment(path) {
    console.log("ENGINE: Selected segments ->", path);
    segments = path;
    changeScreen('scr-surname-settings');
}

/**
 * スワイプ用スタックの生成
 */
function loadStack() {
    if (!segments || segments.length === 0) {
        console.error("ENGINE: Segments not defined");
        return;
    }
    
    const target = toHira(segments[currentPos]);
    console.log(`ENGINE: Loading stack for position ${currentPos + 1}: "${target}"`);
    
    // インジケーター更新
    const indicator = document.getElementById('pos-indicator');
    if (indicator) {
        indicator.innerText = `${currentPos + 1}文字目：${target}`;
    }
    
    // フィルタリング
    stack = master.filter(k => {
        // 既に選択済みは除外
        if (seen && seen.has(k['漢字'])) return false;
        
        // 読みデータの取得
        const readings = (k['音'] + ',' + k['訓'] + ',' + k['伝統名のり'])
            .split(/[、,，\s/]+/)
            .map(x => toHira(x))
            .filter(x => x);
        
        // マッチング判定
        k.priority = readings.includes(target) ? 1 : 
                     (readings.some(r => r.startsWith(target)) ? 2 : 0);
        
        // ルールに応じてフィルタ
        return rule === 'strict' ? k.priority === 1 : k.priority > 0;
    });
    
    // 々（同じ字点）の対応
    if (currentPos > 0 && segments[currentPos] === segments[currentPos - 1]) {
        const prevChoices = liked.filter(item => item.slot === currentPos - 1);
        
        if (prevChoices.length > 0) {
            // 「々」を追加
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
            console.log("ENGINE: Added 々 (noma) to stack");
        }
    }

    // ソート（優先度 → スコア → 画数）
    stack.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        
        const scoreA = calculateKanjiScore(a);
        const scoreB = calculateKanjiScore(b);
        if (scoreB !== scoreA) return scoreB - scoreA;
        
        return a['画数'] - b['画数'];
    });

    console.log(`ENGINE: Stack built with ${stack.length} candidates`);
    
    // 候補なし
    if (stack.length === 0) {
        console.warn("ENGINE: No candidates found");
        alert(`「${target}」に対応する漢字が見つかりませんでした。\n柔軟モードをお試しください。`);
        return;
    }
    
    // レンダリング
    currentIdx = 0;
    if (typeof render === 'function') {
        render();
    } else {
        console.error("ENGINE: render() function not found");
    }
}

/**
 * 漢字のスコアリング
 */
function calculateKanjiScore(k) {
    let score = (parseInt(k['おすすめ度']) || 0) * 50;
    
    const tags = ((k['名前のイメージ'] || "") + (k['分類'] || "")).trim();
    
    // 性別適性ボーナス
    if (gender === 'male' && /男|剛|健|武|大|朗|太|一|介|助|郎/.test(tags)) {
        score += 500;
    }
    if (gender === 'female' && /女|花|美|優|愛|莉|奈|乃|菜|実/.test(tags)) {
        score += 500;
    }
    
    // 画数適性（6〜15画が書きやすい）
    const strokes = parseInt(k['画数']) || 0;
    if (strokes >= 6 && strokes <= 15) {
        score += 100;
    }
    
    // 姓名判断優先モード
    if (prioritizeFortune && surnameData && surnameData.length > 0) {
        // 簡易的な相性チェック（実装は fortune.js 参照）
        score += 50;
    }
    
    return score;
}

console.log("ENGINE: Module loaded");
