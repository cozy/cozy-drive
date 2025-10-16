import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ShellContext = createContext();

export const ShellProvider = ({ children }) => {
  const [runsInShell, setRunsInShell] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  let [searchParams] = useSearchParams()

  useEffect(() => {
    const runsInShellParam = searchParams.get("runsInShell")
    if (runsInShellParam === "true") {
      setRunsInShell(true)
    }

    const selectedFileParam = searchParams.get("selectedFile")
    if (selectedFileParam && selectedFileParam.trim().length > 0) {
      setSelectedFile(selectedFileParam)
    } else if (selectedFileParam === "false") {
      setSelectedFile(null)
    }
  }, [searchParams])

  return (
    <ShellContext.Provider value={{ runsInShell, setRunsInShell, selectedFile, setSelectedFile }}>
      {children}
    </ShellContext.Provider>
  );
};

export const useShell = () => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
};