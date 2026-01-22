import React, { useState } from 'react';
import CursorContext from './CursorContext.jsx';

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default'); // default, text, button, project, hero
  const [cursorText, setCursorText] = useState('');

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType, cursorText, setCursorText }}>
      {children}
    </CursorContext.Provider>
  );
};
