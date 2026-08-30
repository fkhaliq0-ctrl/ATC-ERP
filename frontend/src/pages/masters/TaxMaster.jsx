import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://atc-geca.onrender.com/api';

const TaxMaster = () => {
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [taxNo, setTaxNo] = useState('');

  const [formData, setFormData] = useState({
    tax_name: '',
    tax_rate: '',
    tax_type: 'GST',
    cgst: '',
    sgst: '',
    igst: '',
    active: true,
    effective_from: new Date().toISOString().split('T')[0],
    description: '',
  });

  const taxTypes = ['GST', 'VAT', 'CST', 'Excise', 'Customs', 'Service Tax'];
  const gstRates = ['0%', '5%', '12%', '18%', '28%'];

  useEffect(() => {
    fetchTaxes();
    generateTaxNo();
  }, []);

  const generateTaxNo = () => {
    const count = taxes.length + 1;
    setTaxNo('TAX-' + String(count).padStart(4, '0'));
  };

  const fetchTaxes = async () => {
    try {
      const response = await axios.get(API_BASE + '/taxes/');
      setTaxes(response.data || []);
      generateTaxNo();
    } catch (error) {
      console.error('Error fetching taxes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Auto-calculate CGST, SGST, IGST when tax_rate changes
      if (name === 'tax_rate') {
        const rate = parseFloat(value.replace('%', ''));
        if (!isNaN(rate) && rate > 0) {
          // For GST: CGST + SGST = total GST rate
          // IGST = total GST rate (for inter-state)
          const cgst = (rate / 2).toFixed(2);
          const sgst = (rate / 2).toFixed(2);
          const igst = rate.toFixed(2);
          newData.cgst = cgst;
          newData.sgst = sgst;
          newData.igst = igst;
        } else if (rate === 0) {
          newData.cgst = '0';
          newData.sgst = '0';
          newData.igst = '0';
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = {
        tax_no: taxNo,
        ...formData,
        tax_rate: parseFloat(formData.tax_rate) || 0,
        cgst: parseFloat(formData.cgst) || 0,
        sgst: parseFloat(formData.sgst) || 0,
        igst: parseFloat(formData.igst) || 0,
      };
      const url = editingId ? API_BASE + '/taxes/' + editingId + '/' : API_BASE + '/taxes/';
      const method = editingId ? 'put' : 'post';
      await axios[method](url, formDataToSend);
      alert(editingId ? 'Tax rule updated!' : 'Tax rule saved!');
      resetForm();
      fetchTaxes();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tax) => {
    if (!isSuperUser) {
      alert('Only Super User can edit tax rules.');
      return;
    }
    setEditingId(tax.id);
    setTaxNo(tax.tax_no);
    setFormData({
      tax_name: tax.tax_name || '',
      tax_rate: tax.tax_rate || '',
      tax_type: tax.tax_type || 'GST',
      cgst: tax.cgst || '',
      sgst: tax.sgst || '',
      igst: tax.igst || '',
      active: tax.active !== undefined ? tax.active : true,
      effective_from: tax.effective_from || new Date().toISOString().split('T')[0],
      description: tax.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (!isSuperUser) {
      alert('Only Super User can delete tax rules.');
      return;
    }
    if (window.confirm('Delete this tax rule?')) {
      try {
        await axios.delete(API_BASE + '/taxes/' + id + '/');
        alert('Tax rule deleted!');
        fetchTaxes();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      tax_name: '',
      tax_rate: '',
      tax_type: 'GST',
      cgst: '',
      sgst: '',
      igst: '',
      active: true,
      effective_from: new Date().toISOString().split('T')[0],
      description: '',
    });
    generateTaxNo();
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>🔒 Tax Master</h1>
            <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Manage tax rates and rules (Super User only)</p>
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
            {editingId ? '✏️ Edit Tax Rule' : '➕ Add New Tax Rule'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.2fr 1.2fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Tax No.</label>
                <input value={taxNo} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f0f0f0', color: '#666', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Tax Name *</label>
                <input name="tax_name" value={formData.tax_name} onChange={handleChange} placeholder="e.g. GST 18%" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Tax Rate (%) *</label>
                <input name="tax_rate" type="number" step="0.01" value={formData.tax_rate} onChange={handleChange} placeholder="e.g. 18" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Tax Type</label>
                <select name="tax_type" value={formData.tax_type} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  {taxTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>CGST (%)</label>
                <input name="cgst" type="number" step="0.01" value={formData.cgst} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '10px' }}>Auto-calculated</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>SGST (%)</label>
                <input name="sgst" type="number" step="0.01" value={formData.sgst} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '10px' }}>Auto-calculated</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>IGST (%)</label>
                <input name="igst" type="number" step="0.01" value={formData.igst} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '10px' }}>Auto-calculated</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Active</label>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                    <span style={{ color: '#333' }}>Active</span>
                  </label>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Effective From</label>
                <input name="effective_from" type="date" value={formData.effective_from} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Additional notes about this tax rule..." rows="2" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? '⏳ Saving...' : editingId ? '✏️ Update Tax Rule' : '💾 Save Tax Rule'}
              </button>
              {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>}
              <button type="button" onClick={resetForm} style={{ padding: '10px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>➕ Add New</button>
            </div>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a237e', marginBottom: '12px', borderBottom: '2px solid #e8eaf6', paddingBottom: '12px' }}>📋 Tax Rules ({taxes.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Tax ID</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Tax Name</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Rate</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Type</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>CGST</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>SGST</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>IGST</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Active</th>
                  {isSuperUser && <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {taxes.length === 0 ? (
                  <tr><td colSpan={isSuperUser ? 9 : 8} style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No tax rules added yet.</td></tr>
                ) : (
                  taxes.map((tax, index) => (
                    <tr key={tax.id || index} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '10px 12px' }}>{tax.tax_no || 'TAX-' + String(index + 1).padStart(4, '0')}</td>
                      <td style={{ padding: '10px 12px' }}>{tax.tax_name}</td>
                      <td style={{ padding: '10px 12px' }}>{tax.tax_rate}%</td>
                      <td style={{ padding: '10px 12px' }}>{tax.tax_type}</td>
                      <td style={{ padding: '10px 12px' }}>{tax.cgst || '-'}</td>
                      <td style={{ padding: '10px 12px' }}>{tax.sgst || '-'}</td>
                      <td style={{ padding: '10px 12px' }}>{tax.igst || '-'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {tax.active !== false ? (
                          <span style={{ color: '#2e7d32' }}>✅</span>
                        ) : (
                          <span style={{ color: '#c62828' }}>❌</span>
                        )}
                      </td>
                      {isSuperUser && (
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button onClick={() => handleEdit(tax)} style={{ padding: '4px 12px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginRight: '6px' }}>✏️</button>
                          <button onClick={() => handleDelete(tax.id)} style={{ padding: '4px 12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>🗑️</button>
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

export default TaxMaster;
