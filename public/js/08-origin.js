/* ============================================================
   MODULE 08: ORIGIN (V13.0)
   由来生成（簡易版・将来的にGemini API統合）
   ============================================================ */

/**
 * 由来文の生成
 */
function generateOrigin() {
    const modal = document.getElementById('modal-origin');
    if (!modal) {
        console.error("ORIGIN: Modal not found");
        return;
    }
    
    const textEl = modal.querySelector('p');
    if (!textEl) {
        console.error("ORIGIN: Text element not found");
        return;
    }
    
    // ローディング表示
    textEl.innerText = '由来を生成中...';
    modal.classList.add('active');
    
    // データ取得
    const combo = currentBuildResult.combination;
    if (!combo || combo.length === 0) {
        textEl.innerText = '名前データが見つかりません';
        return;
    }
    
    // 簡易的な由来生成
    setTimeout(() => {
        const originText = buildOriginText(combo);
        textEl.innerText = originText;
    }, 1000);
    
    console.log("ORIGIN: Generation started");
}

/**
 * 由来文の構築
 */
function buildOriginText(combo) {
    // 各漢字の意味からキーワード抽出
    const keywords = combo.map(k => {
        const meaning = clean(k['意味']);
        // 最初の文を抽出
        return meaning.split(/[。、]/)[0];
    });
    
    // 文脈の組み立て
    let text = `「${keywords.join('」と「')}」という意味を持つ漢字を組み合わせました。\n\n`;
    
    // 性別に応じたメッセージ
    if (gender === 'male') {
        text += "力強く、自分の道を切り拓く聡明な子に育ってほしい";
    } else if (gender === 'female') {
        text += "周囲を照らす優しさと、凛とした美しさを持つ子に育ってほしい";
    } else {
        text += "自由な発想を持ち、豊かで実り多い人生を歩んでほしい";
    }
    
    text += "という願いを込めたお名前です。";
    
    // 姓名判断が良好な場合は追記
    if (currentBuildResult.fortune && 
        currentBuildResult.fortune.so.res.label === '大吉') {
        text += "\n\n画数も非常に良好で、総格は大吉となっています。運勢にも恵まれた素晴らしい名前です。";
    }
    
    return text;
}

/**
 * 将来的なGemini API統合用の関数
 * （現在は未実装）
 */
async function generateOriginWithAI(combo) {
    // TODO: Gemini API統合
    // const response = await fetch('/api/generate-origin', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ combination: combo, gender: gender })
    // });
    // return await response.json();
    
    console.log("ORIGIN: AI generation not yet implemented");
    return buildOriginText(combo);
}

console.log("ORIGIN: Module loaded");
