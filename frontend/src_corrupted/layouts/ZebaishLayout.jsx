import React from 'react';
import { Outlet } from 'react-router-dom';

const ZebaishLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0a0e1a',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        padding: '0 10px'
      }}>
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default ZebaishLayout;
