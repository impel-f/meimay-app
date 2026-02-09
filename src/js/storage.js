// storage.js
const StorageBox = {
    KEY_LIKED: 'baby_name_liked',
    KEY_SAVED: 'baby_name_saved',
    KEY_SURNAME: 'baby_name_surname',
    
    saveAll: function() {
        localStorage.setItem(this.KEY_LIKED, JSON.stringify(liked));
        localStorage.setItem(this.KEY_SAVED, JSON.stringify(savedNames));
        localStorage.setItem(this.KEY_SURNAME, JSON.stringify({ str: surnameStr, data: surnameData }));
        console.log("💾 State saved to localStorage");
    },
    
    loadAll: function() {
        const l = localStorage.getItem(this.KEY_LIKED);
        const s = localStorage.getItem(this.KEY_SAVED);
        const n = localStorage.getItem(this.KEY_SURNAME);
        
        if (l) liked = JSON.parse(l);
        if (s) savedNames = JSON.parse(s);
        if (n) {
            const parsedN = JSON.parse(n);
            surnameStr = parsedN.str;
            surnameData = parsedN.data;
        }
        console.log("📂 State restored from localStorage");
    },
    
    clearAll: function() {
        if (confirm("全データを削除しますか？")) {
            localStorage.clear();
            location.reload();
        }
    }
};

console.log("✅ STORAGE Module Loaded");
