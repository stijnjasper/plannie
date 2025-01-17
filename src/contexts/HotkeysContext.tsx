import { createContext, useContext, ReactNode } from 'react';

interface HotkeysContextType {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  openSettings: () => void;
  handleLogout: () => void;
}

const HotkeysContext = createContext<HotkeysContextType | null>(null);

export const useHotkeys = () => {
  const context = useContext(HotkeysContext);
  if (!context) {
    throw new Error('useHotkeys must be used within a HotkeysProvider');
  }
  return context;
};

interface HotkeysProviderProps {
  children: ReactNode;
  value: HotkeysContextType;
}

export const HotkeysProvider = ({ children, value }: HotkeysProviderProps) => {
  return (
    <HotkeysContext.Provider value={value}>
      {children}
    </HotkeysContext.Provider>
  );
};