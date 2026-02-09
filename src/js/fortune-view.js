// fortune-view.js
function showFortuneReport(name, res, givens) {
    const modal = document.getElementById('modal-fortune-detail');
    const nLabel = document.getElementById('for-name');
    const container = document.getElementById('for-grid');
    
    if (!modal || !nLabel || !container) return;
    
    const getNum = (obj) => (obj ? (obj.num || obj.val || 0) : 0);
    
    nLabel.innerText = name;
    container.innerHTML = '';
    
    const detailCard = document.createElement('div');
    detailCard.className = "bg-white p-8 rounded-[50px] border shadow-sm";
    detailCard.innerHTML = `
        <div class="text-center mb-8">
            <div class="text-6xl font-black mb-4">${name}</div>
            <div class="text-xl font-bold text-[#bca37f]">${res.so.res.label}</div>
        </div>
        <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-[#fdfaf5] rounded-3xl">
                <span class="font-bold">天格</span>
                <span class="${res.ten.res.color}">${getNum(res.ten)}画 ${res.ten.res.label}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-[#fdfaf5] rounded-3xl">
                <span class="font-bold">人格</span>
                <span class="${res.jin.res.color}">${getNum(res.jin)}画 ${res.jin.res.label}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-[#fdfaf5] rounded-3xl">
                <span class="font-bold">地格</span>
                <span class="${res.chi.res.color}">${getNum(res.chi)}画 ${res.chi.res.label}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-[#fdfaf5] rounded-3xl">
                <span class="font-bold">外格</span>
                <span class="${res.gai.res.color}">${getNum(res.gai)}画 ${res.gai.res.label}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-white border-2 border-[#bca37f] rounded-3xl">
                <span class="font-black">総格</span>
                <span class="${res.so.res.color}">${getNum(res.so)}画 ${res.so.res.label}</span>
            </div>
        </div>
    `;
    container.appendChild(detailCard);
    modal.classList.add('active');
}

function closeFortuneDetail() {
    document.getElementById('modal-fortune-detail').classList.remove('active');
}

console.log("✅ FORTUNE-VIEW Module Loaded");
