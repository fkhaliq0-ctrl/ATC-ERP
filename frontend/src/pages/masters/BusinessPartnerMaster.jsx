import React, { useState } from 'react';

// Simple State -> State Code mapping for Indian States
const INDIAN_STATES_CODES = {
  "Andhra Pradesh": "37",
  "Arunachal Pradesh": "12",
  "Assam": "18",
  "Bihar": "10",
  "Chhattisgarh": "22",
  "Delhi": "07",
  "Goa": "30",
  "Gujarat": "24",
  "Haryana": "06",
  "Himachal Pradesh": "02",
  "Jharkhand": "20",
  "Karnataka": "29",
  "Kerala": "32",
  "Madhya Pradesh": "23",
  "Maharashtra": "27",
  "Manipur": "14",
  "Meghalaya": "17",
  "Mizoram": "15",
  "Nagaland": "13",
  "Odisha": "21",
  "Punjab": "03",
  "Rajasthan": "08",
  "Sikkim": "11",
  "Tamil Nadu": "33",
  "Telangana": "36",
  "Tripura": "16",
  "Uttar Pradesh": "09",
  "Uttarakhand": "05",
  "West Bengal": "19"
};

const BusinessPartnerMaster = () => {
  const [partnerType, setPartnerType] = useState('customer'); // 'customer' or 'vendor'
  const [partners, setPartners] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    state: '',
    stateCode: '',
    pinCode: '',
    country: 'India',
    contactNumber: '',
    taxId: ''
  });

  // Auto-generate State Code on State Change
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const code = INDIAN_STATES_CODES[selectedState] || '';
    setFormData({
      ...formData,
      state: selectedState,
      stateCode: code
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName) {
      alert('Please enter Company Name');
      return;
    }
    const newEntry = { ...formData, id: Date.now(), type: partnerType };
    setPartners([...partners, newEntry]);
    
    // Reset Form
    setFormData({
      companyName: '',
      companyAddress: '',
      state: '',
      stateCode: '',
      pinCode: '',
      country: 'India',
      contactNumber: '',
      taxId: ''
    });
    alert(`${partnerType === 'customer' ? 'Customer' : 'Vendor'} saved successfully!`);
  };

  const handleDelete = (id) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Toggle Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{partnerType === 'customer' ? 'Customer Master' : 'Vendor Master'}</h2>
        <div>
          <button 
            onClick={() => setPartnerType('customer')}
            style={{
              padding: '10px 20px',
              backgroundColor: partnerType === 'customer' ? '#007bff' : '#e0e0e0',
              color: partnerType === 'customer' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px 0 0 4px',
              cursor: 'pointer'
            }}
          >
            Customer Master
          </button>
          <button 
            onClick={() => setPartnerType('vendor')}
            style={{
              padding: '10px 20px',
              backgroundColor: partnerType === 'vendor' ? '#007bff' : '#e0e0e0',
              color: partnerType === 'vendor' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}
          >
            Vendor Master
          </button>
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            {partnerType === 'customer' ? 'Customer' : 'Vendor'} / Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter Name"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Address</label>
          <textarea
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            rows="3"
            placeholder="Full Address"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select State</option>
              {Object.keys(INDIAN_STATES_CODES).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>State Code</label>
            <input
              type="text"
              name="stateCode"
              value={formData.stateCode}
              readOnly
              placeholder="Auto-gen"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="6-digit"
              maxLength="6"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="10-digit Mobile Number"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>GST / PAN / Identification Number</label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              placeholder="Enter Identification Number"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 25px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Save {partnerType === 'customer' ? 'Customer' : 'Vendor'}
        </button>
      </form>

      {/* Data Table */}
      <h3>{partnerType === 'customer' ? 'Customer' : 'Vendor'} Directory</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Contact</th>
            <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>State</th>
            <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>State Code</th>
            <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Tax ID</th>
            <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {partners.filter(p => p.type === partnerType).length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: '#6c757d' }}>
                No {partnerType} records found. Add one above.
              </td>
            </tr>
          ) : (
            partners.filter(p => p.type === partnerType).map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px' }}>{item.companyName}</td>
                <td style={{ padding: '10px' }}>{item.contactNumber}</td>
                <td style={{ padding: '10px' }}>{item.state}</td>
                <td style={{ padding: '10px' }}>{item.stateCode}</td>
                <td style={{ padding: '10px' }}>{item.taxId}</td>
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessPartnerMaster;