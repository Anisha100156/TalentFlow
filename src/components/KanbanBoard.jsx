import React, { useState, useRef, useEffect } from "react";
import { Bell, MoreVertical, CheckSquare, BarChart3, ChevronLeft, MessageSquare, X } from "lucide-react";

const initialData = {
  pending: [
    { id: "1", name: "Ali Khan", email: "AliKhan123@gmail.com", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "2", name: "Bilal Khan", email: "BilalKhan123@gmail.com", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "3", name: "Ahmad Ali", email: "Ahmad.Ali123@gmail.com", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "4", name: "Amjad Bilal", email: "Ahmad.Ali123@gmail.com", date: "1 June, 25 & 12:00 PM", notes: [] },
  ],
  assigned: [
    { id: "5", name: "Ali Khan", role: "HR Name 1", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "6", name: "Bilal Khan", role: "HR Name 2", date: "1 June, 25 & 12:00 PM", notes: [] },
  ],
  invitation: [
    { id: "7", name: "Ali Khan", role: "Interviewer 1", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "8", name: "Bilal Khan", role: "Interviewer 2", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "9", name: "Ahmad Ali", role: "Interviewer 3", date: "1 June, 25 & 12:00 PM", notes: [] },
  ],
  training: [
    { id: "10", name: "Ali Khan", role: "Trainer 1", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "11", name: "Bilal Khan", role: "Trainer 2", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "12", name: "Ahmad Ali", role: "Trainer 3", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "13", name: "Ahmad Ali", role: "Trainer 3", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "14", name: "Ahmad Ali", role: "Trainer 4", date: "1 June, 25 & 12:00 PM", notes: [] },
  ],
  accepted: [
    { id: "15", name: "Ali Khan", email: "AliKhan123@gmail.com", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "16", name: "Bilal Khan", email: "BilalKhan123@gmail.com", date: "1 June, 25 & 12:00 PM", notes: [] },
    { id: "17", name: "Ahmad Ali", email: "Ahmad.Ali123@gmail.com", date: "1 June, 25 & 12:00 PM", notes: [] },
  ],
};

