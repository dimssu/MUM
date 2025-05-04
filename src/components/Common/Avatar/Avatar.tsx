import { FC } from 'react';
import styles from './Avatar.module.scss';

// Default avatar SVG component
const DefaultAvatarSvg = () => (
  <svg
    width="12px"
    height="12px"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
  >
    <rect width="12px" height="12px" fill="#E5E7EB" />
    <path
      d="M40 36C45.5228 36 50 31.5228 50 26C50 20.4772 45.5228 16 40 16C34.4772 16 30 20.4772 30 26C30 31.5228 34.4772 36 40 36Z"
      fill="#9CA3AF"
    />
    <path
      d="M54 60C54 51.1634 47.732 44 40 44C32.268 44 26 51.1634 26 60V64H54V60Z"
      fill="#9CA3AF"
    />
  </svg>
);

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ 
  src, 
  alt = 'User avatar', 
  size = 'medium',
  className = ''
}) => {
  // Determine the size in pixels
  let sizeInPx: number;
  if (typeof size === 'number') {
    sizeInPx = size;
  } else {
    switch (size) {
      case 'small':
        sizeInPx = 32;
        break;
      case 'large':
        sizeInPx = 64;
        break;
      case 'medium':
      default:
        sizeInPx = 40;
        break;
    }
  }

  // If no src is provided, render the default avatar SVG
  if (!src) {
    return (
      <div 
        className={`${styles.avatar} ${className}`}
        style={{ width: `${sizeInPx}px`, height: `${sizeInPx}px` }}
        aria-label={alt}
      >
        <DefaultAvatarSvg />
      </div>
    );
  }

  // Otherwise render the image
  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.avatar} ${className}`}
      style={{ width: `${sizeInPx}px`, height: `${sizeInPx}px` }}
    />
  );
};

export default Avatar; 