document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    const clearNotesBtn = document.getElementById('clear-notes-btn');
    const downloadNotesBtn = document.getElementById('download-notes-btn');
    const charCount = document.getElementById('char-count');
    
    // Load existing notes from localStorage
    let notes = JSON.parse(localStorage.getItem('koolnotes')) || [];
    
    // Update character count
    noteInput.addEventListener('input', () => {
        const count = noteInput.value.length;
        charCount.textContent = `${count}/500`;
        if (count > 500) {
            charCount.style.color = '#ff1493';
        } else {
            charCount.style.color = '#ffffff';
        }
    });
    
    // Add note function
    function addNote() {
        const text = noteInput.value.trim();
        if (text && text.length <= 500) {
            const note = {
                id: Date.now(),
                text,
                date: new Date().toLocaleString()
            };
            notes.unshift(note);
            localStorage.setItem('koolnotes', JSON.stringify(notes));
            renderNotes();
            noteInput.value = '';
            charCount.textContent = '0/500';
        }
    }
    
    // Render notes function
    function renderNotes() {
        notesList.innerHTML = notes.map(note => `
            <div class="note" data-id="${note.id}">
                <p>${note.text}</p>
                <div class="note-footer">
                    <small>${note.date}</small>
                    <button onclick="deleteNote(${note.id})" class="delete-btn">
                        <img src="${trashIconPath}" 
                             alt="Delete"
                             width="14"
                             height="14"
                             class="trash-icon">
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Delete note function
    window.deleteNote = (id) => {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('koolnotes', JSON.stringify(notes));
        renderNotes();
    };
    
    // Clear all notes
    clearNotesBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all notes?')) {
            notes = [];
            localStorage.setItem('koolnotes', JSON.stringify(notes));
            renderNotes();
        }
    });
    
    // Download notes
    downloadNotesBtn.addEventListener('click', () => {
        const text = notes.map(note => 
            `${note.date}\n${note.text}\n\n`
        ).join('');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'koolnotes.txt';
        a.click();
    });
    
    // Event listeners
    addNoteBtn.addEventListener('click', addNote);
    noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNote();
        }
    });
    
    // Initial render
    renderNotes();
});