import React, { useState } from 'react';
import './AgentSetup.css';
import axios from 'axios';

const AgentSetup = ({ onComplete }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      // Save locally
      localStorage.setItem('agentPhone', cleanPhone);
      
      // Send API request to backend to register agent
      const response = await axios.post('https://atc-geca.onrender.com/api/register-agent/', {
        agent_phone: cleanPhone,
        registration_date: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        console.log('Agent registered successfully:', data);
        
        // Trigger WhatsApp verification message
        const verifyMsg = encodeURIComponent(
          `Hello Zebaish Caterers,\n\nI am registering as an Agent/Channel Partner on the Zebaish App.\n\n📱 My Registered Mobile Number: +91${cleanPhone}\n\nPlease verify my registration for lead tracking.`
        );
        const waUrl = `https://wa.me/919999950056?text=${verifyMsg}`;

        setTimeout(() => {
          window.location.href = waUrl;
          setIsVerifying(false);
          if (onComplete) onComplete();
        }, 800);
      } else {
        const errorData = response.data;
        setError(errorData.message || 'Failed to register agent. Please try again.');
        setIsVerifying(false);
      }
    } catch (err) {
      // Even if API fails, still save locally and proceed
      console.error('API Error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        stack: err.stack,
        name: err.name
      });

      const verifyMsg = encodeURIComponent(
        `Hello Zebaish Caterers,\n\nI am registering as an Agent/Channel Partner on the Zebaish App.\n\n📱 My Registered Mobile Number: +91${cleanPhone}\n\nPlease verify my registration for lead tracking.`
      );
      const waUrl = `https://wa.me/919999950056?text=${verifyMsg}`;

      setTimeout(() => {
        window.location.href = waUrl;
        setIsVerifying(false);
        if (onComplete) onComplete();
      }, 800);
    }
  };

  return (
    <div className="agent-setup-container">
      <div className="agent-setup-card">
        <div className="agent-setup-header">
          <div className="setup-brand-icon">Z</div>
          <h1>Agent Setup</h1>
          <p>Welcome to Zebaish Caterers Partner Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="agent-setup-body">
          <p className="setup-instruction">
            Please enter your mobile number to register as an Agent/Channel Partner.
            Every customer inquiry you submit will be attributed to your number.
          </p>

          <div className="setup-form-group">
            <label htmlFor="agentPhoneInput">Your Mobile Number <span className="required">*</span></label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">+91</span>
              <input
                id="agentPhoneInput"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                maxLength="10"
                required
                autoFocus
              />
            </div>
            {error && <p className="setup-error">{error}</p>}
          </div>

          <button type="submit" className="btn-setup-submit" disabled={isVerifying}>
            {isVerifying ? 'Registering & Verifying...' : '📱 Register & Verify on WhatsApp'}
          </button>
        </form>

        <div className="agent-setup-footer">
          <small>🔒 Your number is stored locally and used exclusively for lead attribution.</small>
        </div>
      </div>
    </div>
  );
};

export default AgentSetup;