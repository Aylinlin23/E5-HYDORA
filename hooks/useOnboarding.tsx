import React, { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../store/AuthContext.tsx';

interface OnboardingContextType {
  hasSeenTour: boolean;
  shouldShowTour: boolean;
  markTourAsSeen: (role: string) => void;
  resetTour: (role: string) => void;
  getTourProgress: (role: string) => 'completed' | 'not-started';
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Verificar si el usuario ya ha visto el tour
    const tourKey = `hydora-tour-${user.role}`;
    const hasSeen = localStorage.getItem(tourKey);
    
    setHasSeenTour(!!hasSeen);
    setShouldShowTour(!hasSeen);
  }, [user]);

  const markTourAsSeen = (role: string) => {
    const tourKey = `hydora-tour-${role}`;
    localStorage.setItem(tourKey, 'completed');
    setHasSeenTour(true);
    setShouldShowTour(false);
  };

  const resetTour = (role: string) => {
    const tourKey = `hydora-tour-${role}`;
    localStorage.removeItem(tourKey);
    setHasSeenTour(false);
    setShouldShowTour(true);
  };

  const getTourProgress = (role: string): 'completed' | 'not-started' => {
    const tourKey = `hydora-tour-${role}`;
    return localStorage.getItem(tourKey) ? 'completed' : 'not-started';
  };

  return (
    <OnboardingContext.Provider value={{
      hasSeenTour,
      shouldShowTour,
      markTourAsSeen,
      resetTour,
      getTourProgress
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default useOnboarding; 