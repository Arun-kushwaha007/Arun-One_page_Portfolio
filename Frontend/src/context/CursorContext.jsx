import { createContext, useContext } from 'react';

const CursorContext = createContext({
  cursorType: 'default',
  cursorText: '',
  setCursorType: () => {},
  setCursorText: () => {},
});

export const useCursor = () => useContext(CursorContext);

export default CursorContext;
