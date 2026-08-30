import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://atc-geca.onrender.com/api';

const ItemMaster = () => {
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [itemNo, setItemNo] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    hsn_code: '',
    color: '',
    active: true,
    description: '',
    purchase_price: '',
    gst_rate: 'GST 18%',
    cgst: 9.00,
    sgst: 9.00,
    igst: 18.00,
  });

  const colors = ['Select Color', 'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Silver', 'Gold', 'Pink', 'Orange', 'Purple'];
  const gstRates = ['GST 0%', 'GST 5%', 'GST 12%', 'GST 18%', 'GST 28%'];

  useEffect(() => {
    fetchItems();
    generateItemNo();
  }, []);

  const generateItemNo = () => {
    const count = items.length + 1;
    setItemNo('ITEM-' + String(count).padStart(4, '0'));
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_BASE + '/items/');
      setItems(response.data || []);
      generateItemNo();
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      if (name === 'gst_rate') {
        const rate = parseFloat(value.replace('GST ', '').replace('%', ''));
        if (!isNaN(rate)) {
          newData.cgst = rate / 2;
          newData.sgst = rate / 2;
          newData.igst = rate;
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
        item_no: itemNo,
        ...formData,
        cgst: parseFloat(formData.cgst) || 0,
        sgst: parseFloat(formData.sgst) || 0,
        igst: parseFloat(formData.igst) || 0,
      };
      const url = editingId ? API_BASE + '/items/' + editingId + '/' : API_BASE + '/items/';
      const method = editingId ? 'put' : 'post';
      await axios[method](url, formDataToSend);
      alert(editingId ? 'Item updated!' : 'Item saved!');
      resetForm();
      fetchItems();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (!isSuperUser) {
      alert('Only Super User can edit.');
      return;
    }
    setEditingId(item.id);
    setItemNo(item.item_no);
    setFormData({
      category: item.category || '',
      item_name: item.item_name || '',
      hsn_code: item.hsn_code || '',
      color: item.color || '',
      active: item.active !== undefined ? item.active : true,
      description: item.description || '',
      purchase_price: item.purchase_price || '',
      gst_rate: item.gst_rate || 'GST 18%',
      cgst: item.cgst || 9.00,
      sgst: item.sgst || 9.00,
      igst: item.igst || 18.00,
    });
  };

  const handleDelete = async (id) => {
    if (!isSuperUser) {
      alert('Only Super User can delete.');
      return;
    }
    if (window.confirm('Delete this item?')) {
      try {
        await axios.delete(API_BASE + '/items/' + id + '/');
        alert('Item deleted!');
        fetchItems();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      category: '',
      item_name: '',
      hsn_code: '',
      color: '',
      active: true,
      description: '',
      purchase_price: '',
      gst_rate: 'GST 18%',
      cgst: 9.00,
      sgst: 9.00,
      igst: 18.00,
    });
    generateItemNo();
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>📦 Item Master</h1>
            <p style={{ color: '#666', fontSize: '13px', margin: '2px 0 0 0' }}>Add and manage your products/items</p>
          </div>
          {isSuperUser && <span style={{ padding: '4px 14px', backgroundColor: '#ff9800', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>🔒 Super User</span>}
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a237e', marginBottom: '12px', borderBottom: '2px solid #e8eaf6', paddingBottom: '10px' }}>
            {editingId ? '✏️ Edit Item' : '➕ Add New Item'}
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Row 1: Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1.2fr 1fr 0.8fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>Item No.</label>
                <input value={itemNo} disabled style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: '#f0f0f0', color: '#666', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>Category *</label>
                <input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Chicken, Mutton, etc." style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: 'white', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>Item Name *</label>
                <input name="item_name" value={formData.item_name} onChange={handleChange} placeholder="e.g. Boneless Chicken" style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: 'white', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>HSN Code</label>
                <input name="hsn_code" value={formData.hsn_code} onChange={handleChange} placeholder="e.g. 123456" style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>Color</label>
                <select name="color" value={formData.color} onChange={handleChange} style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
                  <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                  Active
                </label>
              </div>
            </div>

            {/* Row 2: Description */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Item description..." rows="2" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
            </div>

            {/* Row 3: Pricing & GST */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.8fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>Purchase Price (₹)</label>
                <input name="purchase_price" type="number" step="0.01" value={formData.purchase_price} onChange={handleChange} placeholder="0.00" style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>GST Rate</label>
                <select name="gst_rate" value={formData.gst_rate} onChange={handleChange} style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: 'white', boxSizing: 'border-box' }}>
                  {gstRates.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>CGST (%)</label>
                <input name="cgst" type="number" step="0.01" value={formData.cgst} onChange={handleChange} style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '9px' }}>Auto-calculated</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>SGST (%)</label>
                <input name="sgst" type="number" step="0.01" value={formData.sgst} onChange={handleChange} style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '9px' }}>Auto-calculated</small>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>IGST (%)</label>
                <input name="igst" type="number" step="0.01" value={formData.igst} onChange={handleChange} style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} />
                <small style={{ color: '#888', fontSize: '9px' }}>Auto-calculated</small>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
              <button type="submit" disabled={loading} style={{
                padding: '10px 24px',
                backgroundColor: '#1a237e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {loading ? '⏳ Saving...' : editingId ? '✏️ Update Item' : '💾 Save Item'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={{
                  padding: '10px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  Cancel
                </button>
              )}
              <button type="button" onClick={resetForm} style={{
                padding: '10px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                ➕ Add New
              </button>
            </div>
          </form>
        </div>

        {/* Items List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a237e', marginBottom: '12px', borderBottom: '2px solid #e8eaf6', paddingBottom: '10px' }}>
            📋 Saved Items ({items.length})
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Item ID</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Category</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Item Name</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>HSN</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Color</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Active</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>GST%</th>
                  {isSuperUser && <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperUser ? 8 : 7} style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                      No items recorded yet.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id || index} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '8px 10px' }}>{item.item_no || 'ITEM-' + String(index + 1).padStart(4, '0')}</td>
                      <td style={{ padding: '8px 10px' }}>{item.category || '-'}</td>
                      <td style={{ padding: '8px 10px' }}>{item.item_name}</td>
                      <td style={{ padding: '8px 10px' }}>{item.hsn_code || '-'}</td>
                      <td style={{ padding: '8px 10px' }}>{item.color || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        {item.active !== false ? (
                          <span style={{ color: '#2e7d32' }}>✅</span>
                        ) : (
                          <span style={{ color: '#c62828' }}>❌</span>
                        )}
                      </td>
                      <td style={{ padding: '8px 10px' }}>{item.gst_rate || '-'}</td>
                      {isSuperUser && (
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <button onClick={() => handleEdit(item)} style={{
                            padding: '3px 10px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            marginRight: '4px'
                          }}>✏️</button>
                          <button onClick={() => handleDelete(item.id)} style={{
                            padding: '3px 10px',
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}>🗑️</button>
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

export default ItemMaster;
