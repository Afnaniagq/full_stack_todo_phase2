import { useEffect, useRef } from 'react';

interface UseKeyboardNavOptions {
  onEscape?: () => void;
  onSelectAll?: () => void;
  onSubmit?: () => void;
}

const useKeyboardNav = (options: UseKeyboardNavOptions = {}) => {
  const { onEscape, onSelectAll, onSubmit } = options;
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }

      // Handle Ctrl/Cmd + A for select all
      if ((event.ctrlKey || event.metaKey) && event.key === 'a' && onSelectAll) {
        event.preventDefault();
        onSelectAll();
      }

      // Handle Enter key for submit
      if (event.key === 'Enter' && onSubmit) {
        event.preventDefault();
        onSubmit();
      }
    };

    // Add event listener to the window
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, onSelectAll, onSubmit]);

  return elementRef;
};

export default useKeyboardNav;