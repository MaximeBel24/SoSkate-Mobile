// contexts/NavigationContext.tsx
import { createContext, ReactNode, useContext, useState } from "react";

type NavigationContextType = {
  isTabBarVisible: boolean;
  hideTabBar: () => void;
  showTabBar: () => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const hideTabBar = () => setIsTabBarVisible(false);
  const showTabBar = () => setIsTabBarVisible(true);

  return (
    <NavigationContext.Provider
      value={{ isTabBarVisible, hideTabBar, showTabBar }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};
