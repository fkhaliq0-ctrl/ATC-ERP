import React, { useState } from 'react';
import '../../styles/Shared.css';

const VendorMaster = () => {
  const [idType, setIdType] = useState('GST Number');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [country, setCountry] = useState('India');

  // Mock state data (in real app, this would come from an API)
  const stateData = {
    'New Delhi': { state: 'Delhi', code: '07', country: 'India' },
    'Mumbai': { state: 'Maharashtra', code: '27', country: 'India' },
    'Bangalore': { state: 'Karnataka', code: '29', country: 'India' },
    'Chennai': { state: 'Tamil Nadu', code: '33', country: 'India' },
    'Kolkata': { state: 'West Bengal', code: '19', country: 'India' },
    'Hyderabad': { state: 'Telangana', code: '36', country: 'India' },
    'Pune': { state: 'Maharashtra', code: '27', country: 'India' },
    'Ahmedabad': { state: 'Gujarat', code: '24', country: 'India' },
    'Jaipur': { state: 'Rajasthan', code: '08', country: 'India' },
    'Lucknow': { state: 'Uttar Pradesh', code: '09', country: 'India' },
    'Chandigarh': { state: 'Chandigarh', code: '04', country: 'India' },
    'Patna': { state: 'Bihar', code: '10', country: 'India' },
    'Bhopal': { state: 'Madhya Pradesh', code: '23', country: 'India' },
    'Guwahati': { state: 'Assam', code: '18', country: 'India' },
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    if (stateData[selectedCity]) {
      setState(stateData[selectedCity].state);
      setStateCode(stateData[selectedCity].code);
      setCountry(stateData[selectedCity].country);
    }
  };

  const handlePinChange = (e) => {
    const pin = e.target.value;
    setPinCode(pin);
    if (pin.startsWith('110')) {
      setCity('New Delhi');
      setState('Delhi');
      setStateCode('07');
      setCountry('India');
    } else if (pin.startsWith('400')) {
      setCity('Mumbai');
      setState('Maharashtra');
      setStateCode('27');
      setCountry('India');
    } else if (pin.startsWith('560')) {
      setCity('Bangalore');
      setState('Karnataka');
      setStateCode('29');
      setCountry('India');
    } else if (pin.startsWith('600')) {
      setCity('Chennai');
      setState('Tamil Nadu');
      setStateCode('33');
      setCountry('India');
    } else if (pin.startsWith('700')) {
      setCity('Kolkata');
      setState('West Bengal');
      setStateCode('19');
      setCountry('India');
    } else if (pin.startsWith('500')) {
      setCity('Hyderabad');
      setState('Telangana');
      setStateCode('36');
      setCountry('India');
    } else if (pin.startsWith('411')) {
      setCity('Pune');
      setState('Maharashtra');
      setStateCode('27');
      setCountry('India');
    } else if (pin.startsWith('380')) {
      setCity('Ahmedabad');
      setState('Gujarat');
      setStateCode('24');
      setCountry('India');
    } else if (pin.startsWith('302')) {
      setCity('Jaipur');
      setState('Rajasthan');
      setStateCode('08');
      setCountry('India');
    } else if (pin.startsWith('226')) {
      setCity('Lucknow');
      setState('Uttar Pradesh');
      setStateCode('09');
      setCountry('India');
    }
  };

  const getIdFieldLabel = () => {
    switch(idType) {
      case 'GST Number': return 'Enter GST Number';
      case 'PAN Card': return 'Enter PAN Card Number';
      case 'Aadhar': return 'Enter Aadhar Number';
      default: return 'Enter ID Number';
    }
  };

  const getIdPlaceholder = () => {
    switch(idType) {
      case 'GST Number': return 'e.g. 22AAAAA0000A1Z5';
      case 'PAN Card': return 'e.g. ABCDE1234F';
      case 'Aadhar': return 'e.g. 1234 5678 9012';
      default: return 'Enter ID details';
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🏢 Vendor / Supplier Master</h1>
      <p className="page-subtitle">Add and manage your vendors</p>

      <div className="card">
        <h3 className="card-title">Add New Vendor</h3>
        <form>
          <div className="form-row">
            <div className="form-group">
              <label>Vendor / Company Name *</label>
              <input type="text" placeholder="Vendor or Supplier Name" />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input type="text" placeholder="Contact person name" />
            </div>
          </div>

          <div className="form-group">
            <label>Vendor Address *</label>
            <input type="text" placeholder="Street address, plot no, building" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input 
                type="text" 
                placeholder="e.g. New Delhi" 
                value={city}
                onChange={handleCityChange}
              />
              <small style={{ color: '#888', fontSize: '12px' }}>Auto-fills State & Country</small>
            </div>
            <div className="form-group">
              <label>Pin Code</label>
              <input 
                type="text" 
                placeholder="e.g. 110001" 
                value={pinCode}
                onChange={handlePinChange}
              />
              <small style={{ color: '#888', fontSize: '12px' }}>Auto-fills City, State & Country</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State (Auto-Generated / Editable)</label>
              <input 
                type="text" 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                style={{ background: '#f8f9fa' }}
              />
            </div>
            <div className="form-group">
              <label>State Code (Auto-Generated / Editable)</label>
              <input 
                type="text" 
                value={stateCode} 
                onChange={(e) => setStateCode(e.target.value)}
                style={{ background: '#f8f9fa' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country (Auto-Generated / Editable)</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                style={{ background: '#f8f9fa' }}
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" placeholder="e.g. +91 9876543210" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ID Document Type</label>
              <select onChange={(e) => setIdType(e.target.value)}>
                <option>GST Number</option>
                <option>PAN Card</option>
                <option>Aadhar</option>
              </select>
            </div>
            <div className="form-group">
              <label>{getIdFieldLabel()}</label>
              <input type="text" placeholder={getIdPlaceholder()} />
            </div>
          </div>

          <button type="submit" className="btn-primary">Save Vendor Master</button>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">Saved Vendors List</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Contact</th>
                <th>ID Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: '#888' }}>
                  No vendors recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorMaster;
