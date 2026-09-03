import React, { useState } from 'react';
import { MdClose, MdSend } from 'react-icons/md';

const SendAPKModal = ({ isOpen, onClose, onSend }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (onSend) {
      onSend(phoneNumber);
    }
    setPhoneNumber('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '16px',
        maxWidth: '480px',
        width: '100%',
        padding: '32px',
        border: '1px solid #f5c842',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          <MdClose size={24} />
        </button>

        {/* Title */}
        <h2 style={{ color: '#f5c842', fontSize: '22px', marginBottom: '8px' }}>
          Send APK to Partner
        </h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
          Enter the partner's number to send the APK download link via WhatsApp.
        </p>

        {/* Phone Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#aaa', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
            Phone Number
          </label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#0d0d0d', borderRadius: '10px', border: '1px solid #2a2a2a' }}>
            <span style={{ padding: '10px 12px', color: '#888', borderRight: '1px solid #2a2a2a' }}>+91</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9876543210"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!phoneNumber || phoneNumber.length < 10}
          style={{
            width: '100%',
            padding: '14px',
            background: phoneNumber && phoneNumber.length >= 10
              ? 'linear-gradient(135deg, #25D366, #128C7E)'
              : '#2a2a2a',
            border: 'none',
            borderRadius: '10px',
            color: phoneNumber && phoneNumber.length >= 10 ? '#fff' : '#666',
            fontSize: '16px',
            fontWeight: '700',
            cursor: phoneNumber && phoneNumber.length >= 10 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          <MdSend size={20} />
          Send via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default SendAPKModal;