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
    agentPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('agentPhone');
    if (savedPhone) {
      setFormData(prev => ({ ...prev, agentPhone: savedPhone }));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

    const menuLink = 'https://atc-geca.onrender.com/menu';

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

To customize your event, please select your preferred menu options using our convenient online link:
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
      message += `\n\n[Shared by Registered Partner: +91-${formData.agentPhone}]`;
    }

    const payload = {
      religion: formData.religion,
      gender: formData.gender,
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      customer_type: formData.customerType,
      agent_phone: formData.agentPhone,
      greeting_used: greeting,
      status: 'New'
    };

    try {
      console.log('Sending API request to:', API_URL);
      console.log('Payload:', payload);
      
      const response = await axios.post(API_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      setSuccess(true);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${formData.customerPhone}?text=${encodedMessage}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    } catch (err) {
      console.error('Network Error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        stack: err.stack,
        name: err.name
      });
      
      // More specific error messages based on error type
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your internet connection and try again.');
      } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        setError('Network connection error. Please check your internet connection and try again.');
      } else if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || err.response.data?.errors || 'Server error. Please try again later.');
      } else {
        setError(`Error: ${err.message || 'Network error. Please try again.'}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="agent-container">
      <FirstTimeSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSave={(phone) => {
          setFormData(prev => ({ ...prev, agentPhone: phone }));
          setShowSetupModal(false);
        }}
      />
      <div className="agent-card">
        <div className="agent-header">
          <span className="agent-logo">🍽️</span>
          <h1>Zebaish Caterers</h1>
          <p className="agent-subtitle">A unit of Allied Trading Corporation</p>
        </div>

        <div className="agent-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: '500' }}>
              📱 Partner: <strong>{formData.agentPhone ? `+91 ${formData.agentPhone}` : 'Not Registered'}</strong>
            </span>
            <button 
              type="button"
              onClick={() => setShowSetupModal(true)}
              style={{ background: 'none', border: '1px solid #0284c7', color: '#0284c7', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
            >
              {formData.agentPhone ? 'Change' : 'Register'}
            </button>
          </div>

          <p className="agent-welcome">Enter customer details to send a menu inquiry.</p>

          {success ? (
            <div className="success-message">
              <p>✅ Query sent successfully!</p>
              <p className="success-detail">WhatsApp is opening with the message.</p>
              <p className="success-detail">Please review and send to the customer.</p>
              <button 
                className="btn-new-query" 
                onClick={() => { 
                  setSuccess(false); 
                  setFormData({ 
                    gender: '', 
                    customerName: '', 
                    customerPhone: '', 
                    customerType: 'IICC', 
                    religion: '',
                    agentPhone: formData.agentPhone
                  }); 
                }}
              >
                Send New Query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="agent-form">
              <div className="form-group">
                <label>Customer Type (Religion) <span className="required">*</span></label>
                <select name="religion" value={formData.religion} onChange={handleInputChange} required>
                  <option value="">Select</option>
                  <option value="M">Muslim (M)</option>
                  <option value="NM">Non-Muslim (NM)</option>
                </select>
                <small className="field-hint">Determines greeting: "Assalamu Alaikum" or "Warm Greetings"</small>
              </div>

              <div className="form-group">
                <label>Gender <span className="optional">(Optional)</span></label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>

              <div className="form-group">
                <label>Customer Name <span className="optional">(Optional)</span></label>
                <input 
                  type="text" 
                  name="customerName" 
                  value={formData.customerName} 
                  onChange={handleInputChange} 
                  placeholder="Enter customer name"
                />
              </div>

              <div className="form-group">
                <label>Customer Contact Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  name="customerPhone" 
                  value={formData.customerPhone} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 9876543210"
                  required 
                />
              </div>

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
                    Non-IICC Customer
                  </label>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Sending...' : '📩 Send Query to Customer'}
              </button>
            </form>
          )}
        </div>

        <div className="agent-footer">
          <p>🔒 All data is secure and stored in your ERP system.</p>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;