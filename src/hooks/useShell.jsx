import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BarLeft, BarCenter, BarRight, BarSearch } from 'cozy-bar'
import { navigateToModal } from '@/modules/actions/helpers';

const ShellContext = createContext();

export const ShellProvider = ({ children }) => {
  const navigate = useNavigate();

  const [runsInShell, setRunsInShell] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    window.top.postMessage('loaded', '*')

    window.onmessage = function (e) {
      if (e.data == undefined || e.data == null || typeof e.data !== "string") return;
      if (e.data === "inShell:true") {
        setRunsInShell(true)
        console.log("Set runsInShell to true from parent")
      }
      if (e.data.startsWith("selectedFile:")) {
        const fileId = e.data.split("selectedFile:")[1].trim();
        console.log("Set selectedFile to " + fileId + " from parent")
        setSelectedFile(fileId)
      }
      if (e.data.startsWith("openFolder:")) {
        const folderId = e.data.split("openFolder:")[1].trim();
        console.log("Set folderId to " + folderId + " from parent")
        navigate(`/folder/${folderId}`);
      }
    };
  }, [])

  // if runs in shell, add global CSS
  if (runsInShell) {
    const CSS = `
      .coz-bar-container nav, .coz-bar-container a {
        display: none !important;
      }

      .coz-bar-container button[aria-label="Rechercher"] {
        margin-right: -12px;
      }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(CSS));
    document.head.appendChild(style);
  }

  const openFileInParent = (file) => {
    window.top.postMessage('openFile:' + file.metadata.externalId, '*')
  }

  if(!runsInShell) {
    return children;
  }

  return (
    <ShellContext.Provider value={{ runsInShell, setRunsInShell, selectedFile, setSelectedFile, openFileInParent }}>
      {runsInShell && (
        <BarLeft>
          <div style={{ width: 12 }}></div>
        </BarLeft>
      )}

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