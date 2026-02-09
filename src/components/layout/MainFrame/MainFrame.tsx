import React, { type ReactNode } from 'react';
import styles from './MainFrame.module.css';

interface MainFrameProps {
  children: ReactNode;
}

/**
 * Main content area layout frame
 * Provides the structure for the main content area
 */
export const MainFrame: React.FC<MainFrameProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
