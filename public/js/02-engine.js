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
        const totalSlots = segments.length;
        const slotLabel = totalSlots === 2 ? 
            (currentPos === 0 ? '1文字目' : '2文字目') :
            (currentPos === 0 ? '1文字目' : currentPos === totalSlots - 1 ? `${totalSlots}文字目` : `${currentPos + 1}文字目`);
        
        indicator.innerText = `${slotLabel}：${target}`;
    }
    
    // フィルタリング
    stack = master.filter(k => {
        // 同じ読みが続く場合は、seenチェックをスキップ
        const isSameReading = currentPos > 0 && segments[currentPos] === segments[currentPos - 1];
        
        if (!isSameReading && seen && seen.has(k['漢字'])) {
            return false; // 通常は既選択を除外
        }
        
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
/**
 * スワイプ用スタックの生成（性別＋イメージタグフィルター対応）
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
        const totalSlots = segments.length;
        const slotLabel = totalSlots === 2 ? 
            (currentPos === 0 ? '1文字目' : '2文字目') :
            (currentPos === 0 ? '1文字目' : currentPos === totalSlots - 1 ? `${totalSlots}文字目` : `${currentPos + 1}文字目`);
        
        indicator.innerText = `${slotLabel}：${target}`;
    }
    
    // フィルタリング
    stack = master.filter(k => {
        // 同じ読みが続く場合は、seenチェックをスキップ
        const isSameReading = currentPos > 0 && segments[currentPos] === segments[currentPos - 1];
        
        if (!isSameReading && seen && seen.has(k['漢字'])) {
            return false; // 通常は既選択を除外
        }
        
        // 読みデータの取得
        const readings = (k['音'] + ',' + k['訓'] + ',' + k['伝統名のり'])
            .split(/[、,，\s/]+/)
            .map(x => toHira(x))
            .filter(x => x);
        
        // 読みマッチング判定
        k.priority = readings.includes(target) ? 1 : 
                     (readings.some(r => r.startsWith(target)) ? 2 : 0);
        
        // ルールに応じてフィルタ
        return rule === 'strict' ? k.priority === 1 : k.priority > 0;
    });
    
    // 々（同じ字点）の対応
    if (currentPos > 0 && segments[currentPos] === segments[currentPos - 1]) {
        const prevChoices = liked.filter(item => item.slot === currentPos - 1);
        
        if (prevChoices.length > 0) {
            stack.push({
                '漢字': '々',
                '画数': prevChoices[0]['画数'],
                '音': '',
                '訓': '',
                '伝統名のり': '',
                '意味': '前の漢字を繰り返す',
                '名前のイメージ': '【繰り返し】',
                '分類': '【記号】',
                priority: 1
            });
        }
    }
    
    // 性別による優先順位付け（イメージタグの前に実行）
    stack = applyGenderFilter(stack);
    
    // イメージタグによる優先順位付け
    stack = applyImageTagFilter(stack);
    
    // 優先度でソート
    stack.sort((a, b) => {
        // まず読みの優先度（priority）
        if (a.priority !== b.priority) return a.priority - b.priority;
        // 次に性別の優先度（genderPriority）
        if (a.genderPriority !== b.genderPriority) return a.genderPriority - b.genderPriority;
        // 次にイメージタグの優先度（imagePriority）
        if (a.imagePriority !== b.imagePriority) return a.imagePriority - b.imagePriority;
        // 最後に画数
        return a['画数'] - b['画数'];
    });
    
    console.log(`ENGINE: Stack loaded with ${stack.length} candidates`);
    
    currentIdx = 0;
    
    if (typeof render === 'function') {
        render();
    }
}

/**
 * 性別フィルター適用
 */
function applyGenderFilter(kanjis) {
    if (!gender || gender === 'neutral') {
        // 指定なしの場合は全て同じ優先度
        kanjis.forEach(k => k.genderPriority = 1);
        return kanjis;
    }
    
    // イメージタグのマッピング（性別判定用キーワード）
    const maleKeywords = ['力強', '剛', '勇', '雄', '男', '太', '大', '翔', '斗', '輝', '陽', '壮大', 'リーダー', '成功'];
    const femaleKeywords = ['優', '美', '麗', '花', '菜', '子', '愛', '華', '彩', '音', '里', '柔', '優しさ', '慈愛', '清らか'];
    
    return kanjis.map(k => {
        const img = k['名前のイメージ'] || '';
        const meaning = k['意味'] || '';
        const combined = img + meaning;
        
        // キーワードマッチング
        const isMale = maleKeywords.some(kw => combined.includes(kw));
        const isFemale = femaleKeywords.some(kw => combined.includes(kw));
        
        if (gender === 'male') {
            k.genderPriority = isMale ? 1 : (isFemale ? 3 : 2);
        } else if (gender === 'female') {
            k.genderPriority = isFemale ? 1 : (isMale ? 3 : 2);
        } else {
            k.genderPriority = 1;
        }
        
        return k;
    });
}

/**
 * イメージタグフィルター適用
 */
function applyImageTagFilter(kanjis) {
    // 「こだわらない」が選択されている場合
    if (!selectedImageTags || selectedImageTags.includes('none')) {
        kanjis.forEach(k => k.imagePriority = 1);
        return kanjis;
    }
    
    // タグとキーワードのマッピング
    const tagKeywords = {
        'nature': ['自然', '植物', '樹木', '草', '森', '木', '花', '華やか', '桜'],
        'brightness': ['明るさ', '太陽', '陽', '光', '輝き', '晴れ', '朗らか'],
        'water': ['海', '水', '川', '波', '流れ', '清らか'],
        'strength': ['強さ', '力', '剛健', '勇敢', '勇気', '活力', '壮大'],
        'kindness': ['優しさ', '慈愛', '愛情', '思いやり', '温かさ', '柔らか'],
        'intelligence': ['知性', '賢さ', '才能', '優秀', '学問', '智恵'],
        'honesty': ['誠実', '真面目', '実直', '正直', '真摯'],
        'elegance': ['品格', '高貴', '気品', '上品', '優雅', '格調'],
        'tradition': ['伝統', '古風', '和', '雅', '伝統的'],
        'beauty': ['美', '麗しい', '艶やか', '華麗', '美しい'],
        'success': ['成功', '向上', '昇進', '発展', '繁栄', '栄える'],
        'peace': ['安定', '平和', '平穏', '安らか', '穏やか', '調和'],
        'leadership': ['リーダー', '統率', '王者', '主導', '指導'],
        'hope': ['希望', '未来', '夢', '願い', '期待', '幸福'],
        'spirituality': ['精神', '心', '魂', '意志', '信念', '純粋']
    };
    
    return kanjis.map(k => {
        const img = k['名前のイメージ'] || '';
        const meaning = k['意味'] || '';
        const combined = img + meaning;
        
        // 選択されたタグのいずれかにマッチするかチェック
        const matches = selectedImageTags.some(tagId => {
            const keywords = tagKeywords[tagId] || [];
            return keywords.some(kw => combined.includes(kw));
        });
        
        k.imagePriority = matches ? 1 : 2;
        return k;
    });
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
