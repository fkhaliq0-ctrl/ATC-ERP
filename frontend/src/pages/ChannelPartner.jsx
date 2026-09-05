import React, { useState, useEffect } from 'react';
import { MdRestaurant, MdPhone, MdPerson, MdCake, MdLocationOn, MdSend, MdLock, MdCheckCircle, MdError, MdEdit } from 'react-icons/md';
import FirstTimeSetupModal from '../components/FirstTimeSetupModal';
import './ChannelPartner.css';

const MENU_LINK = 'http://localhost:9999/menu-selection';

const ChannelPartner = () => {
  const [formData, setFormData] = useState({
    religion: '',
    gender: '',
    customerName: '',
    customerPhone: '',
    customerType: 'IICC',
    agentPhone: ''
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const phone = localStorage.getItem('agentPhone');
    if (phone) {
      setFormData(prev => ({ ...prev, agentPhone: phone }));
      setIsRegistered(true);
    } else {
      setShowRegistration(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? (checked ? value : prev[name]) : value
    }));
    setError('');
  };

  const handleRegistrationSave = (phone) => {
    setFormData(prev => ({ ...prev, agentPhone: phone }));
    setIsRegistered(true);
    setShowRegistration(false);
  };

  const handleChangePartner = () => {
    setShowRegistration(true);
  };

  const buildWhatsAppMessage = () => {
    const greeting = formData.religion === 'M'
      ? 'Assalamu Alaikum'
      : 'Warm Greetings';
    const genderPrefix = formData.gender ? formData.gender + ' ' : '';
    const customerDisplay = formData.customerName
      ? genderPrefix + formData.customerName
      : 'Valued Customer';
    const venueText = formData.customerType === 'IICC'
      ? 'IICC Premium Customer'
      : 'Special Guest';
    const lines = [
      greeting, '',
      'Dear ' + customerDisplay + ',', '',
      'Thank you for your interest in Zebaish Caterers \u2014 a unit of Allied Trading Corporation.', '',
      'We are pleased to share our curated menu for your upcoming event.',
      'Please review and select your preferred items:', '',
      'View & Select Menu:', MENU_LINK, '',
      'Customer Type: ' + venueText,
      'Contact: +91 ' + formData.customerPhone, '',
      'For any queries, feel free to reach out.', '',
      'Best Regards,', 'Zebaish Caterers Team', '+91 99999 50056'
    ];
    return lines.join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isRegistered) { setShowRegistration(true); return; }
    if (!formData.customerPhone || formData.customerPhone.length < 10) {
      setError('Please enter a valid 10-digit customer phone number');
      return;
    }
    setSubmitting(true);
    const message = buildWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = 'https://wa.me/91' + formData.customerPhone + '?text=' + encodedMessage;
    try { window.location.href = whatsappUrl; } catch (err) { console.error(err); }
    setTimeout(() => { setSubmitting(false); setSubmitted(true); setTimeout(() => setSubmitted(false), 5000); }, 1000);
  };

  return (
    <div className="cp-container">
      {showRegistration && <FirstTimeSetupModal isOpen={showRegistration} onClose={() => setShowRegistration(false)} onSave={handleRegistrationSave} />}
      <div className="cp-card">
        <div className="cp-header">
          <div className="cp-logo"><MdRestaurant size={40} color="#f5c842" /></div>
          <h1>Zebaish <span>Caterers</span></h1>
          <p className="cp-subtitle">A unit of Allied Trading Corporation</p>
        </div>
        <div className="cp-divider"></div>
        {isRegistered && (
          <div className="cp-partner-card">
            <div className="cp-partner-left">
              <MdPhone size={16} color="#f5c842" />
              <span className="cp-partner-label">Channel Partner: <strong>+91 {formData.agentPhone}</strong></span>
            </div>
            <button className="cp-partner-change" onClick={handleChangePartner}><MdEdit size={12} /> Change</button>
          </div>
        )}
        <div className="cp-section-title">
          <MdPerson size={18} color="#f5c842" />
          <span>Enter Customer Details</span>
          <div className="cp-section-line"></div>
        </div>
        <form onSubmit={handleSubmit} className="cp-form">
          <div className="cp-field">
            <label>Customer Type (Religion) <span className="cp-required">*</span></label>
            <select name="religion" value={formData.religion} onChange={handleChange} required>
              <option value="">Select Religion</option>
              <option value="M">Muslim (M)</option>
              <option value="NM">Non-Muslim (NM)</option>
            </select>
            <small className="cp-hint">Determines greeting: Assalamu Alaikum or Warm Greetings</small>
          </div>
          <div className="cp-field">
            <label><MdCake size={14} color="#888" /> Gender <span className="cp-optional">(Optional)</span></label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
            </select>
          </div>
          <div className="cp-field">
            <label><MdPerson size={14} color="#888" /> Customer Name <span className="cp-optional">(Optional)</span></label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Enter customer name" />
          </div>
          <div className="cp-field">
            <label><MdPhone size={14} color="#888" /> Customer Contact Number <span className="cp-required">*</span></label>
            <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="e.g., 9876543210" required maxLength={10} />
          </div>
          <div className="cp-field">
            <label><MdLocationOn size={14} color="#888" /> Customer Type</label>
            <div className="cp-radio-group">
              <label className={'cp-radio' + (formData.customerType === 'IICC' ? ' cp-radio-active' : '')}>
                <input type="radio" name="customerType" value="IICC" checked={formData.customerType === 'IICC'} onChange={handleChange} />
                <span className="cp-radio-dot"></span>
                <span className="cp-radio-text">IICC Customer</span>
              </label>
              <label className={'cp-radio' + (formData.customerType === 'NonIICC' ? ' cp-radio-active' : '')}>
                <input type="radio" name="customerType" value="NonIICC" checked={formData.customerType === 'NonIICC'} onChange={handleChange} />
                <span className="cp-radio-dot"></span>
                <span className="cp-radio-text">Non-IICC Customer</span>
              </label>
            </div>
          </div>
          {error && <div className="cp-error"><MdError size={16} /> {error}</div>}
          {submitted && <div className="cp-success"><MdCheckCircle size={16} /> WhatsApp message sent successfully!</div>}
          <button type="submit" className="cp-submit" disabled={submitting || !isRegistered}>
            {!isRegistered ? 'Register First' : submitting ? 'Sending...' : 'Send Query to Customer'}
          </button>
        </form>
        <div className="cp-footer">
          <MdLock size={12} color="#666" />
          <p>All data is secure and stored in your ERP system.</p>
        </div>
      </div>
    </div>
  );
};

export default ChannelPartner;
