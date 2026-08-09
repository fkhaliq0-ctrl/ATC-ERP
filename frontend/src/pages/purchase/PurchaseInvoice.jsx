import React, { useState } from 'react';
import '../../styles/Shared.css';

const PurchaseInvoice = () => {
  // Mock vendor data - in real app, this comes from API
  const [vendors] = useState([
    { id: 1, name: 'ABC Supplies', address: '123 Main Street', city: 'Delhi', state: 'Delhi', stateCode: '07', country: 'India', contact: '+91 9876543210' },
    { id: 2, name: 'XYZ Traders', address: '456 Park Avenue', city: 'Mumbai', state: 'Maharashtra', stateCode: '27', country: 'India', contact: '+91 9876543211' },
    { id: 3, name: 'PQR Enterprises', address: '789 Oak Road', city: 'Bangalore', state: 'Karnataka', stateCode: '29', country: 'India', contact: '+91 9876543212' },
  ]);

  const [formData, setFormData] = useState({
    purchaseInvoiceNo: 'PI-001',
    purchaseInvoiceDate: new Date().toISOString().split('T')[0],
    vendorInvoiceNo: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    vendorId: '',
    vendor: '',
    address: '',
    city: '',
    state: '',
    stateCode: '',
    country: 'India',
    contactNumber: '',
    grNo: '',
    grDate: '',
    transportName: '',
    mode: 'Road',
    vehicleNo: '',
  });

  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const [tax, setTax] = useState(18);
  const [total, setTotal] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVendorSelect = (e) => {
    const vendorId = Number(e.target.value);
    const selectedVendor = vendors.find(v => v.id === vendorId);
    if (selectedVendor) {
      setFormData({
        ...formData,
        vendorId: vendorId,
        vendor: selectedVendor.name,
        address: selectedVendor.address,
        city: selectedVendor.city,
        state: selectedVendor.state,
        stateCode: selectedVendor.stateCode,
        country: selectedVendor.country,
        contactNumber: selectedVendor.contact,
      });
    }
  };

  const addItem = () => {
    setItems([...items, { id: items.length + 1, description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.rate;
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const calculateTotal = (updatedItems) => {
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * (tax / 100);
    setTotal(subtotal + taxAmount);
  };

  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(2);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">📄 Purchase Invoice</h1>
      <p className="page-subtitle">Create and manage purchase invoices</p>

      {/* Invoice Details */}
      <div className="card">
        <h3 className="card-title">Invoice Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Purchase Invoice No. (Internal)</label>
            <input 
              type="text" 
              name="purchaseInvoiceNo"
              value={formData.purchaseInvoiceNo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Purchase Invoice Date</label>
            <input 
              type="date" 
              name="purchaseInvoiceDate"
              value={formData.purchaseInvoiceDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Vendor Invoice No.</label>
            <input 
              type="text" 
              name="vendorInvoiceNo"
              placeholder="Enter vendor invoice number"
              value={formData.vendorInvoiceNo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Purchase Date</label>
            <input 
              type="date" 
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Vendor Details */}
      <div className="card">
        <h3 className="card-title">Vendor / Supplier Details</h3>
        <div className="form-group">
          <label>Vendor / Supplier Name *</label>
          <select 
            name="vendorId"
            value={formData.vendorId}
            onChange={handleVendorSelect}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px' }}
          >
            <option value="">-- Select Vendor --</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            name="address"
            placeholder="Street address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input 
              type="text" 
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input 
              type="text" 
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>State Code</label>
            <input 
              type="text" 
              name="stateCode"
              value={formData.stateCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input 
              type="text" 
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input 
            type="text" 
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Transport Details */}
      <div className="card">
        <h3 className="card-title">🚛 Transport Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label>GR No.</label>
            <input 
              type="text" 
              name="grNo"
              placeholder="Enter GR number"
              value={formData.grNo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>GR Date</label>
            <input 
              type="date" 
              name="grDate"
              value={formData.grDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Transport Name</label>
            <input 
              type="text" 
              name="transportName"
              placeholder="Enter transport company name"
              value={formData.transportName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mode</label>
            <select 
              name="mode"
              value={formData.mode}
              onChange={handleChange}
            >
              <option>Road</option>
              <option>Rail</option>
              <option>Air</option>
              <option>Sea</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Vehicle No.</label>
          <input 
            type="text" 
            name="vehicleNo"
            placeholder="e.g. DL-01-AB-1234"
            value={formData.vehicleNo}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="card">
        <h3 className="card-title">Purchase Items</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '35%' }}>Item Description</th>
                <th style={{ width: '15%' }}>Quantity</th>
                <th style={{ width: '20%' }}>Rate (₹)</th>
                <th style={{ width: '20%' }}>Amount (₹)</th>
                <th style={{ width: '5%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      style={{ width: '70px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      style={{ width: '100px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </td>
                  <td>{formatCurrency(item.amount)}</td>
                  <td>
                    <button 
                      onClick={() => removeItem(item.id)}
                      style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addItem} className="btn-secondary" style={{ marginTop: '12px' }}>
          + Add Item
        </button>
      </div>

      {/* Totals */}
      <div className="card" style={{ maxWidth: '400px', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <span>Subtotal:</span>
          <span>{formatCurrency(items.reduce((sum, item) => sum + (item.amount || 0), 0))}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>Tax ({tax}%):</span>
          <span>{formatCurrency(items.reduce((sum, item) => sum + (item.amount || 0), 0) * (tax / 100))}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 'bold', fontSize: '18px' }}>
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button className="btn-primary">💾 Save Invoice</button>
        <button className="btn-secondary">🔄 Reset</button>
        <button className="btn-secondary">🖨️ Print</button>
      </div>
    </div>
  );
};

export default PurchaseInvoice;
