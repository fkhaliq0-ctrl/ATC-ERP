import React, { useState } from 'react';
import './AgentPage.css';

const API_URL = 'https://atc-geca.onrender.com/api/create-inquiry/';

const AgentPage = () => {
  const [formData, setFormData] = useState({
    gender: '',
    customerName: '',
    customerPhone: '',
    customerType: 'IICC',
    religion: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

    // Create payload with correct field names for API
    const payload = {
      religion: formData.religion,
      gender: formData.gender,
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      customer_type: formData.customerType,
      greeting_used: greeting,
      status: 'New'
    };

    console.log('📤 Sending payload:', payload);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      if (response.ok) {
        setSuccess(true);
        console.log('✅ Inquiry saved successfully!');
      } else {
        setError(data.message || data.errors || 'Failed to save inquiry.');
      }
    } catch (err) {
      console.error('❌ Network error:', err);
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
              <p className="success-detail">The customer will receive a WhatsApp message with the menu link.</p>
              <button 
                className="btn-new-query" 
                onClick={() => { setSuccess(false); setFormData({ gender: '', customerName: '', customerPhone: '', customerType: 'IICC', religion: '' }); }}
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
                <label>Contact Number <span className="required">*</span></label>
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