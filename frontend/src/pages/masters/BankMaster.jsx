import React, { useState } from 'react';

const BankMaster = () => {
  const [banks, setBanks] = useState([
    {
      id: 'BANK-0001',
      accountName: 'ATC Primary Operating Account',
      bankName: 'HDFC Bank',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      branch: 'Main Branch',
      upiId: 'atc@hdfcbank',
      accountType: 'Current',
      isDefault: true
    }
  ]);

  const [formData, setFormData] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    upiId: '',
    accountType: 'Current',
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.accountName || !formData.bankName || !formData.accountNumber) {
      return alert('Account Name, Bank Name, and Account Number are required.');
    }

    const updatedBanks = formData.isDefault
      ? banks.map((b) => ({ ...b, isDefault: false }))
      : [...banks];

    setBanks([
      ...updatedBanks,
      {
        ...formData,
        ifscCode: formData.ifscCode.toUpperCase(),
        id: 'BANK-' + Date.now().toString().slice(-4)
      }
    ]);

    setFormData({
      accountName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      upiId: '',
      accountType: 'Current',
      isDefault: false
    });

    alert('Bank account details saved successfully!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🏦 Bank & Account Master</h2>

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Account Nickname / Title *</label>
            <input
              type='text'
              name='accountName'
              value={formData.accountName}
              onChange={handleChange}
              required
              placeholder='e.g. Primary HDFC Current Account'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Bank Name *</label>
            <input
              type='text'
              name='bankName'
              value={formData.bankName}
              onChange={handleChange}
              required
              placeholder='e.g. HDFC Bank, ICICI Bank, SBI'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Account Type</label>
            <select
              name='accountType'
              value={formData.accountType}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value='Current'>Current Account</option>
              <option value='Savings'>Savings Account</option>
              <option value='Overdraft'>Overdraft (OD) / CC</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Account Number *</label>
            <input
              type='text'
              name='accountNumber'
              value={formData.accountNumber}
              onChange={handleChange}
              required
              placeholder='e.g. 50200012345678'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>IFSC Code</label>
            <input
              type='text'
              name='ifscCode'
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder='e.g. HDFC0001234'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Branch Name</label>
            <input
              type='text'
              name='branch'
              value={formData.branch}
              onChange={handleChange}
              placeholder='e.g. Connaught Place'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>UPI ID (For Invoices)</label>
            <input
              type='text'
              name='upiId'
              value={formData.upiId}
              onChange={handleChange}
              placeholder='e.g. company@upi'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <input
              type='checkbox'
              name='isDefault'
              checked={formData.isDefault}
              onChange={handleChange}
              style={{ width: '18px', height: '18px' }}
            />
            <span>⭐ Set as Default Account for Invoices & Payments</span>
          </label>
        </div>

        <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Save Bank Details
        </button>
      </form>

      <h3>Configured Bank Accounts</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Account ID</th>
            <th style={{ padding: '10px' }}>Title & Bank</th>
            <th style={{ padding: '10px' }}>Account Number</th>
            <th style={{ padding: '10px' }}>IFSC & Branch</th>
            <th style={{ padding: '10px' }}>UPI ID</th>
            <th style={{ padding: '10px' }}>Type</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b) => (
            <tr key={b.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{b.id}</td>
              <td style={{ padding: '10px' }}>
                <strong>{b.accountName}</strong>
                <br />
                <span style={{ color: '#6c757d', fontSize: '13px' }}>{b.bankName}</span>
              </td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{b.accountNumber}</td>
              <td style={{ padding: '10px' }}>
                {b.ifscCode || '-'}
                <br />
                <span style={{ color: '#6c757d', fontSize: '13px' }}>{b.branch || '-'}</span>
              </td>
              <td style={{ padding: '10px' }}>{b.upiId || '-'}</td>
              <td style={{ padding: '10px' }}>{b.accountType}</td>
              <td style={{ padding: '10px' }}>
                {b.isDefault ? (
                  <span style={{ background: '#fff3cd', color: '#856404', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    ⭐ Default Account
                  </span>
                ) : (
                  <span style={{ background: '#e2e3e5', color: '#383d41', padding: '3px 8px', borderRadius: '4px' }}>
                    Secondary
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankMaster;
