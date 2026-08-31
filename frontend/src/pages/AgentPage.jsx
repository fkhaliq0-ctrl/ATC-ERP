import React, { useState, useEffect } from 'react';
import './AgentPage.css';
import { useNavigate } from 'react-router-dom';
import FirstTimeSetupModal from '../components/FirstTimeSetupModal';
import axios from 'axios';

const API_URL = 'https://atc-geca.onrender.com/api/create-inquiry/';

const AgentPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gender: '',
    customerName: '',
    customerPhone: '',
    customerType: 'IICC',
    religion: '',
    agentPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('agentPhone');
    if (savedPhone) {
      setFormData(prev => ({ ...prev, agentPhone: savedPhone }));
      setIsRegistered(true);
    } else {
      // Force registration on first visit
      setShowSetupModal(true);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const buildWhatsAppMessage = () => {
    let greeting = '';
    if (formData.religion === 'M') {
      greeting = 'Assalamu Alaikum';
    } else if (formData.religion === 'NM') {
      greeting = 'Warm Greetings';
    } else {
      greeting = 'Hello';
    }

    if (formData.customerName && formData.gender === 'Mr.') {
      greeting += ` Mr. ${formData.customerName}`;
    } else if (formData.customerName && formData.gender === 'Ms.') {
      greeting += ` Ms. ${formData.customerName}`;
    } else if (formData.customerName) {
      greeting += ` ${formData.customerName}`;
    } else {
      greeting += ` Dear Sir/Madam`;
    }

    const menuLink = 'https://zebaish-menu.onrender.com/menu-selection';

    let message = '';
    if (formData.customerType === 'IICC') {
      message = `${greeting},

Zebaish Caterers extends warmest congratulations to you on your upcoming event at the India Islamic Cultural Centre, New Delhi.

We are honored to be an empanelled caterer & event organizer at IICC and would love to be a part of your special day.

We specialize in Authentic Indian, Mughlai & Vegetarian Cuisine, curated with Delhi's finest chefs to deliver:
✅ Exceptional Taste
✅ Unparalleled Quality
✅ Impeccable Presentation & Service

You can explore our work here:
📷 https://www.instagram.com/zebaish.caterers

To personalize your event, please select your preferred menu options using our convenient online link:
🔗 ${menuLink}

For any queries:
📞 +91 99999 50056
📞 +91 98999 54606

Zebaish Caterers
Empanelled Caterer & Event Organizer - IICC, New Delhi`;
    } else {
      message = `${greeting},

Zebaish Caterers extends warm congratulations on your upcoming event!

We are honored to introduce our exceptional catering services. Specializing in authentic Indian, Mughlai, and vegetarian cuisine, we partner with Delhi's finest chefs to deliver:
✅ Exceptional taste
✅ Unparalleled quality
✅ Immaculate presentation

Explore our Instagram page for culinary inspiration:
📷 https://www.instagram.com/zebaish.caterers

To personalize your event, please select your preferred menu options using our convenient online link:
🔗 ${menuLink}

Contact Us:
📞 +91 99999 50056 | 📞 +91 98999 54606

Zebaish Caterers — A Unit of Allied Trading Corporation`;
    }

    if (formData.agentPhone) {
      message += `\n\n[Shared by Registered Channel Partner: +91-${formData.agentPhone}]`;
    }

    return message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.religion) {
      setError('Please select Customer Type (Religion)');
      setLoading(false);
      return;
    }
    if (!formData.customerPhone) {
      setError('Please enter Customer Contact Number');
      setLoading(false);
      return;
    }

    try {
      const message = buildWhatsAppMessage();
      
      // STEP 1: Open WhatsApp IMMEDIATELY
      const encodedMessage = encodeURIComponent(message);
      const cleanPhone = formData.customerPhone.replace(/[^0-9]/g, '');
      const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
      window.location.href = whatsappUrl;
      
      setSuccess(true);

      // STEP 2: Save to API in background
      try {
        const payload = {
          religion: formData.religion,
          gender: formData.gender,
          customer_name: formData.customerName || 'Walk-in Customer',
          customer_phone: formData.customerPhone,
          customer_type: formData.customerType,
          agent_phone: formData.agentPhone,
          message: message,
          status: 'New'
        };

        await axios.post(API_URL, payload, {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          timeout: 10000,
        });
        console.log('✅ Inquiry saved to backend');
      } catch (apiError) {
        console.log('⚠️ API save failed, but WhatsApp message was sent:', apiError.message);
      }

      setTimeout(() => {
        setSuccess(false);
        setFormData({
          gender: '',
          customerName: '',
          customerPhone: '',
          customerType: 'IICC',
          religion: '',
          agentPhone: formData.agentPhone,
        });
      }, 5000);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="agent-container">
      <FirstTimeSetupModal
        isOpen={showSetupModal}
        onClose={() => {
          // Only allow closing if already registered
          if (isRegistered) setShowSetupModal(false);
        }}
        onSave={(phone) => {
          setFormData(prev => ({ ...prev, agentPhone: phone }));
          setIsRegistered(true);
          setShowSetupModal(false);
        }}
      />
      <div className="agent-card">
        {/* ── Header ── */}
        <div className="agent-header">
          <div className="agent-logo">🍽️</div>
          <h1>Zebaish Caterers</h1>
          <p className="agent-subtitle">A unit of Allied Trading Corporation</p>
        </div>

        <div className="agent-divider" />

        {/* ── Body ── */}
        <div className="agent-body">
          {/* Partner Info */}
          <div className="partner-info">
            <span className="partner-label">
              📱 Channel Partner: <strong>{formData.agentPhone ? `+91 ${formData.agentPhone}` : 'Not Registered'}</strong>
            </span>
            <button className="partner-change-btn" onClick={() => setShowSetupModal(true)}>
              {formData.agentPhone ? 'Change' : 'Register'}
            </button>
          </div>

          {success ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <p className="success-title">Query sent successfully!</p>
              <p className="success-detail">WhatsApp is opening with the message.</p>
              <p className="success-detail">Please review and send to the customer.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="agent-form">
              {/* Section Title */}
              <div className="section-title">
                <span>📋 Enter Customer Details</span>
                <div className="section-divider" />
              </div>

              {/* Customer Type */}
              <div className="form-group">
                <label>Customer Type <span className="required">*</span></label>
                <select name="religion" value={formData.religion} onChange={handleInputChange} required>
                  <option value="">— Select Customer Type —</option>
                  <option value="M">Muslim (M)</option>
                  <option value="NM">Non-Muslim (NM)</option>
                </select>
                <small className="field-hint">Determines greeting: "Assalamu Alaikum" or "Warm Greetings"</small>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label>Gender <span className="optional">(Optional)</span></label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">— Select Gender —</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>

              {/* Customer Name */}
              <div className="form-group">
                <label>Customer Name <span className="optional">(Optional)</span></label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter customer's full name"
                />
              </div>

              {/* Customer Contact */}
              <div className="form-group">
                <label>Customer Contact Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="e.g., 98765 43210"
                  required
                />
              </div>

              {/* Venue Type - Radio Buttons */}
              <div className="form-group">
                <label>Venue Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="customerType"
                      value="IICC"
                      checked={formData.customerType === 'IICC'}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom" />
                    IICC Customer
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="customerType"
                      value="NonIICC"
                      checked={formData.customerType === 'NonIICC'}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom" />
                    Non-IICC Customer
                  </label>
                </div>
              </div>

              {error && <div className="error-message">⚠️ {error}</div>}

              {/* Submit Button */}
              <button type="submit" className="btn-submit" disabled={loading || !isRegistered}>
                {loading ? '⏳ Sending...' : !isRegistered ? '🔒 Register First' : '📩 Send Query to Customer'}
              </button>
            </form>
          )}
        </div>

        <div className="agent-divider" />

        {/* ── Footer ── */}
        <div className="agent-footer">
          <p>🔒 All data is secure and stored in your ERP system.</p>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
/ /   F o r c e   r e b u i l d 
 
 
