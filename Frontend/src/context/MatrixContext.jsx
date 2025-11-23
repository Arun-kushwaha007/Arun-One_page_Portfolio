import React, { createContext, useContext, useState } from 'react';

const MatrixContext = createContext();

export const MatrixProvider = ({ children }) => {
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  const toggleMatrixMode = () => {
    setIsMatrixMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add('matrix-mode');
      } else {
        document.body.classList.remove('matrix-mode');
      }
      return newMode;
    });
  };

  return (
    <MatrixContext.Provider value={{ isMatrixMode, setIsMatrixMode, toggleMatrixMode }}>
      {children}
    </MatrixContext.Provider>
  );
};

export const useMatrix = () => useContext(MatrixContext);