const teamMembers = [
  { id: "tm1", name: "Sarah Johnson", role: "HR Manager", avatar: "SJ" },
  { id: "tm2", name: "Mike Chen", role: "Technical Lead", avatar: "MC" },
  { id: "tm3", name: "Emily Davis", role: "Recruiter", avatar: "ED" },
  { id: "tm4", name: "James Wilson", role: "Team Lead", avatar: "JW" },
  { id: "tm5", name: "Lisa Anderson", role: "HR Coordinator", avatar: "LA" },
  { id: "tm6", name: "David Brown", role: "Senior Developer", avatar: "DB" },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialData);
  const [draggedItem, setDraggedItem] = useState(null);
  const [activeNoteCard, setActiveNoteCard] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const getColumnConfig = (columnId) => {
    const configs = {
      pending: { title: "Pending", color: "bg-gray-600", count: 20 },
      assigned: { title: "Assigned", color: "bg-amber-600", count: 15 },
      invitation: { title: "Pending Invitation", color: "bg-indigo-700", count: 15 },
      training: { title: "Training", color: "bg-blue-600", count: 10 },
      accepted: { title: "Accepted", color: "bg-green-600", count: 5 },
    };
    return configs[columnId];
  };

  const handleDragStart = (e, item, sourceColumn) => {
    setDraggedItem({ item, sourceColumn });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, sourceColumn } = draggedItem;
    
    if (sourceColumn === targetColumn) {
      setDraggedItem(null);
      return;
    }

    const newColumns = { ...columns };
    newColumns[sourceColumn] = newColumns[sourceColumn].filter(i => i.id !== item.id);
    newColumns[targetColumn] = [...newColumns[targetColumn], item];

    setColumns(newColumns);
    setDraggedItem(null);
  };

  const handleNoteChange = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    
    setNoteText(value);
    setCursorPosition(position);

    // Check if @ is typed
    const lastAtIndex = value.lastIndexOf('@', position - 1);
    if (lastAtIndex !== -1) {
      const textAfterAt = value.substring(lastAtIndex + 1, position);
      if (!textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
        return;
      }
    }
    setShowMentions(false);
  };

  const insertMention = (member) => {
    const lastAtIndex = noteText.lastIndexOf('@', cursorPosition - 1);
    const beforeMention = noteText.substring(0, lastAtIndex);
    const afterMention = noteText.substring(cursorPosition);
    const newText = `${beforeMention}@${member.name} ${afterMention}`;
    
    setNoteText(newText);
    setShowMentions(false);
    setMentionSearch("");
    
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = lastAtIndex + member.name.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const addNote = (columnId, itemId) => {
    if (!noteText.trim()) return;

    const newColumns = { ...columns };
    const columnItems = newColumns[columnId];
    const itemIndex = columnItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      const mentions = [];
      const mentionRegex = /@(\w+\s\w+)/g;
      let match;
      while ((match = mentionRegex.exec(noteText)) !== null) {
        mentions.push(match[1]);
      }

      columnItems[itemIndex].notes.push({
        id: Date.now(),
        text: noteText,
        mentions,
        timestamp: new Date().toLocaleString(),
      });

      setColumns(newColumns);
      setNoteText("");
      setActiveNoteCard(null);
    }
  };

  const deleteNote = (columnId, itemId, noteId) => {
    const newColumns = { ...columns };
    const columnItems = newColumns[columnId];
    const itemIndex = columnItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      columnItems[itemIndex].notes = columnItems[itemIndex].notes.filter(
        note => note.id !== noteId
      );
      setColumns(newColumns);
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-800 p-6">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(columns).map(([columnId, items]) => {
          const config = getColumnConfig(columnId);
          return (
            <div
              key={columnId}
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className={`${config.color} rounded-t-lg p-3 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded px-2 py-0.5 text-sm font-semibold">
                    {config.count}
                  </div>
                  <h2 className="text-white font-medium text-base">{config.title}</h2>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckSquare className="w-4 h-4 cursor-pointer" />
                  <BarChart3 className="w-4 h-4 cursor-pointer" />
                  <ChevronLeft className="w-4 h-4 cursor-pointer" />
                </div>
              </div>

              <div className="bg-slate-700 rounded-b-lg p-3 min-h-[400px] space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, columnId)}
                    className="bg-slate-900 rounded-lg p-3 cursor-move hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <MessageSquare 
                          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveNoteCard(activeNoteCard === item.id ? null : item.id);
                          }}
                        />
                        {item.notes.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {item.notes.length}
                          </span>
                        )}
                        <Bell className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                        <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <span className="text-gray-300 text-sm">
                        {item.email || item.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{item.date}</span>
                    </div>

                    {/* Notes Section */}
                    {activeNoteCard === item.id && (
                      <div className="mt-3 pt-3 border-t border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                          {item.notes.map((note) => (
                            <div key={note.id} className="bg-slate-800 p-2 rounded text-xs">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-gray-300 flex-1">
                                  {note.text.split(/(@\w+\s\w+)/g).map((part, i) => {
                                    if (part.startsWith('@')) {
                                      return (
                                        <span key={i} className="text-blue-400 font-medium">
                                          {part}
                                        </span>
                                      );
                                    }
                                    return part;
                                  })}
                                </p>
                                <button
                                  onClick={() => deleteNote(columnId, item.id, note.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-gray-500 text-xs">{note.timestamp}</p>
                            </div>
                          ))}
                        </div>

                        <div className="relative">
                          <textarea
                            ref={textareaRef}
                            value={noteText}
                            onChange={handleNoteChange}
                            placeholder="Add a note... Type @ to mention"
                            className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                            rows="2"
                          />
                          
                          {showMentions && filteredMembers.length > 0 && (
                            <div className="absolute bottom-full mb-1 w-full bg-slate-800 border border-gray-600 rounded shadow-lg max-h-32 overflow-y-auto z-10">
                              {filteredMembers.map((member) => (
                                <div
                                  key={member.id}
                                  onClick={() => insertMention(member)}
                                  className="px-3 py-2 hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                                >
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                    {member.avatar}
                                  </div>
                                  <div>
                                    <div className="text-white text-xs font-medium">{member.name}</div>
                                    <div className="text-gray-400 text-xs">{member.role}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => addNote(columnId, item.id)}
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;