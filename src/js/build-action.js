// build-action.js
function handleShowFortuneReport() {
    if (!currentBuildResult) return;
    showFortuneReport(currentBuildResult.fullName, currentBuildResult.fortune, currentBuildResult.combination);
}

function handleShowNameOrigin() {
    if (!currentBuildResult) return;
    showNameOrigin(currentBuildResult.givenName, currentBuildResult.combination);
}

function handleSaveName() {
    const userNotes = document.getElementById('build-name-message')?.value || "";
    const saveData = {
        fullName: currentBuildResult.givenName,
        reading: currentBuildResult.reading,
        totalScore: currentBuildResult.fortune?.so?.res?.label || "-",
        message: userNotes
    };
    
    savedNames.push(saveData);
    if (typeof StorageBox !== 'undefined') StorageBox.saveAll();
    
    alert("✅ ローカルストレージに保存しました！");
}

console.log("✅ BUILD-ACTION Module Loaded");
