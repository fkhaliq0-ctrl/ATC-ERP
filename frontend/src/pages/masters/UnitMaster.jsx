import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://atc-geca.onrender.com/api';

const UnitMaster = () => {
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [unitNo, setUnitNo] = useState('');

  const [formData, setFormData] = useState({
    unit_code: 'PCS',
    unit_name: 'Pieces',
    category: 'Counting',
    active: true,
    description: '',
  });

  const categories = ['Counting', 'Weight', 'Length', 'Volume', 'Area', 'Time', 'Other'];

  // Predefined unit codes with auto-generated names
  const unitOptions = [
    { code: 'PCS', name: 'Pieces', category: 'Counting' },
    { code: 'BOX', name: 'Box', category: 'Counting' },
    { code: 'CTN', name: 'Carton', category: 'Counting' },
    { code: 'DZN', name: 'Dozen', category: 'Counting' },
    { code: 'SET', name: 'Set', category: 'Counting' },
    { code: 'PKT', name: 'Packet', category: 'Counting' },
    { code: 'ROL', name: 'Roll', category: 'Counting' },
    { code: 'KG', name: 'Kilogram', category: 'Weight' },
    { code: 'GM', name: 'Gram', category: 'Weight' },
    { code: 'TON', name: 'Ton', category: 'Weight' },
    { code: 'LB', name: 'Pound', category: 'Weight' },
    { code: 'MTR', name: 'Meter', category: 'Length' },
    { code: 'CM', name: 'Centimeter', category: 'Length' },
    { code: 'FT', name: 'Feet', category: 'Length' },
    { code: 'IN', name: 'Inch', category: 'Length' },
    { code: 'LTR', name: 'Liter', category: 'Volume' },
    { code: 'ML', name: 'Milliliter', category: 'Volume' },
    { code: 'GAL', name: 'Gallon', category: 'Volume' },
    { code: 'SQF', name: 'Square Feet', category: 'Area' },
    { code: 'SQY', name: 'Square Yard', category: 'Area' },
    { code: 'HR', name: 'Hour', category: 'Time' },
    { code: 'MIN', name: 'Minute', category: 'Time' },
  ];

  useEffect(() => {
    fetchUnits();
    generateUnitNo();
  }, []);

  const generateUnitNo = () => {
    const count = units.length + 1;
    setUnitNo('UNT-' + String(count).padStart(4, '0'));
  };

  const fetchUnits = async () => {
    try {
      const response = await axios.get(API_BASE + '/units/');
      setUnits(response.data || []);
      generateUnitNo();
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleUnitCodeChange = (e) => {
    const code = e.target.value;
    const selected = unitOptions.find(u => u.code === code);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        unit_code: selected.code,
        unit_name: selected.name,
        category: selected.category,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = {
        unit_no: unitNo,
        ...formData,
      };
      const url = editingId ? API_BASE + '/units/' + editingId + '/' : API_BASE + '/units/';
      const method = editingId ? 'put' : 'post';
      await axios[method](url, formDataToSend);
      alert(editingId ? 'Unit updated!' : 'Unit saved!');
      resetForm();
      fetchUnits();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (unit) => {
    if (!isSuperUser) {
      alert('Only Super User can edit.');
      return;
    }
    setEditingId(unit.id);
    setUnitNo(unit.unit_no);
    setFormData({
      unit_code: unit.unit_code || 'PCS',
      unit_name: unit.unit_name || 'Pieces',
      category: unit.category || 'Counting',
      active: unit.active !== undefined ? unit.active : true,
      description: unit.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (!isSuperUser) {
      alert('Only Super User can delete.');
      return;
    }
    if (window.confirm('Delete this unit?')) {
      try {
        await axios.delete(API_BASE + '/units/' + id + '/');
        alert('Unit deleted!');
        fetchUnits();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      unit_code: 'PCS',
      unit_name: 'Pieces',
      category: 'Counting',
      active: true,
      description: '',
    });
    generateUnitNo();
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>📏 Unit Master</h1>
            <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Manage measurement units for items</p>
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
            {editingId ? '✏️ Edit Unit' : '➕ Add New Unit'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Unit No.</label>
                <input value={unitNo} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f0f0f0', color: '#666', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Unit Code *</label>
                <select name="unit_code" value={formData.unit_code} onChange={handleUnitCodeChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box' }} required>
                  {unitOptions.map(u => (
                    <option key={u.code} value={u.code}>{u.code} - {u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Unit Name</label>
                <input name="unit_name" value={formData.unit_name} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', color: '#333', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '10px' }}>Auto-generated from Unit Code</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Category</label>
                <input name="category" value={formData.category} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8f9fa', color: '#333', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '10px' }}>Auto-generated from Unit Code</small>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Active</label>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                    <span style={{ color: '#333' }}>Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Additional notes about this unit..." rows="2" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? '⏳ Saving...' : editingId ? '✏️ Update Unit' : '💾 Save Unit'}
              </button>
              {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>}
              <button type="button" onClick={resetForm} style={{ padding: '10px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>➕ Add New</button>
            </div>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a237e', marginBottom: '12px', borderBottom: '2px solid #e8eaf6', paddingBottom: '12px' }}>📋 Saved Units ({units.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Unit ID</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Code</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Name</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Category</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Active</th>
                  {isSuperUser && <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {units.length === 0 ? (
                  <tr><td colSpan={isSuperUser ? 6 : 5} style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No units recorded yet.</td></tr>
                ) : (
                  units.map((unit, index) => (
                    <tr key={unit.id || index} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '10px 12px' }}>{unit.unit_no || 'UNT-' + String(index + 1).padStart(4, '0')}</td>
                      <td style={{ padding: '10px 12px' }}>{unit.unit_code}</td>
                      <td style={{ padding: '10px 12px' }}>{unit.unit_name}</td>
                      <td style={{ padding: '10px 12px' }}>{unit.category || '-'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {unit.active !== false ? (
                          <span style={{ color: '#2e7d32' }}>✅</span>
                        ) : (
                          <span style={{ color: '#c62828' }}>❌</span>
                        )}
                      </td>
                      {isSuperUser && (
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button onClick={() => handleEdit(unit)} style={{ padding: '4px 12px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginRight: '6px' }}>✏️</button>
                          <button onClick={() => handleDelete(unit.id)} style={{ padding: '4px 12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>🗑️</button>
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

export default UnitMaster;
