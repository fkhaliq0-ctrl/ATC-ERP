import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://atc-geca.onrender.com/api';

const VendorMaster = () => {
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [idType, setIdType] = useState('GST Number');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [vendorNo, setVendorNo] = useState('');

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

  const pinCodeData = {
    '110001': { city: 'New Delhi', state: 'Delhi', code: '07', country: 'India' },
    '400001': { city: 'Mumbai', state: 'Maharashtra', code: '27', country: 'India' },
    '560001': { city: 'Bangalore', state: 'Karnataka', code: '29', country: 'India' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', code: '33', country: 'India' },
    '700001': { city: 'Kolkata', state: 'West Bengal', code: '19', country: 'India' },
    '500001': { city: 'Hyderabad', state: 'Telangana', code: '36', country: 'India' },
    '411001': { city: 'Pune', state: 'Maharashtra', code: '27', country: 'India' },
    '380001': { city: 'Ahmedabad', state: 'Gujarat', code: '24', country: 'India' },
    '302001': { city: 'Jaipur', state: 'Rajasthan', code: '08', country: 'India' },
    '226001': { city: 'Lucknow', state: 'Uttar Pradesh', code: '09', country: 'India' },
  };

  useEffect(() => {
    fetchVendors();
    generateVendorNo();
  }, []);

  const generateVendorNo = () => {
    const count = vendors.length + 1;
    setVendorNo('VEN-' + String(count).padStart(4, '0'));
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(API_BASE + '/vendors/');
      setVendors(response.data || []);
      generateVendorNo();
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
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
    if (pinCodeData[pin]) {
      const data = pinCodeData[pin];
      setCity(data.city);
      setState(data.state);
      setStateCode(data.code);
      setCountry(data.country);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = {
        vendor_no: vendorNo,
        vendor_name: document.getElementById('vendorName').value,
        contact_person: document.getElementById('contactPerson').value,
        address: document.getElementById('address').value,
        city: city,
        pin_code: pinCode,
        state: state,
        state_code: stateCode,
        country: country,
        phone: document.getElementById('phone').value,
        email: email,
        gstin: document.getElementById('idNumber').value,
        pan: idType === 'PAN Card' ? document.getElementById('idNumber').value : '',
        bank_name: bankName,
        bank_account: bankAccount,
        ifsc_code: ifscCode,
      };
      const url = editingId ? API_BASE + '/vendors/' + editingId + '/' : API_BASE + '/vendors/';
      const method = editingId ? 'put' : 'post';
      await axios[method](url, formData);
      alert(editingId ? 'Vendor updated!' : 'Vendor saved!');
      resetForm();
      fetchVendors();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    if (!isSuperUser) {
      alert('Only Super User can edit.');
      return;
    }
    setEditingId(vendor.id);
    setVendorNo(vendor.vendor_no);
    setCity(vendor.city || '');
    setPinCode(vendor.pin_code || '');
    setState(vendor.state || '');
    setStateCode(vendor.state_code || '');
    setCountry(vendor.country || 'India');
    setEmail(vendor.email || '');
    setBankName(vendor.bank_name || '');
    setBankAccount(vendor.bank_account || '');
    setIfscCode(vendor.ifsc_code || '');
    document.getElementById('vendorName').value = vendor.vendor_name || '';
    document.getElementById('contactPerson').value = vendor.contact_person || '';
    document.getElementById('address').value = vendor.address || '';
    document.getElementById('phone').value = vendor.phone || '';
    document.getElementById('idNumber').value = vendor.gstin || vendor.pan || '';
  };

  const handleDelete = async (id) => {
    if (!isSuperUser) {
      alert('Only Super User can delete.');
      return;
    }
    if (window.confirm('Delete this vendor?')) {
      try {
        await axios.delete(API_BASE + '/vendors/' + id + '/');
        alert('Vendor deleted!');
        fetchVendors();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCity('');
    setPinCode('');
    setState('');
    setStateCode('');
    setCountry('India');
    setEmail('');
    setBankName('');
    setBankAccount('');
    setIfscCode('');
    document.getElementById('vendorName').value = '';
    document.getElementById('contactPerson').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('idNumber').value = '';
    generateVendorNo();
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>🏢 Vendor / Supplier Master</h1>
            <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Add and manage your vendors/suppliers</p>
          </div>
          {isSuperUser && <span style={{ padding: '4px 14px', backgroundColor: '#ff9800', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>🔒 Super User</span>}
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a237e', marginBottom: '16px', borderBottom: '2px solid #e8eaf6', paddingBottom: '12px' }}>
            {editingId ? '✏️ Edit Vendor' : '➕ Add New Vendor'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.8fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Vendor No.</label>
                <input value={vendorNo} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f0f0f0', color: '#666', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Vendor / Company Name *</label>
                <input id="vendorName" placeholder="Company or Individual Name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Contact Person</label>
                <input id="contactPerson" placeholder="Contact person name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Vendor Address *</label>
              <input id="address" placeholder="Street address, plot no, building" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>City</label>
                <input type="text" value={city} onChange={handleCityChange} placeholder="e.g. New Delhi" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '10px' }}>Auto-fills State & Country</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Pin Code</label>
                <input type="text" value={pinCode} onChange={handlePinChange} placeholder="e.g. 110001" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '10px' }}>Auto-fills City, State & Country</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>State Code</label>
                <input type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Contact Number</label>
                <input id="phone" placeholder="e.g. +91 9876543210" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Email (Optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vendor@example.com" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>ID Document Type</label>
                <select value={idType} onChange={(e) => setIdType(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  <option>GST Number</option>
                  <option>PAN Card</option>
                  <option>Aadhar</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>{getIdFieldLabel()}</label>
                <input id="idNumber" placeholder={getIdPlaceholder()} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Account No.</label>
                <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="Account number" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>IFSC Code</label>
                <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="SBIN0001234" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? '⏳ Saving...' : editingId ? '✏️ Update' : '💾 Save Vendor Master'}
              </button>
              {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>}
              <button type="button" onClick={resetForm} style={{ padding: '10px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>➕ Add New</button>
            </div>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a237e', marginBottom: '12px', borderBottom: '2px solid #e8eaf6', paddingBottom: '12px' }}>📋 Saved Vendors ({vendors.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555', fontSize: '12px' }}>Vendor ID</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555', fontSize: '12px' }}>Name</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555', fontSize: '12px' }}>Contact</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555', fontSize: '12px' }}>City</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555', fontSize: '12px' }}>Phone</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555', fontSize: '12px' }}>GSTIN</th>
                  {isSuperUser && <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555', fontSize: '12px' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr><td colSpan={isSuperUser ? 7 : 6} style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No vendors recorded yet.</td></tr>
                ) : (
                  vendors.map((ven, index) => (
                    <tr key={ven.id || index} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '10px 12px' }}>{ven.vendor_no || 'VEN-' + String(index + 1).padStart(4, '0')}</td>
                      <td style={{ padding: '10px 12px' }}>{ven.vendor_name}</td>
                      <td style={{ padding: '10px 12px' }}>{ven.contact_person || '-'}</td>
                      <td style={{ padding: '10px 12px' }}>{ven.city || '-'}</td>
                      <td style={{ padding: '10px 12px' }}>{ven.phone || '-'}</td>
                      <td style={{ padding: '10px 12px' }}>{ven.gstin || '-'}</td>
                      {isSuperUser && (
                        <td style={{ padding: '10px 12px' }}>
                          <button onClick={() => handleEdit(ven)} style={{ padding: '4px 12px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginRight: '6px' }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(ven.id)} style={{ padding: '4px 12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>🗑️ Delete</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorMaster;
