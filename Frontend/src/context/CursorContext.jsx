import { createContext, useContext } from 'react';

const CursorContext = createContext({
  cursorType: 'default',
  cursorText: '',
  setCursorType: () => {},
  setCursorText: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCursor = () => useContext(CursorContext);

export default CursorContext;
