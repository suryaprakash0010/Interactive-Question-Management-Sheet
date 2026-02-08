import { useEffect } from 'react';
import { matchesShortcut, keyboardShortcuts } from '../utils/helpers';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      Object.entries(shortcuts).forEach(([shortcut, handler]) => {
        if (matchesShortcut(e, shortcut)) {
          e.preventDefault();
          e.stopPropagation();
          handler();
        }
      });
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default useKeyboardShortcuts;
