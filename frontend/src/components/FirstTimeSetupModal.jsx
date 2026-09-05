import React, { useState } from 'react';

const FirstTimeSetupModal = ({ isOpen, onClose, onSave }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    localStorage.setItem('agentPhone', cleanPhone);
    onSave(cleanPhone);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Register as Channel Partner</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
          Enter your mobile number to register as an Agent/Channel Partner.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>
              Mobile Number <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#0d0d0d',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}
              required
            />
            {error && <p style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '4px' }}>{error}</p>}
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #f5c842, #d4a017)',
              border: 'none',
              borderRadius: '10px',
              color: '#0a0a0a',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Save & Verify on WhatsApp
          </button>
        </form>
        <p style={{ color: '#555', fontSize: '12px', marginTop: '16px', textAlign: 'center' }}>
          🔒 Your number is stored locally and used exclusively for lead attribution.
        </p>
      </div>
    </div>
  );
};

export default FirstTimeSetupModal;
