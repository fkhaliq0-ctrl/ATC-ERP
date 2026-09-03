import React, { useState } from 'react';

const SendAPKModal = ({ open, onClose }) => {
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setSending(true);
    const message = `Download Zebaish Connect APK:
https://zebaish-menu.onrender.com/zebaish-connect.apk`;

    // Use window.location.href for Android/Capacitor compatibility
    window.location.href = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    setSending(false);
    onClose();
  };

  return (
    <div className="send-apk-overlay" onClick={onClose}>
      <div className="send-apk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="send-apk-header">
          <h2>📱 Send APK to Channel Partner</h2>
          <button className="send-apk-close" onClick={onClose}>✕</button>
        </div>
        <div className="send-apk-body">
          <p>Enter the channel partner's phone number to send the APK download link via WhatsApp.</p>
          <div className="send-apk-input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>
        <div className="send-apk-footer">
          <button className="send-apk-cancel" onClick={onClose}>Cancel</button>
          <button className="send-apk-send" onClick={handleSend} disabled={sending || !phone}>
            {sending ? 'Sending...' : '📤 Send APK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendAPKModal;

