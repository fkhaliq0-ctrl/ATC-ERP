import React, { useState } from 'react';

const APK_URL = 'https://drive.google.com/uc?export=download&id=170Li-HJrKrlPxSBGJW2KVE_8uFyLCmAJ';

const ApkDownload = () => {
  const [status, setStatus] = useState('ready');

  const handleDownload = () => {
    setStatus('downloading');
    const link = document.createElement('a');
    link.href = APK_URL;
    link.download = 'zebaish-connect.apk';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setStatus('ready'), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: 'rgba(20, 20, 40, 0.9)',
        borderRadius: '16px',
        border: '1px solid rgba(245, 200, 66, 0.2)',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Logo */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f5c842, #e6b800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '36px',
          boxShadow: '0 8px 24px rgba(245, 200, 66, 0.3)',
        }}>
          🍽️
        </div>

        {/* Title */}
        <h1 style={{
          color: '#f5c842',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: '0 0 4px',
        }}>
          Zebaish Connect
        </h1>
        <p style={{
          color: '#aaa',
          fontSize: '0.85rem',
          margin: '0 0 24px',
        }}>
          Channel Partner App
        </p>

        {/* Description */}
        <p style={{
          color: '#ccc',
          fontSize: '0.8rem',
          lineHeight: '1.6',
          margin: '0 0 28px',
        }}>
          Download the app to generate leads for Zebaish Caterers.
          <br />
          Share menus, track orders, and grow your business.
        </p>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #f5c842, #e6b800)',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 16px rgba(245, 200, 66, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 200, 66, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 200, 66, 0.3)';
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>&#x1F4E5;</span>
          Download APK
        </button>

        {/* Version Info */}
        <p style={{ color: '#555', fontSize: '0.7rem', margin: '12px 0 24px' }}>
          Version 1.0.0 • Size ~20 MB • Android 6.0+
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(245, 200, 66, 0.15)', margin: '0 0 24px' }} />

        {/* Installation Instructions */}
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ color: '#f5c842', fontSize: '0.85rem', margin: '0 0 12px' }}>
            📋 How to Install
          </h3>
          <ol style={{
            color: '#aaa',
            fontSize: '0.75rem',
            lineHeight: '2',
            paddingLeft: '18px',
            margin: 0,
          }}>
            <li>Tap <strong style={{ color: '#fff' }}>Download APK</strong> above</li>
            <li>When prompted, allow downloads from this source</li>
            <li>Open the downloaded <strong style={{ color: '#fff' }}>.apk</strong> file</li>
            <li>Tap <strong style={{ color: '#fff' }}>Install</strong> (enable "Unknown Sources" if needed)</li>
            <li>Open <strong style={{ color: '#f5c842' }}>Zebaish Connect</strong> from your app drawer</li>
          </ol>
        </div>

        {/* Footer */}
        <p style={{ color: '#444', fontSize: '0.65rem', marginTop: '24px' }}>
          © 2026 Zebaish Caterers • Allied Trading Corporation
        </p>
      </div>
    </div>
  );
};

export default ApkDownload;
