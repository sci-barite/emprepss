function onOpen() {
    const UI = SpreadsheetApp.getUi();
    UI.createMenu('➕ Functions')
        .addItem("🔄️ Sync Data", 'getData')
        .addToUi();
}