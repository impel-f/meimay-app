/* ============================================================
   MODULE 01: CORE (V13.0)
   グローバル変数・初期化・データ読み込み
   ============================================================ */

// グローバル変数
let master = [];
let segments = [];
let currentPos = 0;
let liked = [];
let seen = new Set();
let validReadingsSet = new Set();
let rule = 'strict';
let stack = [];
let currentIdx = 0;
let swipes = 0;
let gender = 'neutral';
let surnameStr = "";
let surnameData = [];
let prioritizeFortune = false;
let savedNames = [];
let currentBuildResult = {
    fullName: "",
    reading: "",
    fortune: null,
    combination: [],
    givenName: "",
    timestamp: null
};

/**
 * アプリ初期化
 */
window.onload = () => {
    console.log("CORE: Initializing Meimay App...");
    const statusEl = document.getElementById('status');
    
    // 漢字データの読み込み
    fetch('/data/kanji_data.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            return res.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                throw new Error("漢字データが空です");
            }
            
            master = data;
            console.log(`CORE: ${master.length} kanji loaded successfully`);
            
            // 読みデータのインデックス作成
            master.forEach(k => {
                const readings = (k['音'] + ',' + k['訓'] + ',' + k['伝統名のり'])
                    .split(/[、,，\s/]+/)
                    .map(toHira)
                    .filter(x => clean(x));
                readings.forEach(r => validReadingsSet.add(r));
            });
            
            console.log(`CORE: ${validReadingsSet.size} unique readings indexed`);
            
            // UI更新
            if (statusEl) {
                statusEl.innerText = `READY: ${master.length}字 読込完了`;
                statusEl.style.color = "#81c995";
            }
            
            // LocalStorageから復元
            if (typeof StorageBox !== 'undefined' && typeof StorageBox.loadAll === 'function') {
                StorageBox.loadAll();
            }
        })
        .catch(err => {
            console.error("CORE: データ読み込みエラー:", err);
            if (statusEl) {
                statusEl.innerText = `ERROR: ${err.message}`;
                statusEl.style.color = "#f28b82";
            }
            alert('漢字データの読み込みに失敗しました。\n/data/kanji_data.json を確認してください。');
        });
};

/**
 * 名字データの更新
 */
function updateSurnameData() {
    const input = document.getElementById('in-surname');
    if (!input) return;
    
    surnameStr = input.value.trim();
    const chars = surnameStr.split('');
    
    surnameData = chars.map(c => {
        const found = master.find(k => k['漢字'] === c);
        return { 
            kanji: c, 
            strokes: found ? (parseInt(found['画数']) || 0) : 0 
        };
    });
    
    console.log("CORE: Surname data updated ->", surnameData);
}

/**
 * 姓名判断優先モードの切り替え
 */
function toggleFortunePriority() {
    prioritizeFortune = !prioritizeFortune;
    const btn = document.getElementById('btn-fortune');
    if (btn) btn.classList.toggle('active', prioritizeFortune);
    console.log(`CORE: Fortune priority ${prioritizeFortune ? 'ON' : 'OFF'}`);
}

/**
 * 画面遷移
 */
function changeScreen(id) { 
    console.log(`CORE: Screen transition -> ${id}`);
    
    // 全画面を非表示
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active')); 
    
    // ターゲット画面を表示
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
    } else {
        console.error(`CORE: Screen not found: ${id}`);
        return;
    }
    
    // ナビゲーションハイライト更新
    updateNavHighlight(id);
}

/**
 * ナビゲーションハイライト更新
 */
function updateNavHighlight(screenId) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active-nav'));
    
    const navMap = { 
        'scr-main': 'nav-search', 
        'scr-stock': 'nav-stock', 
        'scr-build': 'nav-build', 
        'scr-input-reading': 'nav-settings' 
    };
    
    const navId = navMap[screenId];
    if (navId) {
        const navEl = document.getElementById(navId);
        if (navEl) navEl.classList.add('active-nav');
    }
}

/**
 * 文字列クリーニング
 */
function clean(str) { 
    if (!str) return ""; 
    let s = str.toString().trim(); 
    if (/^(なし|ー|undefined|null|（なし）)$/.test(s)) return ""; 
    return s; 
}

/**
 * カタカナ→ひらがな変換
 */
function toHira(str) { 
    if (!str) return "";
    return str.toString().replace(/[ァ-ヶ]/g, m => 
        String.fromCharCode(m.charCodeAt(0) - 0x60)
    );
}

console.log("CORE: Module loaded");
