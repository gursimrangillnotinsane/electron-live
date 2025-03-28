const button = document.getElementById('submit');
const titleNote = document.getElementById('notetitle');
const note = document.getElementById('content');

button.addEventListener('click', async () => {
    const title = titleNote.value;
    const content = note.value;
    if (!title || !content) {
        console.error('Title or content is missing');
        return;
    }
    const res = await api.createNote({
        title,
        content
    })
    console.log(res)
    titleNote.value = "";
    note.value = "";
    window.location = "index.html";
})
note.addEventListener('input', () => {
    note.style.height = note.scrollHeight + 'px'; // Set height based on content
    console.log("here")
});


