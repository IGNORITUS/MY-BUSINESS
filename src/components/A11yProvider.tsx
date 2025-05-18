import React, { createContext, useContext, useEffect, useRef } from 'react';

interface A11yContextType {
  focusTrap: (element: HTMLElement) => void;
  focusFirstInteractive: (element: HTMLElement) => void;
  announceToScreenReader: (message: string) => void;
}

const A11yContext = createContext<A11yContextType | null>(null);

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  return context;
};

interface A11yProviderProps {
  children: React.ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0 0 0 0)';
    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    return () => {
      document.body.removeChild(liveRegion);
    };
  }, []);

  const focusTrap = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstFocusable.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  };

  const focusFirstInteractive = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };

  const announceToScreenReader = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  };

  const value = {
    focusTrap,
    focusFirstInteractive,
    announceToScreenReader,
  };

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
};

// Keyboard navigation hook
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          onEnter?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
        case 'ArrowUp':
          onArrowUp?.();
          break;
        case 'ArrowDown':
          onArrowDown?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onEscape, onArrowUp, onArrowDown]);
};

// Skip link component
export const SkipLink: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.removeAttribute('tabindex');
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: '#000',
        color: 'white',
        padding: '8px',
        zIndex: 100,
        transition: 'top 0.3s',
      }}
      onFocus={() => {
        const element = document.querySelector('.skip-link') as HTMLElement;
        if (element) {
          element.style.top = '0';
        }
      }}
      onBlur={() => {
        const element = document.querySelector('.skip-link') as HTMLElement;
        if (element) {
          element.style.top = '-40px';
        }
      }}
    >
      Skip to main content
    </a>
  );
}; 