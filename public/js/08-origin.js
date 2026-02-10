/**
 * ============================================================
 * MODULE 08: AI NAME ORIGIN GENERATOR (V13.0 - 履歴保存・相対パス版)
 * ============================================================
 */

async function generateOrigin() {
    if (!currentBuildResult || !currentBuildResult.givenName) {
        alert('名前が決定されていません');
        return;
    }

    const { givenName, combination } = currentBuildResult;
    console.log("ORIGIN_START: 内部APIを相対パスで呼び出し、結果をデータに統合します。");

    const modal = document.getElementById('modal-origin');
    if (!modal) return;
    
    // 待機中UIの表示
    modal.classList.add('active');
    modal.innerHTML = `
        <div class="detail-sheet animate-fade-in flex flex-col items-center">
            <div class="text-[10px] font-black text-[#bca37f] mb-8 tracking-widest opacity-60 uppercase">AI Writing Service</div>
            <div class="flex flex-col items-center py-20 text-center">
                <div class="w-10 h-10 border-4 border-[#eee5d8] border-t-[#bca37f] rounded-full animate-spin mb-6"></div>
                <p class="text-[12px] font-bold text-[#7a6f5a] leading-loose">
                    「${givenName}」の由来を<br>抽出しています。
                </p>
            </div>
        </div>
    `;

    // 漢字の意味データを整理
    const originDetails = combination.map(c => {
        const src = (typeof liked !== 'undefined') ? liked.find(l => l['漢字'] === c['漢字']) : null;
        return `【${c['漢字']}】：${src ? src['意味'] : "良い意味"}`;
    }).join('\n');

    const prompt = `
名前「${givenName}」の由来を、以下の漢字データのみを使って、漢字の意味を生かして100文字から150文字程度で簡潔に作成してください。
【禁止事項】
・「生命の誕生は～」「親の愛は～」などの前置きは一切不要。
・名字についての言及、名字との響きについての解説も一切書かないでください。
【作成ルール】
・提示された漢字の意味に直結した、一人の人間としての成長や願いを直球で書いてください。
【漢字データ】
${originDetails}
    `.trim();

    try {
        // 相対パスで叩くことでVercelのルーティングを確実に通す
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) throw new Error(`API疎通エラー (Status: ${response.status})`);

        const data = await response.json();
        const aiText = data.text || '由来を生成できませんでした。';

        // --- データを更新して履歴に反映 ---
        currentBuildResult.origin = aiText;
        if (typeof savedNames !== 'undefined') {
            const index = savedNames.findIndex(n => n.fullName === currentBuildResult.fullName);
            if (index !== -1) {
                savedNames[index].origin = aiText;
                if (typeof StorageBox !== 'undefined') StorageBox.saveSavedNames();
                console.log("ORIGIN: 保存済みデータの由来を更新しました。");
            }
        }

        renderAIOriginResult(givenName, aiText);

    } catch (err) {
        console.error("AI_FAILURE:", err);
        modal.innerHTML = `
            <div class="detail-sheet flex flex-col items-center text-center">
                <p class="text-[12px] text-red-700 font-bold mb-8">エラーが発生しました: ${err.message}</p>
                <button onclick="closeOriginModal()" class="w-full py-5 bg-white border border-[#eee5d8] rounded-[35px] text-[#a6967a] font-black uppercase tracking-widest">閉じる</button>
            </div>
        `;
    }
}

function renderAIOriginResult(givenName, text) {
    const modal = document.getElementById('modal-origin');
    if (!modal) return;
    modal.innerHTML = `
        <div class="detail-sheet animate-fade-in flex flex-col items-center max-w-[420px]">
            <div class="text-[10px] font-black text-[#bca37f] mb-8 tracking-widest opacity-60 uppercase">The Origin Story</div>
            <div class="text-6xl font-black text-[#5d5444] mb-10 tracking-tight">${givenName}</div>
            <div class="w-full bg-[#fdfaf5] border border-[#eee5d8] rounded-[40px] p-8 mb-10 shadow-inner overflow-y-auto max-h-[50vh] no-scrollbar">
                <p class="text-[14px] leading-relaxed text-[#5d5444] font-bold whitespace-pre-wrap">${text}</p>
            </div>
            <div class="flex flex-col gap-3 w-full">
                <button onclick="copyOriginToClipboard()" class="w-full py-5 bg-[#5d5444] text-white rounded-[35px] font-black uppercase tracking-widest active:scale-95 transition-transform">📋 由来をコピー</button>
                <button onclick="closeOriginModal()" class="w-full py-5 bg-white border border-[#eee5d8] rounded-[35px] text-[#a6967a] font-black uppercase tracking-widest">閉じる</button>
            </div>
        </div>
    `;
}

function closeOriginModal() {
    const m = document.getElementById('modal-origin');
    if (m) m.classList.remove('active');
}

function copyOriginToClipboard() {
    const p = document.querySelector('#modal-origin p');
    if (p) {
        navigator.clipboard.writeText(p.innerText.trim()).then(() => alert("由来をコピーしました。"));
    }
}

// グローバル公開
window.generateOrigin = generateOrigin;
window.closeOriginModal = closeOriginModal;
window.copyOriginToClipboard = copyOriginToClipboard;
