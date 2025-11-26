import React, { useState } from 'react';
import './ChapterRenderer.css';

/**
 * Component để render chapter content với support cho blockquote ghi chú
 * Hiển thị giống mockup HTML
 */
function ChapterRenderer({ content, isEditable = false, onChange = null, onNoteAdd = null }) {
  const [openedNotes, setOpenedNotes] = useState({});
  const [inlineNoteMode, setInlineNoteMode] = useState(false);
  const [inlineNoteText, setInlineNoteText] = useState('');

  // Parse content để tách ghi chú (blockquote lines)
  const parseContent = (text) => {
    const lines = text.split('\n');
    const blocks = [];
    let currentBlock = { type: 'text', content: [] };

    lines.forEach((line) => {
      const isBlockquote = line.trim().startsWith('>');

      if (isBlockquote) {
        // Nếu block hiện tại là text, lưu lại trước
        if (currentBlock.type === 'text' && currentBlock.content.length > 0) {
          blocks.push({
            type: 'text',
            content: currentBlock.content.join('\n')
          });
        }

        // Thêm blockquote (ghi chú)
        const noteText = line.replace(/^>\s*/, '');
        blocks.push({
          type: 'blockquote',
          content: noteText,
          id: `note-${blocks.length}`
        });
        currentBlock = { type: 'text', content: [] };
      } else if (line.trim() !== '' || currentBlock.content.length > 0) {
        // Giữ lại dòng trống nếu block đã bắt đầu
        currentBlock.content.push(line);
      }
    });

    // Thêm block text cuối cùng nếu có
    if (currentBlock.content.length > 0) {
      blocks.push({
        type: 'text',
        content: currentBlock.content.join('\n').trim()
      });
    }

    return blocks.filter(block => block.type !== 'text' || block.content.trim() !== '');
  };

  const blocks = parseContent(content || '');

  const toggleNote = (noteId) => {
    setOpenedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const addInlineNote = () => {
    if (inlineNoteText.trim() && onNoteAdd) {
      onNoteAdd(inlineNoteText);
      setInlineNoteText('');
      setInlineNoteMode(false);
    }
  };

  if (isEditable) {
    // Khi đang edit, hiển thị textarea bình thường
    return (
      <textarea
        value={content}
        onChange={onChange}
        className="w-full min-h-[400px] p-4 text-base font-normal leading-relaxed text-gray-900 dark:text-white bg-white dark:bg-[#1e1c27] outline-none resize-none"
        placeholder="Nhập nội dung chương..."
      />
    );
  }

  // Render mode (preview/read) - giống mockup HTML
  return (
    <div className="prose prose-sm max-w-none flex-1 p-4 text-base font-normal leading-relaxed text-gray-900 dark:text-white dark:prose-invert">
      {blocks.map((block, index) => {
        if (block.type === 'text') {
          return (
            <p key={index} className="whitespace-pre-wrap">
              {block.content}
            </p>
          );
        }

        if (block.type === 'blockquote') {
          // Parse title:content từ noteText
          const noteText = block.content;
          const colonIndex = noteText.indexOf(':');
          const title = colonIndex > -1 ? noteText.substring(0, colonIndex) : noteText;
          const noteContentText = colonIndex > -1 ? noteText.substring(colonIndex + 1).trim() : '';
          const isOpen = openedNotes[block.id];

          return (
            <div key={block.id} className="my-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleNote(block.id);
                }}
                className="flex list-none cursor-pointer items-start gap-2 w-full text-left select-none bg-transparent border-0 p-0"
              >
                <span 
                  className="material-symbols-outlined mt-1 text-lg text-primary transition-transform duration-300 flex-shrink-0"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  arrow_right
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {title}
                  </p>
                </div>
              </button>
              {isOpen && noteContentText && (
                <div className="mt-2 ml-4 pl-3 border-l-2 border-primary/30 py-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {noteContentText}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
      
      {/* Inline Note Input - giống mockup */}
      {inlineNoteMode && (
        <div className="flex items-start gap-2 my-4 bg-primary/10 dark:bg-primary/20 p-3 rounded-lg border-l-4 border-primary">
          <span className="material-symbols-outlined mt-1 text-lg text-primary flex-shrink-0">arrow_right</span>
          <input
            type="text"
            value={inlineNoteText}
            onChange={(e) => setInlineNoteText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInlineNote()}
            placeholder="Gõ nội dung ghi chú ở đây..."
            className="w-full bg-transparent font-medium text-gray-800 dark:text-gray-200 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

export default ChapterRenderer;
