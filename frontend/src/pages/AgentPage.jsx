import React, { useState } from 'react';
import './AgentPage.css';

const API_URL = 'https://atc-geca.onrender.com/api/create-inquiry/';

const AgentPage = () => {
  const [formData, setFormData] = useState({
    gender: '',
    customerName: '',
    customerPhone: '',
    customerType: 'IICC',
    religion: '',
    agentPhone: ''  // ← NEW: Agent's own phone number
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

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

    // Build greeting
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

    // Generate menu link
    const menuLink = 'https://atc-geca.onrender.com/menu';

    // Build WhatsApp message
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

    // Create payload
    const payload = {
      religion: formData.religion,
      gender: formData.gender,
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      customer_type: formData.customerType,
      agent_phone: formData.agentPhone,  // ← Save agent's phone number
      greeting_used: greeting,
      message: message,
      status: 'New'
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Create WhatsApp link with the message
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${formData.customerPhone}?text=${encodedMessage}`;
        setWhatsappLink(whatsappUrl);
        
        // Auto-open WhatsApp after 2 seconds
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 1500);
        
        console.log('✅ Inquiry saved successfully!');
      } else {
        setError(data.message || data.errors || 'Failed to save inquiry.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="agent-container">
      <div className="agent-card">
        <div className="agent-header">
          <span className="agent-logo">🍽️</span>
          <h1>Zebaish Caterers</h1>
          <p className="agent-subtitle">A unit of Allied Trading Corporation</p>
        </div>

        <div className="agent-body">
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
                <label>Your (Agent) Phone Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  name="agentPhone" 
                  value={formData.agentPhone} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 9876543210"
                  required 
                />
                <small className="field-hint">This helps us track who sent the inquiry</small>
              </div>

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