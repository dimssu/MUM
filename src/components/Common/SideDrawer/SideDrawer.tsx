import React, { useEffect, ReactNode } from 'react';
import styles from './SideDrawer.module.scss';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  width?: string;
  drawerContainerStyle?: React.CSSProperties;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  width = '400px',
  drawerContainerStyle,
}) => {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Close drawer on escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  return (
    <div className={styles.drawerContainer} style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className={styles.backdrop} onClick={onClose} />
      <div 
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        style={{ width }}
      >
        <div className={styles.drawerHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className={styles.drawerContent} style={drawerContainerStyle}>
          {children}
        </div>
        
        {(primaryButtonText || secondaryButtonText) && (
          <div className={styles.drawerFooter}>
            {secondaryButtonText && (
              <button 
                className={styles.secondaryButton} 
                onClick={onSecondaryClick || onClose}
              >
                {secondaryButtonText}
              </button>
            )}
            {primaryButtonText && (
              <button 
                className={styles.primaryButton} 
                onClick={onPrimaryClick}
              >
                {primaryButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;
