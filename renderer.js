const btn = document.getElementById('select-file')
const actualFile = document.getElementById('actual-file')
const contentEditor = document.getElementById('content-editor')
const saveChangesEl = document.getElementById('save-changes')
const deleteFile = document.getElementById('delete-file')
const createEl = document.getElementById('create-new-file')

btn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    actualFile.value = filePath;
})


saveChangesEl.addEventListener('click', async function () {
    var actualFilePath = actualFile.value;

    if (actualFilePath) {
        const newValue1 = contentEditor.value
        await window.electronAPI.saveFile({ actualFilePath, contentEditor: newValue1 })
    } else {
        console.log("Please select a file first");
    }
}, false);


deleteFile.addEventListener('click', async function () {
    var actualFilePath = actualFile.value;

    if (actualFilePath) {
        await window.electronAPI.removeFile(actualFilePath)
        document.getElementById("actual-file").value = "";
        document.getElementById("content-editor").value = "";
    } else {
        console.log("Please select a file first");
    }
}, false);


createEl.addEventListener('click', async function () {
    var content = document.getElementById("content-editor").value;

    await window.electronAPI.createFile(content)

}, false);