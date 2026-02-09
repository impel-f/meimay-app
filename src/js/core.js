/**
 * ============================================================
 * MODULE 1: CORE (V13.0 - Local Version)
 * アプリ基盤・データ同期 ＆ 診断機能
 * ============================================================
 */

// グローバル状態管理
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
let currentBuildResult = null;

/**
 * アプリ起動時のデータロード処理
 */
window.onload = async () => {
    console.log("CORE: Initializing application...");
    const statusEl = document.getElementById('status');
    
    try {
        // JSONファイルから漢字データを読み込み
        const response = await fetch('../src/data/kanji_data.json');
        const data = await response.json();
        
        if (!data || data.length === 0) {
            console.error("CORE: Data received but it's empty.");
            if(statusEl) statusEl.innerText = "ERROR: DATA IS EMPTY";
            return;
        }
        
        // データの格納
        master = data;
        
        // 全ての漢字から「読み」だけを抽出してセットに格納（高速検索用）
        master.forEach(k => {
            const rds = (k['音'] + ',' + k['訓'] + ',' + k['伝統名のり'])
                         .split(/[、,，\s/]+/)
                         .map(toHira)
                         .filter(x => clean(x));
            rds.forEach(r => validReadingsSet.add(r));
        });

        console.log(`CORE: Load Complete. ${master.length} kanji loaded.`);
        console.log(`CORE: Dictionary built with ${validReadingsSet.size} unique readings.`);

        if (statusEl) {
            statusEl.innerText = "READY: " + master.length + "字 読込完了";
            statusEl.style.color = "#81c995";
        }
        
        // LocalStorageから保存データを復元
        if (typeof StorageBox !== 'undefined') {
            StorageBox.loadAll();
        }
        
    } catch (err) {
        console.error("CORE: Load error: ", err);
        if(statusEl) statusEl.innerText = "LOAD ERROR: " + err.message;
    }
};

/**
 * 名字データの更新処理
 */
function updateSurnameData() {
    const input = document.getElementById('in-surname');
    if (!input) return;
    surnameStr = input.value;
    const chars = surnameStr.split('');
    
    surnameData = chars.map(c => {
        const found = master.find(k => k['漢字'] === c);
        return { 
            kanji: c, 
            strokes: found ? (parseInt(found['画数']) || 0) : 0 
        };
    });
    console.log("CORE: Surname data updated.", surnameData);
}

function setGender(g) {
    gender = g;
    document.getElementById('btn-male').classList.toggle('active-gender', g === 'male');
    document.getElementById('btn-female').classList.toggle('active-gender', g === 'female');
    document.getElementById('btn-neutral').classList.toggle('active-gender', g === 'neutral');
}

function toggleFortunePriority() {
    prioritizeFortune = !prioritizeFortune;
    const btn = document.getElementById('btn-fortune');
    if(btn) btn.classList.toggle('active', prioritizeFortune);
    console.log("CORE: Fortune Priority ->", prioritizeFortune);
}

function setRule(r) { 
    rule = r; 
    document.getElementById('btn-strict').classList.toggle('active', r === 'strict'); 
    document.getElementById('btn-lax').classList.toggle('active', r === 'lax'); 
}

function changeScreen(id) { 
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active')); 
    const target = document.getElementById(id);
    if(target) {
        target.classList.add('active');
        target.scrollTop = 0;
    }
    
    // ナビゲーションバーの表示制御
    const nav = document.getElementById('bottom-nav');
    if (nav) {
        if (id === 'scr-mode') {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
    }
    
    if(typeof updateNavHighlight === 'function') updateNavHighlight(id);
}

function updateNavHighlight(id) {
    document.querySelectorAll('.nav-item, button[id^="nav-"]').forEach(i => i.classList.remove('active-nav'));
    const map = { 
        'scr-main': 'nav-search', 
        'scr-stock': 'nav-stock', 
        'scr-build': 'nav-build', 
        'scr-input-reading': 'nav-settings' 
    };
    const el = document.getElementById(map[id] || 'nav-settings');
    if (el) el.classList.add('active-nav');
}

function toggleSaveName(nameStr, fortuneRes) {
    const index = savedNames.findIndex(n => n.name === nameStr);
    if (index > -1) {
        savedNames.splice(index, 1);
        return false;
    } else {
        savedNames.push({ name: nameStr, fortune: fortuneRes });
        return true;
    }
}

function clean(str) { 
    if (!str) return ""; 
    let s = str.toString().trim(); 
    if (/^(なし|ー|undefined|null|（なし）)$/.test(s)) return ""; 
    return s; 
}

function toHira(str) { 
    return str ? str.toString().replace(/[ァ-ヶ]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60)) : ""; 
}

console.log("MODULE_CORE: V13.0 Loaded");
