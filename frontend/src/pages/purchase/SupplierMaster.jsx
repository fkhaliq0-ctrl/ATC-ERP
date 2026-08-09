import React, { useState } from 'react';
import {
  getStateFromPin,
  formatINR,
  statusBadge,
  inputStyle,
  labelStyle,
  cardStyle,
  tableHeaderStyle,
  generateId
} from './purchaseData';

const emptyForm = {
  companyName: '',
  contactPerson: '',
  address: '',
  city: '',
  state: '',
  stateCode: '',
  pinCode: '',
  country: 'India',
  phone: '',
  email: '',
  gstin: '',
  pan: '',
  paymentTerms: '30 Days',
  category: 'Raw Materials',
  openingBalance: 0,
  status: 'Active'
};

const SupplierMaster = ({ suppliers, setSuppliers }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // ─── Handle Input Change ───────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Auto-generate State & State Code on Pin Code change
    if (name === 'pinCode') {
      const stateInfo = getStateFromPin(value);
      updatedForm.state = stateInfo.state;
      updatedForm.stateCode = stateInfo.code;
    }

    setFormData(updatedForm);
  };

  // ─── Handle Submit (Create / Update) ───────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName) return alert('Supplier / Company Name is required');

    if (editingId) {
      // Update existing
      setSuppliers(suppliers.map((s) => (s.id === editingId ? { ...formData, id: editingId } : s)));
      alert('Supplier updated successfully!');
    } else {
      // Create new
      const newId = generateId('SUPP', suppliers.length, 3, 1);
      setSuppliers([...suppliers, { ...formData, id: newId }]);
      alert('Supplier saved successfully! ID: ' + newId);
    }

    setFormData(emptyForm);
    setEditingId(null);
  };

  // ─── Edit Supplier ─────────────────────────────────────────────
  const handleEdit = (supplier) => {
    setFormData({ ...supplier });
    setEditingId(supplier.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Delete Supplier ───────────────────────────────────────────
  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    setSuppliers(suppliers.filter((s) => s.id !== id));
    if (editingId === id) {
      setFormData(emptyForm);
      setEditingId(null);
    }
    alert('Supplier deleted.');
  };

  // ─── Cancel Edit ───────────────────────────────────────────────
  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  // ─── Filtered Suppliers ────────────────────────────────────────
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      (s.gstin || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(suppliers.map((s) => s.category))];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>🏭 Supplier / Vendor Master</h2>

      {/* ─── Supplier Form ──────────────────────────────────────── */}
      <form onSubmit={handleSubmit} style={{ ...cardStyle, border: '1px solid #dee2e6' }}>
        <h3 style={{ margin: '0 0 15px 0', color: editingId ? '#ffc107' : '#28a745' }}>
          {editingId ? `✏️ Edit Supplier (${editingId})` : '➕ Add New Supplier'}
        </h3>

        {/* Row 1: Company Name & Contact Person */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Supplier / Company Name *</label>
            <input
              type='text'
              name='companyName'
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder='e.g. A.S. Enterprises'
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Contact Person</label>
            <input
              type='text'
              name='contactPerson'
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder='e.g. Mr. Arun Sharma'
              style={inputStyle}
            />
          </div>
        </div>

        {/* Row 2: Address */}
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Address</label>
          <input
            type='text'
            name='address'
            value={formData.address}
            onChange={handleChange}
            placeholder='Street address, office no, factory address'
            style={inputStyle}
          />
        </div>

        {/* Row 3: City, Pin Code, State, State Code */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>City</label>
            <input type='text' name='city' value={formData.city} onChange={handleChange} placeholder='e.g. Mumbai' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Pin Code</label>
            <input type='text' name='pinCode' value={formData.pinCode} onChange={handleChange} placeholder='e.g. 400001' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>State (Auto-Generated)</label>
            <input type='text' name='state' value={formData.state} readOnly placeholder='Auto-filled' style={{ ...inputStyle, background: '#e9ecef' }} />
          </div>
          <div>
            <label style={labelStyle}>State Code (Auto)</label>
            <input type='text' name='stateCode' value={formData.stateCode} readOnly placeholder='Auto-filled' style={{ ...inputStyle, background: '#e9ecef' }} />
          </div>
        </div>

        {/* Row 4: Country, Phone, Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Country</label>
            <input type='text' name='country' value={formData.country} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type='text' name='phone' value={formData.phone} onChange={handleChange} placeholder='+91 9876543210' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type='email' name='email' value={formData.email} onChange={handleChange} placeholder='contact@supplier.com' style={inputStyle} />
          </div>
        </div>

        {/* Row 5: GSTIN, PAN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>GSTIN</label>
            <input type='text' name='gstin' value={formData.gstin} onChange={handleChange} placeholder='15-digit GST Number' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>PAN Number</label>
            <input type='text' name='pan' value={formData.pan} onChange={handleChange} placeholder='10-digit PAN' style={inputStyle} />
          </div>
        </div>

        {/* Row 6: Payment Terms, Category, Opening Balance, Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Payment Terms</label>
            <select name='paymentTerms' value={formData.paymentTerms} onChange={handleChange} style={inputStyle}>
              <option value='7 Days'>7 Days</option>
              <option value='15 Days'>15 Days</option>
              <option value='30 Days'>30 Days</option>
              <option value='45 Days'>45 Days</option>
              <option value='60 Days'>60 Days</option>
              <option value='Immediate'>Immediate</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select name='category' value={formData.category} onChange={handleChange} style={inputStyle}>
              <option value='Raw Materials'>Raw Materials</option>
              <option value='Packaging'>Packaging</option>
              <option value='Equipment'>Equipment</option>
              <option value='Consumables'>Consumables</option>
              <option value='Services'>Services</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Opening Balance (₹)</label>
            <input type='number' name='openingBalance' value={formData.openingBalance} onChange={handleChange} placeholder='0' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name='status' value={formData.status} onChange={handleChange} style={inputStyle}>
              <option value='Active'>Active</option>
              <option value='Inactive'>Inactive</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type='submit'
            style={{ padding: '10px 25px', backgroundColor: editingId ? '#ffc107' : '#28a745', color: editingId ? '#000' : '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {editingId ? 'Update Supplier' : 'Save Supplier'}
          </button>
          {editingId && (
            <button
              type='button'
              onClick={handleCancel}
              style={{ padding: '10px 25px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ─── Search & Filter ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
        <input
          type='text'
          placeholder='🔍 Search by name, ID, or GSTIN...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: '1', maxWidth: '400px' }}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...inputStyle, maxWidth: '200px' }}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '13px', color: '#6c757d' }}>
          Showing {filteredSuppliers.length} of {suppliers.length} suppliers
        </span>
      </div>

      {/* ─── Suppliers Table ────────────────────────────────────── */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={{ padding: '10px' }}>Supplier ID</th>
              <th style={{ padding: '10px' }}>Company Name</th>
              <th style={{ padding: '10px' }}>Contact</th>
              <th style={{ padding: '10px' }}>City / State</th>
              <th style={{ padding: '10px' }}>GSTIN</th>
              <th style={{ padding: '10px' }}>Category</th>
              <th style={{ padding: '10px' }}>O/B Balance</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan='9' style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.id}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.companyName}</td>
                  <td style={{ padding: '10px' }}>
                    <div>{s.contactPerson || '—'}</div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>{s.phone || '—'}</div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    {s.city ? s.city + ', ' : ''}
                    {s.state} ({s.stateCode})
                  </td>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>{s.gstin || '—'}</td>
                  <td style={{ padding: '10px' }}>{s.category}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: s.openingBalance > 0 ? '#dc3545' : '#28a745' }}>
                    {formatINR(s.openingBalance, 0)}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={statusBadge(s.status)}>{s.status}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => handleEdit(s)}
                      style={{ color: '#007bff', border: '1px solid #007bff', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{ color: '#dc3545', border: '1px solid #dc3545', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
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
    </div>
  );
};

export default SupplierMaster;