console.log("Hello Class")



const noteArea = document.getElementById('noteField');

const sidebar = document.getElementById('sidebar');
const noteView = document.getElementById('noteContent');

let debounceTimeout;
window.addEventListener("load", async (event) => {
    const notes = await api.getFiles();
    sidebar.innerHTML = '';
    if (notes.success) {
        for (const noteTitle of notes.files) {
            //delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                const confirmed = confirm(`Are you sure you want to delete the note: "${noteTitle}"?`);
                if (confirmed) {
                    const response = await api.deleteFile({ title: noteTitle });
                    if (response.success) {
                        alert('Note deleted successfully');
                        window.location.reload();
                    } else {
                        alert('Error deleting note');
                    }
                }
            });
            //sidebar button
            const noteElement = document.createElement('button');
            noteElement.textContent = noteTitle;
            noteElement.addEventListener('click', async () => {
                //chnaging the delete button
                const existingButton = noteArea.querySelector('button');
                if (existingButton) {
                    existingButton.remove()
                }
                //note content
                const noteContent = await api.getContent({ title: noteTitle })
                noteView.value = noteContent.content;
                //adding active class to the pressed buttton
                const allButtons = sidebar.querySelectorAll('button');
                allButtons.forEach(button => {
                    button.classList.remove('active');
                });
                noteElement.classList.add('active');
                //adding the delete button 
                noteArea.appendChild(deleteButton)
            })
            //adding the button to the sidebar
            sidebar.appendChild(noteElement);
        }
        sidebar.firstElementChild.click();
    }
})

let previousContent = noteView.value;
const autoSave = async () => {
    const currentContent = noteView.value;
    let activeButton = document.querySelector('.active');
    const noteTitle = activeButton ? activeButton.textContent : null
    console.log("Auto-saving note:", noteTitle);
    await api.autoSave({ title: noteTitle, content: currentContent });

};

noteView.addEventListener('input', async () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        if (noteView.value !== previousContent) {
            await autoSave();
        }
    }, 1000);
});


noteView.style.height = noteView.scrollHeight + 'px'; // Initial height
noteView.addEventListener('input', () => {
    if (noteView.scrollHeight > noteView.clientHeight) {
        noteView.style.height = noteView.scrollHeight + 'px'; // Only grows
    }
});