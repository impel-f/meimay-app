/* ============================================================
   MODULE 08: ORIGIN (V15.0 - Gemini-powered)
   由来生成（Gemini API統合）
   ============================================================ */

/**
 * 由来文の生成（Gemini API使用）
 */
async function generateOrigin() {
    const modal = document.getElementById('modal-origin');
    if (!modal) return;
    
    const textEl = modal.querySelector('p');
    if (!textEl) return;
    
    textEl.innerText = '由来を生成中...';
    modal.classList.add('active');
    
    const combo = currentBuildResult.combination;
    if (!combo || combo.length === 0) {
        textEl.innerText = '名前データが見つかりません';
        return;
    }
    
    try {
        const originText = await generateOriginWithGemini(combo);
        textEl.innerText = originText;
    } catch (error) {
        console.error('ORIGIN: Generation error', error);
        // フォールバック：テンプレート版
        textEl.innerText = buildTemplateOrigin(combo);
    }
}

/**
 * Gemini APIで由来生成
 */
async function generateOriginWithGemini(combo) {
    // GitHub Secrets経由でAPIキーを取得
    const apiKey = window.GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        console.warn('ORIGIN: No Gemini API key, using template');
        return buildTemplateOrigin(combo);
    }
    
    const kanjiStr = combo.map(k => k['漢字']).join('');
    const meanings = combo.map(k => {
        const m = clean(k['意味']);
        return m.split(/[。、]/)[0];
    });
    
    const genderText = gender === 'male' ? '男の子' : gender === 'female' ? '女の子' : 'お子さん';
    
    const prompt = `${genderText}の名前「${kanjiStr}」の由来を、親の視点で心を込めて書いてください。

漢字の情報：
${combo.map((k, i) => `${i+1}文字目「${k['漢字']}」: ${meanings[i]}`).join('\n')}

条件：
- 200〜300文字程度
- 親が子供に語りかけるような温かい文体
- 各漢字の意味を自然に織り込む
- 具体的なエピソードや願いを含める
- テンプレート感を出さず、オリジナリティのある文章に
- 「〜という意味を持つ漢字」のような説明的な表現は避ける

出力は由来文のみで、前置きや補足説明は不要です。`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 500
                }
            })
        });
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (!text) {
            throw new Error('No response from Gemini');
        }
        
        // 文字数制限（350文字以内）
        if (text.length > 350) {
            return text.substring(0, 347) + '...';
        }
        
        return text;
        
    } catch (error) {
        console.error('ORIGIN: Gemini API error', error);
        throw error;
    }
}

/**
 * テンプレート版由来生成（フォールバック）
 */
function buildTemplateOrigin(combo) {
    const k = combo.map(x => x['漢字']).join('');
    const m = combo.map(x => clean(x['意味']).split(/[。、]/)[0]);
    
    const templates = [
        `この名前を考えたのは、ある静かな夜のことでした。\n\n「${m[0]}」${m[1] ? `、「${m[1]}」` : ''}${m[2] ? `、「${m[2]}」` : ''}という言葉が心に浮かび、自然と「${k}」という名前が生まれました。\n\n${getWish()}`,
        
        `「${k}」\n\nこの名前には、大切な願いが込められています。\n\n${combo.length}つの漢字それぞれに想いを託し、人生という長い旅路で、この名前があなたの道標となりますように。`,
        
        `命名の日、家族で集まってこの名前について語り合いました。\n\n「${k}」という響き。声に出すと、とても温かく優しい音が響きました。\n\nこの名前を呼ぶたび、あなたの笑顔を思い浮かべるでしょう。`,
        
        `あなたが生まれる前から、この名前は心の中にありました。\n\n何冊もの本を読み、何百もの名前を書き出しました。そして最後に残ったのが「${k}」でした。\n\n不思議なことに、この名前を見た瞬間、「これだ」と確信しました。`,
        
        `「${k}」\n\n一文字ずつ、丁寧に選び抜いた漢字。\n\nまっすぐに、のびのびと。優しく、強く。\n\nこの名前に込めたのは、ただ一つ。あなたが、あなたらしく輝いてほしいという願いです。`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

function getWish() {
    const wishes = {
        'male': [
            '誠実で、周りの人から信頼される人になってほしい。',
            '困難に立ち向かう勇気と、優しさを持った人になってほしい。',
            '自分の道を堂々と歩み、人生を切り拓いていってほしい。'
        ],
        'female': [
            '優しさと強さを兼ね備えた、素敵な人になってほしい。',
            '自分らしく輝き、周りの人を笑顔にできる人になってほしい。',
            'しなやかで芯の強い、美しい心を持った人になってほしい。'
        ],
        'unspecified': [
            '自分らしく、のびのびと成長してほしい。',
            '心豊かに、幸せな人生を歩んでほしい。',
            '周りの人を大切にし、大切にされる人になってほしい。'
        ]
    };
    
    const w = wishes[gender] || wishes['unspecified'];
    return w[Math.floor(Math.random() * w.length)];
}

console.log("ORIGIN: Module loaded (Gemini-powered)");

/* public/js/08-origin.js の一番最後に追加 */
window.generateOrigin = generateOrigin;
