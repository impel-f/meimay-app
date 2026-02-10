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
    const meanings = combo.map(k => clean(k['意味']).split(/[。、]/)[0]);
    const images = combo.map(k => clean(k['名前のイメージ'])).filter(x => x);
    const kanjiStr = combo.map(k => k['漢字']).join('');
    
    // バリエーション豊かなテンプレート（ランダム選択）
    const templates = [
        buildTemplate1(kanjiStr, meanings, images),
        buildTemplate2(kanjiStr, meanings, images),
        buildTemplate3(kanjiStr, meanings, images),
        buildTemplate4(kanjiStr, meanings, images),
        buildTemplate5(kanjiStr, meanings, images)
    ];
    
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
}

function buildTemplate1(kanji, meanings, images) {
    let text = `「${kanji}」という名前は、`;
    
    meanings.forEach((m, i) => {
        if (i === 0) {
            text += `「${m}」`;
        } else if (i === meanings.length - 1) {
            text += `、そして「${m}」`;
        } else {
            text += `、「${m}」`;
        }
    });
    
    text += `という意味を組み合わせた、深い想いが込められた名前です。\n\n`;
    
    if (gender === 'male') {
        text += `逞しく、真っ直ぐに自分の道を歩み、周りの人を導いていけるような、芯の強い子に育ってほしいという願いを込めました。`;
    } else if (gender === 'female') {
        text += `優しさと強さを兼ね備え、自分らしく輝きながら、周りの人にも温かさを届けられるような子に育ってほしいという願いを込めました。`;
    } else {
        text += `自分らしさを大切にしながら、のびのびと成長し、豊かで実り多い人生を歩んでほしいという願いを込めました。`;
    }
    
    return text;
}

function buildTemplate2(kanji, meanings, images) {
    let text = `この名前に使われている漢字には、それぞれ特別な意味があります。\n\n`;
    
    meanings.forEach((m, i) => {
        const k = kanji[i];
        text += `「${k}」は${m}を表し、`;
        if (i === meanings.length - 1) {
            text += `名前全体に深みを与えています。\n`;
        } else {
            text += `\n`;
        }
    });
    
    text += `\nこれらの漢字を組み合わせることで、`;
    
    if (gender === 'male') {
        text += `力強く前向きに、そして誠実に生きていける人になってほしいという思いを表現しました。`;
    } else if (gender === 'female') {
        text += `美しく優雅に、そして芯の強さを持って生きていける人になってほしいという思いを表現しました。`;
    } else {
        text += `明るく前向きに、そして自分らしく生きていける人になってほしいという思いを表現しました。`;
    }
    
    return text;
}

function buildTemplate3(kanji, meanings, images) {
    let text = `「${kanji}」\n\n`;
    text += `この名前には、親から子への深い愛情と期待が込められています。\n\n`;
    
    meanings.forEach((m, i) => {
        text += `${i + 1}文字目の「${kanji[i]}」は、${m}という意味を持ちます。`;
        if (i < meanings.length - 1) text += `\n`;
    });
    
    text += `\n\nこれらが組み合わさることで、`;
    
    if (images.length > 0) {
        text += `${images.slice(0, 2).join('や')}といったイメージを表現し、`;
    }
    
    if (gender === 'male') {
        text += `頼もしく、周りから信頼される人に育ってほしいという願いが込められています。`;
    } else if (gender === 'female') {
        text += `優しく、周りの人を笑顔にできる人に育ってほしいという願いが込められています。`;
    } else {
        text += `健やかに、幸せな人生を歩んでほしいという願いが込められています。`;
    }
    
    return text;
}

function buildTemplate4(kanji, meanings, images) {
    let text = `名付けに込めた想い：\n\n`;
    text += `「${kanji}」という名前を選んだ理由は、`;
    
    if (meanings.length === 2) {
        text += `${meanings[0]}と${meanings[1]}という、二つの素晴らしい意味を持つ漢字の組み合わせです。`;
    } else if (meanings.length === 3) {
        text += `${meanings[0]}、${meanings[1]}、${meanings[2]}という、三つの深い意味を持つ漢字の調和です。`;
    } else {
        text += `それぞれの漢字が持つ深い意味の調和です。`;
    }
    
    text += `\n\n`;
    
    if (gender === 'male') {
        text += `勇敢で優しい心を持ち、どんな困難にも立ち向かえる強さを持った人になってほしい。そんな願いを込めてこの名前を選びました。`;
    } else if (gender === 'female') {
        text += `しなやかで美しい心を持ち、自分の道を堂々と歩める強さを持った人になってほしい。そんな願いを込めてこの名前を選びました。`;
    } else {
        text += `温かく広い心を持ち、自分らしく輝ける人になってほしい。そんな願いを込めてこの名前を選びました。`;
    }
    
    return text;
}

function buildTemplate5(kanji, meanings, images) {
    let text = `【名前の由来】\n\n`;
    text += `「${kanji}」\n\n`;
    
    text += `この名前は、`;
    meanings.forEach((m, i) => {
        if (i === 0) {
            text += `「${m}」を意味する「${kanji[i]}」`;
        } else {
            text += `、「${m}」を表す「${kanji[i]}」`;
        }
    });
    text += `という漢字を組み合わせています。\n\n`;
    
    if (currentBuildResult.fortune && currentBuildResult.fortune.so.res.label === '大吉') {
        text += `画数も非常に良好で、姓名判断では大吉となっています。運勢にも恵まれた、縁起の良い名前です。\n\n`;
    }
    
    text += `この子が、`;
    
    if (gender === 'male') {
        text += `誠実で頼りがいのある、周りの人に希望を与えられるような人に成長してくれることを願っています。`;
    } else if (gender === 'female') {
        text += `優雅で芯が強く、周りの人に喜びを届けられるような人に成長してくれることを願っています。`;
    } else {
        text += `心豊かで前向きに、自分の可能性を信じて歩んでいけるような人に成長してくれることを願っています。`;
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
