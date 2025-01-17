import { createContext, useContext } from 'react';

interface HotkeysContextType {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  openSettings: () => void;
  handleLogout: () => void;
}

const HotkeysContext = createContext<HotkeysContextType | undefined>(undefined);

export const useHotkeysContext = () => {
  const context = useContext(HotkeysContext);
  if (!context) {
    throw new Error('useHotkeysContext must be used within a HotkeysProvider');
  }
  return context;
};

interface HotkeysProviderProps {
  children: React.ReactNode;
  value: HotkeysContextType;
}

export const HotkeysProvider = ({ children, value }: HotkeysProviderProps) => {
  return (
    <HotkeysContext.Provider value={value}>
      {children}
    </HotkeysContext.Provider>
  );
};