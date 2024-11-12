import React, { useState } from 'react';
import { Button, Input } from 'antd';

const { TextArea } = Input;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Преобразование текста с новой строкой в HTML с <br> и преобразование ссылок в кликабельные
  const formatNoteText = (text) => {
    const textWithBreaks = text.replace(/\n/g, '<br/>');
    const linkedText = textWithBreaks.replace(
      /(https?:\/\/[^\s]+)/gim,
      '<a href="$1" target="_blank">$1</a>'
    );
    return linkedText;
  };

  // Добавление новой заметки
  const addNote = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, newNote]);
      setNewNote(''); // Сброс поля
    }
  };

  // Удаление заметки
  const removeNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <>
      <h2>Заметки</h2>
      <TextArea
        placeholder="Введите текст новой заметки"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        rows={4}
      />
      <Button onClick={addNote} style={{ marginTop: '10px', width: '100%' }}>
        Добавить заметку
      </Button>
      <div style={{ marginTop: '20px' }}>
        {notes.map((note, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <div dangerouslySetInnerHTML={{ __html: formatNoteText(note) }} />
            <Button
              type="link"
              onClick={() => removeNote(index)}
              style={{ color: 'red' }}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Notes;
