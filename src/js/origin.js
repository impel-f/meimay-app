// origin.js
async function showNameOrigin(givenName, combination) {
    let modal = document.getElementById('modal-origin');
    modal.classList.add('active');
    
    const originDetails = combination.map(c => {
        const src = liked.find(l => l['漢字'] === c.kanji);
        return `【${c.kanji}】：${src ? src['意味'] : "良い意味"}`;
    }).join('\\n');
    
    const prompt = `名前「${givenName}」の由来を、以下の漢字データのみを使って、100文字から150文字程度で作成してください。

【禁止事項】
・前置きは不要です
・名字についての言及も不要です

【漢字データ】
${originDetails}`;
    
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        
        if (data.text) {
            renderAIOriginResult(givenName, data.text);
        } else {
            throw new Error('AI応答が空です');
        }
    } catch (err) {
        console.error('AI Error:', err);
        modal.innerHTML = `<div class="detail-sheet text-center"><p class="text-red-700">由来生成に失敗しました</p><button onclick="closeOriginModal()" class="btn-gold mt-8">閉じる</button></div>`;
    }
}

function renderAIOriginResult(givenName, text) {
    const modal = document.getElementById('modal-origin');
    modal.innerHTML = `
        <div class="detail-sheet animate-fade-in">
            <div class="text-6xl font-black text-center mb-10">${givenName}</div>
            <div class="bg-[#fdfaf5] border rounded-[40px] p-8 mb-10">
                <p class="text-[14px] leading-relaxed">${text}</p>
            </div>
            <button onclick="copyOriginToClipboard()" class="w-full py-5 bg-[#5d5444] text-white rounded-[35px] mb-3">📋 コピー</button>
            <button onclick="closeOriginModal()" class="w-full py-5 bg-white border rounded-[35px]">閉じる</button>
        </div>
    `;
}

function closeOriginModal() {
    document.getElementById('modal-origin').classList.remove('active');
}

function copyOriginToClipboard() {
    const p = document.querySelector('#modal-origin p');
    if (p) navigator.clipboard.writeText(p.innerText.trim()).then(() => alert("コピーしました"));
}

console.log("✅ ORIGIN Module Loaded");
