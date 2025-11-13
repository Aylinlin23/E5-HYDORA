import React from 'react';

export const IconWrapper: React.FC<{size?: number, children: React.ReactNode}> = ({ size = 18, children }) => (
  <span style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </span>
);

export const LocationIcon: React.FC<{size?: number}> = ({ size = 18 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2.5" fill="currentColor" />
    </svg>
  </IconWrapper>
);

export const CalendarIcon: React.FC<{size?: number}> = ({ size = 18 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </IconWrapper>
);

export const MapIcon: React.FC<{size?: number}> = ({ size = 18 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6l6-2v13l-6 2V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M3 8l6-2v13L3 21V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M15 4l6-2v13l-6 2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  </IconWrapper>
);

export const PencilIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21l3-1 11-11 2 2-11 11-1 3H3z" fill="currentColor"/>
      <path d="M14.5 6.5l3 3" stroke="#fff" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  </IconWrapper>
);

export const DocumentIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const ClipboardIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  </IconWrapper>
);

export const LogoutIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const EyeIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  </IconWrapper>
);

export const SearchIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </IconWrapper>
);

export const PlusIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const DownloadIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const CheckIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const WarningIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </IconWrapper>
);

export const TrashIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </IconWrapper>
);

export const UsersIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const MapPinIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </svg>
  </IconWrapper>
);

export const DropIcon: React.FC<{size?: number}> = ({ size = 18 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2s5 5.5 5 9.5A5 5 0 0 1 7 11.5C7 7.5 12 2 12 2z" fill="currentColor" />
    </svg>
  </IconWrapper>
);

export const PhoneIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.97.34 1.92.65 2.83a2 2 0 0 1-.45 2.11L8.91 9.91a14.05 14.05 0 0 0 6 6l1.25-1.25a2 2 0 0 1 2.11-.45c.9.31 1.86.53 2.83.65A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const CameraIcon: React.FC<{size?: number}> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

// Backwards-compatible alias: some pages import `MapSvg`.
// Keep this alias to avoid runtime errors when modules expect MapSvg.
export const MapSvg = MapIcon;
