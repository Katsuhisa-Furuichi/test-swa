import { BrowserRouter } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import type { ReactNode } from 'react';
import msalInstance from '../lib/msalInstance';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Application provider component
 * Wraps the entire application with global providers
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </MsalProvider>
  );
};
