import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://atc-geca.onrender.com/api';

const PurchaseInvoice = () => {
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [vendors, setVendors] = useState([
    { id: 1, name: 'ABC Supplies', address: '123 Main Street', city: 'Delhi', state: 'Delhi', stateCode: '07', country: 'India', contact: '+91 9876543210', gstin: '07AAAAA0000A1Z5', pan: 'ABCDE1234F' },
    { id: 2, name: 'XYZ Traders', address: '456 Park Avenue', city: 'Mumbai', state: 'Maharashtra', stateCode: '27', country: 'India', contact: '+91 9876543211', gstin: '27BBBBB0000B1Z5', pan: 'FGHIJ5678K' },
    { id: 3, name: 'PQR Enterprises', address: '789 Oak Road', city: 'Bangalore', state: 'Karnataka', stateCode: '29', country: 'India', contact: '+91 9876543212', gstin: '29CCCCC0000C1Z5', pan: 'LMNOP9012Q' },
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
    gstin: '',
    pan: '',
    documentType: 'GST No.',
    documentNumber: '',
    grNo: '',
    grDate: '',
    transportName: '',
    mode: 'Road',
    vehicleNo: '',
    customsDuty: 0,
    freightCharges: 0,
    insurance: 0,
    handlingCharges: 0,
    otherCharges: 0,
    totalImportCost: 0,
    importNotes: '',
    packageType: 'Rolls',
    packageQuantity: 0,
    freight: 0,
    roundOff: 0,
  });

  const [items, setItems] = useState([
    { id: 1, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, rate: 0, amount: 0, gst: 18 }
  ]);

  const [total, setTotal] = useState(0);

  const documentTypes = ['GST No.', 'PAN No.', 'Aadhaar No.'];
  const units = ['PCS', 'BOX', 'KG', 'LTR', 'MTR', 'GM', 'DZN', 'PKT', 'CTN', 'SET'];
  const packageTypes = ['Rolls', 'Box', 'Carton', 'Packet', 'Bundle', 'Pallet', 'Drum', 'Bag'];

  useEffect(() => {
    generateInvoiceNo();
  }, []);

  const generateInvoiceNo = () => {
    const now = new Date();
    const prefix = 'PI-';
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({
      ...prev,
      purchaseInvoiceNo: prefix + year + month + day + '-' + random
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (['customsDuty', 'freightCharges', 'insurance', 'handlingCharges', 'otherCharges'].includes(name)) {
        const customsDuty = parseFloat(name === 'customsDuty' ? value : prev.customsDuty) || 0;
        const freightCharges = parseFloat(name === 'freightCharges' ? value : prev.freightCharges) || 0;
        const insurance = parseFloat(name === 'insurance' ? value : prev.insurance) || 0;
        const handlingCharges = parseFloat(name === 'handlingCharges' ? value : prev.handlingCharges) || 0;
        const otherCharges = parseFloat(name === 'otherCharges' ? value : prev.otherCharges) || 0;
        newData.totalImportCost = customsDuty + freightCharges + insurance + handlingCharges + otherCharges;
      }
      
      return newData;
    });
  };

  const handleVendorSelect = (e) => {
    const vendorId = Number(e.target.value);
    const selectedVendor = vendors.find(v => v.id === vendorId);
    if (selectedVendor) {
      setFormData(prev => ({
        ...prev,
        vendorId: vendorId,
        vendor: selectedVendor.name,
        address: selectedVendor.address,
        city: selectedVendor.city,
        state: selectedVendor.state,
        stateCode: selectedVendor.stateCode,
        country: selectedVendor.country,
        contactNumber: selectedVendor.contact,
        gstin: selectedVendor.gstin || '',
        pan: selectedVendor.pan || '',
      }));
    }
  };

  const handleVendorNameChange = (e) => {
    setFormData(prev => ({ ...prev, vendor: e.target.value }));
  };

  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1, 
      category: '', 
      description: '', 
      hsn: '', 
      unit: 'PCS', 
      quantity: 1, 
      rate: 0, 
      amount: 0, 
      gst: 18 
    }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      calculateTotal(updatedItems);
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

  const addItemFromEntry = () => {
    const lastItem = items[items.length - 1];
    if (!lastItem.description || lastItem.quantity <= 0 || lastItem.rate <= 0) {
      alert('Please fill at least Description, Qty and Rate');
      return;
    }
    addItem();
  };

  const calculateTotal = (updatedItems) => {
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * (18 / 100);
    const grandTotal = subtotal + taxAmount + (formData.totalImportCost || 0) + (formData.freight || 0) + (formData.roundOff || 0);
    setTotal(grandTotal);
  };

  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const invoiceData = { ...formData, items };
      const url = editingId ? API_BASE + '/purchase-invoices/' + editingId + '/' : API_BASE + '/purchase-invoices/';
      const method = editingId ? 'put' : 'post';
      await axios[method](url, invoiceData);
      alert(editingId ? 'Purchase invoice updated!' : 'Purchase invoice saved!');
      resetForm();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoice) => {
    if (!isSuperUser) {
      alert('Only Super User can edit invoices.');
      return;
    }
    setEditingId(invoice.id);
    setFormData({
      purchaseInvoiceNo: invoice.purchaseInvoiceNo || 'PI-001',
      purchaseInvoiceDate: invoice.purchaseInvoiceDate || new Date().toISOString().split('T')[0],
      vendorInvoiceNo: invoice.vendorInvoiceNo || '',
      purchaseDate: invoice.purchaseDate || new Date().toISOString().split('T')[0],
      vendorId: invoice.vendorId || '',
      vendor: invoice.vendor || '',
      address: invoice.address || '',
      city: invoice.city || '',
      state: invoice.state || '',
      stateCode: invoice.stateCode || '',
      country: invoice.country || 'India',
      contactNumber: invoice.contactNumber || '',
      gstin: invoice.gstin || '',
      pan: invoice.pan || '',
      documentType: invoice.documentType || 'GST No.',
      documentNumber: invoice.documentNumber || '',
      grNo: invoice.grNo || '',
      grDate: invoice.grDate || '',
      transportName: invoice.transportName || '',
      mode: invoice.mode || 'Road',
      vehicleNo: invoice.vehicleNo || '',
      customsDuty: invoice.customsDuty || 0,
      freightCharges: invoice.freightCharges || 0,
      insurance: invoice.insurance || 0,
      handlingCharges: invoice.handlingCharges || 0,
      otherCharges: invoice.otherCharges || 0,
      totalImportCost: invoice.totalImportCost || 0,
      importNotes: invoice.importNotes || '',
      packageType: invoice.packageType || 'Rolls',
      packageQuantity: invoice.packageQuantity || 0,
      freight: invoice.freight || 0,
      roundOff: invoice.roundOff || 0,
    });
    if (invoice.items) {
      setItems(invoice.items);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
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
      gstin: '',
      pan: '',
      documentType: 'GST No.',
      documentNumber: '',
      grNo: '',
      grDate: '',
      transportName: '',
      mode: 'Road',
      vehicleNo: '',
      customsDuty: 0,
      freightCharges: 0,
      insurance: 0,
      handlingCharges: 0,
      otherCharges: 0,
      totalImportCost: 0,
      importNotes: '',
      packageType: 'Rolls',
      packageQuantity: 0,
      freight: 0,
      roundOff: 0,
    });
    setItems([{ id: 1, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, rate: 0, amount: 0, gst: 18 }]);
    setTotal(0);
    generateInvoiceNo();
  };

  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = subtotal * (18 / 100);
  const grandTotal = subtotal + taxAmount + (formData.totalImportCost || 0) + (formData.freight || 0) + (formData.roundOff || 0);

  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#f0f2f5',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>📄 Purchase Invoice</h1>
            <p style={{ color: '#666', fontSize: '11px', margin: '0' }}>
              {editingId ? '✏️ Edit Purchase Invoice' : 'Create and manage purchase invoices'}
            </p>
          </div>
          {isSuperUser && <span style={{ padding: '2px 12px', backgroundColor: '#ff9800', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>🔒 Super User</span>}
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Row 1: Invoice Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px', flexShrink: 0 }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Invoice No.</label>
                <input name="purchaseInvoiceNo" value={formData.purchaseInvoiceNo} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Invoice Date</label>
                <input type="date" name="purchaseInvoiceDate" value={formData.purchaseInvoiceDate} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Vendor Invoice</label>
                <input name="vendorInvoiceNo" value={formData.vendorInvoiceNo} onChange={handleChange} placeholder="Vendor inv no" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Purchase Date</label>
                <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Row 2: Supplier + Transport */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', flexShrink: 0 }}>
              {/* Supplier */}
              <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '8px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a237e', margin: '0 0 6px 0' }}>🏢 Supplier Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                  <select name="vendorId" value={formData.vendorId} onChange={handleVendorSelect} style={{ ...inputStyle, height: '30px' }}>
                    <option value="">-- Select --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                  <input name="vendor" value={formData.vendor} onChange={handleVendorNameChange} placeholder="Or type new" style={{ ...inputStyle, height: '30px' }} />
                </div>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={{ ...inputStyle, marginBottom: '4px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City" style={inputStyle} />
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="State" style={inputStyle} />
                  <input name="stateCode" value={formData.stateCode} onChange={handleChange} placeholder="State Code" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                  <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" style={inputStyle} />
                  <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Phone" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <select name="documentType" value={formData.documentType} onChange={handleChange} style={{ ...inputStyle, height: '30px' }}>
                    {documentTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Document No." style={inputStyle} />
                </div>
              </div>

              {/* Transport */}
              <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '8px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a237e', margin: '0 0 6px 0' }}>🚛 Transport Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>GR No.</label>
                    <input name="grNo" value={formData.grNo} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>GR Date</label>
                    <input type="date" name="grDate" value={formData.grDate} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>Transport</label>
                    <input name="transportName" value={formData.transportName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>Mode</label>
                    <select name="mode" value={formData.mode} onChange={handleChange} style={{ ...inputStyle, height: '30px' }}>
                      <option>Road</option><option>Rail</option><option>Air</option><option>Sea</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>Vehicle No.</label>
                  <input name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Row 3: Import Expenses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
              {['customsDuty', 'freightCharges', 'insurance', 'handlingCharges', 'otherCharges', 'totalImportCost'].map((field, index) => {
                const labels = ['Customs Duty', 'Freight', 'Insurance', 'Handling', 'Other Charges', 'Total Import Cost'];
                const isReadOnly = field === 'totalImportCost';
                return (
                  <div key={field}>
                    <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>{labels[index]}</label>
                    <input 
                      type="number" 
                      name={field} 
                      value={formData[field] || 0} 
                      onChange={handleChange} 
                      step="0.01" 
                      min="0" 
                      readOnly={isReadOnly}
                      style={{ ...inputStyle, ...(isReadOnly ? { fontWeight: 'bold', backgroundColor: '#f0f0f0' } : {}) }} 
                    />
                  </div>
                );
              })}
            </div>

            {/* Row 4: Items Table - COMPACT */}
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px', 
              padding: '6px', 
              marginBottom: '8px',
              maxHeight: '150px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexShrink: 0 }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>📋 Purchase Items</h4>
                <button type="button" onClick={addItem} style={{ ...buttonStyle, padding: '2px 12px' }}>+ Add Item</button>
              </div>
              <div style={{ overflow: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr style={{ background: '#f5f7fa' }}>
                      <th style={{ padding: '4px', textAlign: 'left', width: '4%' }}>#</th>
                      <th style={{ padding: '4px', textAlign: 'left', width: '12%' }}>Category</th>
                      <th style={{ padding: '4px', textAlign: 'left', width: '18%' }}>Description</th>
                      <th style={{ padding: '4px', textAlign: 'left', width: '10%' }}>HSN</th>
                      <th style={{ padding: '4px', textAlign: 'left', width: '10%' }}>Unit</th>
                      <th style={{ padding: '4px', textAlign: 'center', width: '8%' }}>Qty</th>
                      <th style={{ padding: '4px', textAlign: 'right', width: '12%' }}>Rate</th>
                      <th style={{ padding: '4px', textAlign: 'center', width: '8%' }}>GST%</th>
                      <th style={{ padding: '4px', textAlign: 'right', width: '12%' }}>Amount</th>
                      <th style={{ padding: '4px', textAlign: 'center', width: '6%' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: '2px' }}>{item.id}</td>
                        <td style={{ padding: '2px' }}>
                          <input type="text" placeholder="Category" value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} style={{ ...inputStyle, height: '24px', fontSize: '9px' }} />
                        </td>
                        <td style={{ padding: '2px' }}>
                          <input type="text" placeholder="Item" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} style={{ ...inputStyle, height: '24px', fontSize: '9px' }} />
                        </td>
                        <td style={{ padding: '2px' }}>
                          <input type="text" placeholder="HSN" value={item.hsn} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} style={{ ...inputStyle, height: '24px', fontSize: '9px' }} />
                        </td>
                        <td style={{ padding: '2px' }}>
                          <select value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} style={{ ...inputStyle, height: '24px', fontSize: '9px' }}>
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '2px', textAlign: 'center' }}>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} style={{ ...inputStyle, height: '24px', fontSize: '9px', width: '40px', textAlign: 'center' }} />
                        </td>
                        <td style={{ padding: '2px', textAlign: 'right' }}>
                          <input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))} style={{ ...inputStyle, height: '24px', fontSize: '9px', width: '60px', textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '2px', textAlign: 'center' }}>
                          <select value={item.gst} onChange={(e) => updateItem(item.id, 'gst', Number(e.target.value))} style={{ ...inputStyle, height: '24px', fontSize: '9px' }}>
                            <option value={0}>0%</option><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option>
                          </select>
                        </td>
                        <td style={{ padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.amount)}</td>
                        <td style={{ padding: '2px', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeItem(item.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 5: Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Subtotal</label>
                <input value={formatCurrency(subtotal)} readOnly style={{ ...inputStyle, fontWeight: 'bold', backgroundColor: '#f8f9fa' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Tax (18%)</label>
                <input value={formatCurrency(taxAmount)} readOnly style={{ ...inputStyle, fontWeight: 'bold', backgroundColor: '#f8f9fa' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Import Cost</label>
                <input value={formatCurrency(formData.totalImportCost || 0)} readOnly style={{ ...inputStyle, fontWeight: 'bold', backgroundColor: '#f8f9fa' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Freight</label>
                <input type="number" name="freight" value={formData.freight || 0} onChange={handleChange} step="0.01" min="0" style={{ ...inputStyle, borderColor: '#1a237e' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Round Off</label>
                <input type="number" name="roundOff" value={formData.roundOff || 0} onChange={handleChange} step="0.01" style={{ ...inputStyle, borderColor: '#1a237e' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Grand Total</label>
                <input value={formatCurrency(grandTotal)} readOnly style={{ ...inputStyle, fontWeight: 'bold', fontSize: '14px', color: '#1a237e', backgroundColor: '#e8eaf6' }} />
              </div>
            </div>

            {/* Row 6: Import Notes + Package */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Import Notes</label>
                <input name="importNotes" value={formData.importNotes || ''} onChange={handleChange} placeholder="Additional notes..." style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Package Type</label>
                <select name="packageType" value={formData.packageType} onChange={handleChange} style={{ ...inputStyle, height: '30px' }}>
                  {packageTypes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Package Qty</label>
                <input type="number" name="packageQuantity" value={formData.packageQuantity || 0} onChange={handleChange} min="0" placeholder="Nos" style={inputStyle} />
              </div>
            </div>

            {/* Row 7: Buttons - FIXED AT BOTTOM */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              borderTop: '1px solid #e0e0e0', 
              paddingTop: '8px', 
              flexShrink: 0,
              marginTop: 'auto',
              backgroundColor: 'white'
            }}>
              <button type="submit" disabled={loading} style={{ ...buttonStyle, background: '#1a237e' }}>
                {loading ? '⏳ Saving...' : editingId ? '✏️ Update Invoice' : '💾 Save Invoice'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={{ ...buttonStyle, background: '#6c757d' }}>Cancel</button>
              )}
              <button type="button" onClick={resetForm} style={{ ...buttonStyle, background: '#28a745' }}>➕ New</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '4px 8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '12px',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  height: '28px'
};

const buttonStyle = {
  padding: '6px 20px',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
};

export default PurchaseInvoice;
