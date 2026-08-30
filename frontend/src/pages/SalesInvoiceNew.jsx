import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

// VERSION: 2.0 - Stock & Purchase Price visible during entry
const API_BASE = 'https://atc-geca.onrender.com/api';
const FORM_VERSION = '2.0.1';

const SalesInvoice = () => {
  console.log('SalesInvoice version:', FORM_VERSION);
  
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Master Data - Customers
  const [customers] = useState([
    { id: 1, name: 'Faisal Khalid', address: 'G45 A, Muqarrar', city: 'Delhi', state: 'DELHI', stateCode: '07', country: 'India', contact: '+91 9818182021', gstin: '07ALFPK0050N2Z5', pan: 'ABCDE1234F' },
    { id: 2, name: 'M/s ALPINE SALES', address: 'First Floor, A-261, New Friends Colony', city: 'Delhi', state: 'DELHI', stateCode: '07', country: 'India', contact: '+91 9876543210', gstin: '07CBDPR8732C1ZM', pan: 'GHIJK5678L' },
    { id: 3, name: 'ABC Corp', address: '123 Main Street', city: 'Delhi', state: 'DELHI', stateCode: '07', country: 'India', contact: '+91 9876543211', gstin: 'ABCDE1234F', pan: 'MNOPQ9012R' },
  ]);

  // Master Data - Items
  const [availableItems] = useState([
    { id: 1, name: 'LED TV 32 inch', category: 'Electronics', hsn: '85287219', unit: 'PCS', stock: 25, purchaseRate: 15000, gstRate: 18 },
    { id: 2, name: 'Office Chair', category: 'Furniture', hsn: '94017100', unit: 'PCS', stock: 15, purchaseRate: 6000, gstRate: 12 },
    { id: 3, name: 'Mobile Phone', category: 'Electronics', hsn: '85171200', unit: 'PCS', stock: 30, purchaseRate: 12000, gstRate: 18 },
    { id: 4, name: 'Table', category: 'Furniture', hsn: '94036000', unit: 'PCS', stock: 10, purchaseRate: 8000, gstRate: 12 },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    salesInvoiceNo: '',
    salesInvoiceDate: new Date().toISOString().split('T')[0],
    orderNo: '',
    orderDate: new Date().toISOString().split('T')[0],
    bookNo: '',
    customerId: '',
    customer: '',
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
    consignee: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeState: '',
    consigneeStateCode: '',
    consigneeCountry: 'India',
    consigneeContact: '',
    consigneeGstin: '',
    consigneePan: '',
    transportName: '',
    mode: 'By Road',
    vehicleNo: '',
    grNo: '',
    grDate: '',
    freight: 0,
    roundOff: 0,
    glNo: '',
  });

  // Items - Start with 3 empty rows
  const [items, setItems] = useState([
    { id: 1, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, stock: 0, rate: 0, purchaseRate: 0, gst: 18, amount: 0 },
    { id: 2, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, stock: 0, rate: 0, purchaseRate: 0, gst: 18, amount: 0 },
    { id: 3, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, stock: 0, rate: 0, purchaseRate: 0, gst: 18, amount: 0 },
  ]);

  const [taxType, setTaxType] = useState('CGST+SGST');
  const [selectedBrand, setSelectedBrand] = useState('ATC');
  const [printStatus, setPrintStatus] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [invoiceCounter, setInvoiceCounter] = useState(742);

  const units = ['PCS', 'BOX', 'KG', 'LTR', 'MTR', 'GM', 'DZN', 'PKT', 'CTN', 'SET'];

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = items.reduce((sum, item) => sum + ((item.amount || 0) * ((item.gst || 0) / 100)), 0);
  const grandTotal = subtotal + taxAmount + (formData.freight || 0) + (formData.roundOff || 0);

  // Effects
  useEffect(() => {
    generateInvoiceNo();
    console.log('SalesInvoice v2.0.1 loaded - Stock & PP visible during entry');
  }, []);

  // Generate Invoice Number
  const generateInvoiceNo = () => {
    const now = new Date();
    const prefix = 'SI-';
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({
      ...prev,
      salesInvoiceNo: prefix + year + month + day + '-' + random
    }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Customer Selection
  const handleCustomerSelect = (e) => {
    const customerId = Number(e.target.value);
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerId: customerId,
        customer: selectedCustomer.name,
        address: selectedCustomer.address,
        city: selectedCustomer.city,
        state: selectedCustomer.state,
        stateCode: selectedCustomer.stateCode,
        country: selectedCustomer.country,
        contactNumber: selectedCustomer.contact,
        gstin: selectedCustomer.gstin || '',
        pan: selectedCustomer.pan || '',
        consignee: selectedCustomer.name,
        consigneeAddress: selectedCustomer.address,
        consigneeCity: selectedCustomer.city,
        consigneeState: selectedCustomer.state,
        consigneeStateCode: selectedCustomer.stateCode,
        consigneeCountry: selectedCustomer.country,
        consigneeContact: selectedCustomer.contact,
        consigneeGstin: selectedCustomer.gstin || '',
        consigneePan: selectedCustomer.pan || '',
      }));
    }
  };

  const handleCustomerNameChange = (e) => {
    setFormData(prev => ({ ...prev, customer: e.target.value }));
  };

  // Add new item row
  const addItem = () => {
    if (items.length < 10) {
      setItems([...items, {
        id: items.length + 1,
        category: '',
        description: '',
        hsn: '',
        unit: 'PCS',
        quantity: 1,
        stock: 0,
        rate: 0,
        purchaseRate: 0,
        gst: 18,
        amount: 0
      }]);
    }
  };

  // Remove item row
  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  // Update item field
  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    const item = { ...updatedItems[index], [field]: value };
    
    if (field === 'description') {
      const foundItem = availableItems.find(i => i.name.toLowerCase() === value.toLowerCase());
      if (foundItem) {
        item.category = foundItem.category || '';
        item.hsn = foundItem.hsn || '';
        item.unit = foundItem.unit || 'PCS';
        item.stock = foundItem.stock || 0;
        item.purchaseRate = foundItem.purchaseRate || 0;
        item.gst = foundItem.gstRate || 0;
      }
    }
    
    if (field === 'quantity' || field === 'rate') {
      item.amount = (item.quantity || 0) * (item.rate || 0);
    }
    
    updatedItems[index] = item;
    setItems(updatedItems);
  };

  // Enter Key Navigation Handler
  const handleItemKeyDown = (e, index, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentItem = items[index];
      
      // Field navigation order: category → description → quantity → rate → gst
      const fieldOrder = ['category', 'description', 'quantity', 'rate', 'gst'];
      const currentIndex = fieldOrder.indexOf(field);
      
      if (currentIndex < fieldOrder.length - 1) {
        // Move to next field
        const nextField = fieldOrder[currentIndex + 1];
        const inputId = `${nextField}_${index}`;
        const nextInput = document.getElementById(inputId);
        if (nextInput) nextInput.focus();
      } else {
        // Last field (gst) - move row to items list
        if (currentItem.description && currentItem.quantity > 0 && currentItem.rate > 0) {
          // Add the current item to the items list
          setItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...currentItem, amount: currentItem.quantity * currentItem.rate };
            return newItems;
          });
          // Create a new empty row
          addItem();
          // Focus on category of new row after a delay
          setTimeout(() => {
            const newIndex = items.length;
            const categoryInput = document.getElementById(`category_${newIndex}`);
            if (categoryInput) categoryInput.focus();
          }, 100);
        }
      }
    }
  };

  // Format Currency
  const formatCurrency = (amount) => {
    return '₹' + (amount || 0).toFixed(2);
  };

  // Reset Form
  const resetForm = () => {
    generateInvoiceNo();
    setFormData({
      salesInvoiceNo: '',
      salesInvoiceDate: new Date().toISOString().split('T')[0],
      orderNo: '',
      orderDate: new Date().toISOString().split('T')[0],
      bookNo: '',
      customerId: '',
      customer: '',
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
      consignee: '',
      consigneeAddress: '',
      consigneeCity: '',
      consigneeState: '',
      consigneeStateCode: '',
      consigneeCountry: 'India',
      consigneeContact: '',
      consigneeGstin: '',
      consigneePan: '',
      transportName: '',
      mode: 'By Road',
      vehicleNo: '',
      grNo: '',
      grDate: '',
      freight: 0,
      roundOff: 0,
      glNo: '',
    });
    setItems([
      { id: 1, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, stock: 0, rate: 0, purchaseRate: 0, gst: 18, amount: 0 },
      { id: 2, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, stock: 0, rate: 0, purchaseRate: 0, gst: 18, amount: 0 },
      { id: 3, category: '', description: '', hsn: '', unit: 'PCS', quantity: 1, stock: 0, rate: 0, purchaseRate: 0, gst: 18, amount: 0 },
    ]);
    setPrintStatus('');
  };

  return (
    <div style={{ padding: '10px', backgroundColor: '#f0f2f5', height: '100vh', overflow: 'hidden', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>📄 Sales Invoice v2.0</h1>
            <p style={{ color: '#666', fontSize: '11px', margin: '0' }}>Create and manage sales invoices</p>
          </div>
          {isSuperUser && <span style={{ padding: '2px 12px', backgroundColor: '#ff9800', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>🔒 Super User</span>}
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Row 1: Invoice Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px', flexShrink: 0 }}>
            <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Invoice No.</label><input name="salesInvoiceNo" value={formData.salesInvoiceNo} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
            <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Invoice Date</label><input type="date" name="salesInvoiceDate" value={formData.salesInvoiceDate} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
            <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Order No.</label><input name="orderNo" value={formData.orderNo} onChange={handleChange} placeholder="Order no" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
            <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Order Date</label><input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
            <div><label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Book No.</label><input name="bookNo" value={formData.bookNo} onChange={handleChange} placeholder="Book No." style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
          </div>

          {/* Row 2: Customer + Consignee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', flexShrink: 0 }}>
            {/* Customer */}
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '8px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a237e', margin: '0 0 6px 0' }}>👤 Customer (Billed to)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                <select name="customerId" value={formData.customerId} onChange={handleCustomerSelect} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '30px' }}>
                  <option value="">-- Select --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input name="customer" value={formData.customer} onChange={handleCustomerNameChange} placeholder="Or type new" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '30px' }} />
              </div>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px', marginBottom: '4px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                <input name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
                <input name="state" value={formData.state} onChange={handleChange} placeholder="State" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
                <input name="stateCode" value={formData.stateCode} onChange={handleChange} placeholder="State Code" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Phone" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
                <input name="gstin" value={formData.gstin} onChange={handleChange} placeholder="GST No." style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
                <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Document No." style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
              </div>
            </div>

            {/* Consignee */}
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '8px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a237e', margin: '0 0 6px 0' }}>📦 Consignee (Shipped to)</h4>
              <div style={{ background: '#e8f5e9', padding: '2px 8px', borderRadius: '3px', marginBottom: '4px', fontSize: '10px', color: '#2e7d32' }}>✅ Auto-filled from Customer</div>
              <input name="consignee" value={formData.consignee} onChange={handleChange} placeholder="Name" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px', marginBottom: '4px' }} />
              <input name="consigneeAddress" value={formData.consigneeAddress} onChange={handleChange} placeholder="Address" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px', marginBottom: '4px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                <input name="consigneeCity" value={formData.consigneeCity} onChange={handleChange} placeholder="City" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
                <input name="consigneeState" value={formData.consigneeState} onChange={handleChange} placeholder="State" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
                <input name="consigneeStateCode" value={formData.consigneeStateCode} onChange={handleChange} placeholder="State Code" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <input name="consigneeContact" value={formData.consigneeContact} onChange={handleChange} placeholder="Phone" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
                <input name="consigneeGstin" value={formData.consigneeGstin} onChange={handleChange} placeholder="GST No." style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} />
              </div>
            </div>
          </div>

          {/* Row 3: Transport Details */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '8px', marginBottom: '8px', flexShrink: 0 }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a237e', margin: '0 0 6px 0' }}>🚛 Transport Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
              <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>GR No.</label><input name="grNo" value={formData.grNo} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
              <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>GR Date</label><input type="date" name="grDate" value={formData.grDate} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
              <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>Transport Name</label><input name="transportName" value={formData.transportName} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
              <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>Mode</label><select name="mode" value={formData.mode} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '30px' }}><option>By Road</option><option>By Rail</option><option>By Air</option><option>Sea</option><option>Self</option></select></div>
              <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#555' }}>Vehicle No.</label><input name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
            </div>
          </div>

          {/* Row 4: Items Table */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '6px', marginBottom: '8px', maxHeight: '220px', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexShrink: 0 }}>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>📋 Sales Items</h4>
              <button type="button" onClick={addItem} style={{ padding: '2px 12px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>+ Add Item</button>
            </div>
            <div style={{ overflow: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#f5f7fa' }}>
                  <tr>
                    <th style={{ padding: '4px', textAlign: 'left', width: '20%', borderBottom: '2px solid #ddd' }}>Description</th>
                    <th style={{ padding: '4px', textAlign: 'left', width: '12%', borderBottom: '2px solid #ddd' }}>HSN</th>
                    <th style={{ padding: '4px', textAlign: 'left', width: '8%', borderBottom: '2px solid #ddd' }}>Unit</th>
                    <th style={{ padding: '4px', textAlign: 'center', width: '15%', borderBottom: '2px solid #ddd' }}>Qty / S</th>
                    <th style={{ padding: '4px', textAlign: 'right', width: '20%', borderBottom: '2px solid #ddd' }}>Rate / PP</th>
                    <th style={{ padding: '4px', textAlign: 'center', width: '8%', borderBottom: '2px solid #ddd' }}>GST%</th>
                    <th style={{ padding: '4px', textAlign: 'right', width: '12%', borderBottom: '2px solid #ddd' }}>Amount</th>
                    <th style={{ padding: '4px', textAlign: 'center', width: '8%', borderBottom: '2px solid #ddd' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <Fragment key={item.id}>
                      <tr style={{ background: '#f0f4f0' }}>
                        <td colSpan="8" style={{ padding: '2px 5px', border: '1px solid #ddd', fontWeight: 'bold', color: '#1b5e20' }}>
                          <input 
                            id={`category_${index}`}
                            type="text" 
                            placeholder="Select Category" 
                            value={item.category || ''} 
                            onChange={(e) => updateItem(index, 'category', e.target.value)} 
                            onKeyDown={(e) => handleItemKeyDown(e, index, 'category')}
                            style={{ width: '100%', padding: '2px 4px', border: 'none', background: 'transparent', fontWeight: 'bold', color: '#1b5e20', fontSize: '9px' }} 
                            list="categorySuggestions" 
                          />
                          <datalist id="categorySuggestions">
                            {[...new Set(availableItems.map(i => i.category))].map(cat => <option key={cat} value={cat} />)}
                          </datalist>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', paddingLeft: '20px' }}>
                          <input 
                            id={`description_${index}`}
                            type="text" 
                            placeholder="Item" 
                            value={item.description || ''} 
                            onChange={(e) => updateItem(index, 'description', e.target.value)} 
                            onKeyDown={(e) => handleItemKeyDown(e, index, 'description')}
                            style={{ width: '100%', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '9px' }} 
                            list="itemSuggestions" 
                          />
                          <datalist id="itemSuggestions">{availableItems.map(i => <option key={i.id} value={i.name} />)}</datalist>
                        </td>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <input 
                            id={`hsn_${index}`}
                            type="text" 
                            value={item.hsn || ''} 
                            readOnly 
                            style={{ width: '100%', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '9px', background: '#f5f5f5', textAlign: 'center' }} 
                          />
                        </td>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <input 
                            id={`unit_${index}`}
                            type="text" 
                            value={item.unit || 'PCS'} 
                            readOnly 
                            style={{ width: '100%', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '9px', background: '#f5f5f5', textAlign: 'center' }} 
                          />
                        </td>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                            <input 
                              id={`quantity_${index}`}
                              type="number" 
                              value={item.quantity || 1} 
                              onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} 
                              onKeyDown={(e) => handleItemKeyDown(e, index, 'quantity')}
                              style={{ width: '55px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '9px', textAlign: 'center' }} 
                            />
                            <span style={{ fontSize: '10px', color: '#1a237e', fontWeight: 'bold' }}>
                              S:{item.stock || 0}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <input 
                              id={`rate_${index}`}
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={item.rate || 0} 
                              onChange={(e) => updateItem(index, 'rate', Number(e.target.value))} 
                              onKeyDown={(e) => handleItemKeyDown(e, index, 'rate')}
                              style={{ width: '90px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '9px', textAlign: 'right' }} 
                            />
                            <span style={{ fontSize: '10px', color: '#666' }}>
                              PP:{item.purchaseRate || 0}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <select 
                            id={`gst_${index}`}
                            value={item.gst || 0} 
                            onChange={(e) => updateItem(index, 'gst', Number(e.target.value))} 
                            onKeyDown={(e) => handleItemKeyDown(e, index, 'gst')}
                            style={{ width: '100%', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '9px' }}
                          >
                            <option value={0}>0%</option><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option>
                          </select>
                        </td>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                          {formatCurrency(item.amount)}
                        </td>
                        <td style={{ padding: '2px 5px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeItem(index)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 5: Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
            <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Subtotal</label><input value={formatCurrency(subtotal)} readOnly style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px', fontWeight: 'bold', backgroundColor: '#f8f9fa' }} /></div>
            <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Tax Amount</label><input value={formatCurrency(taxAmount)} readOnly style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px', fontWeight: 'bold', backgroundColor: '#f8f9fa' }} /></div>
            <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Freight</label><input type="number" name="freight" value={formData.freight || 0} onChange={handleChange} step="0.01" min="0" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px', borderColor: '#1a237e' }} /></div>
            <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Round Off</label><input type="number" name="roundOff" value={formData.roundOff || 0} onChange={handleChange} step="0.01" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px', borderColor: '#1a237e' }} /></div>
            <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Grand Total</label><input value={formatCurrency(grandTotal)} readOnly style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', height: '28px', fontWeight: 'bold', color: '#1a237e', backgroundColor: '#e8eaf6' }} /></div>
          </div>

          {/* Row 6: G/L No. + Tax Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
            <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>G/L No.</label><input name="glNo" value={formData.glNo || ''} onChange={handleChange} placeholder="dd-yyyy" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '28px' }} /></div>
            <div><label style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>Tax Type</label><select value={taxType} onChange={(e) => setTaxType(e.target.value)} style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', height: '30px' }}><option value="CGST+SGST">CGST+SGST</option><option value="IGST">IGST</option><option value="NIL">NIL</option></select></div>
            <div></div>
          </div>

          {/* Row 7: OK Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', flexShrink: 0 }}>
            <button type="button" onClick={resetForm} style={{ padding: '6px 24px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>OK</button>
          </div>

          {/* Row 8: Brand + Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', borderTop: '1px solid #e0e0e0', paddingTop: '8px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Brand:</label>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '11px' }}>
                <option value="ATC">ATC</option>
                <option value="Zebaish">Zebaish</option>
                <option value="Signature Spread">Signature Spread</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => alert('Print & Save')} style={{ padding: '6px 16px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🖨️ Print & Save</button>
              <button type="button" onClick={() => alert('Send & Save')} style={{ padding: '6px 16px', background: '#25D366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>📱 Send & Save</button>
              <button type="button" onClick={resetForm} style={{ padding: '6px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>➕ New</button>
              {isSuperUser && (
                <button type="button" onClick={() => setShowCorrectionModal(true)} style={{ padding: '6px 16px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🔄 Correction</button>
              )}
            </div>
          </div>

          {printStatus && <div style={{ padding: '4px 10px', borderRadius: '3px', fontSize: '10px', marginTop: '6px', background: printStatus.includes('❌') ? '#ffebee' : '#e8f5e9', borderLeft: '3px solid ' + (printStatus.includes('❌') ? '#e74c3c' : '#1b5e20') }}>{printStatus}</div>}
        </div>
      </div>

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '6px', maxWidth: '350px', width: '100%' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0 }}>Create Correction</h2>
            <p style={{ fontSize: '11px', color: '#666' }}>Invoice: <strong>{formData.salesInvoiceNo}</strong></p>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Reason *</label>
              <input type="text" value={formData.correctionReason || ''} onChange={handleChange} placeholder="Reason" style={{ width: '100%', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '11px', marginTop: '2px' }} />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => { setShowCorrectionModal(false); setPrintStatus('Correction saved!'); }} style={{ padding: '4px 12px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1, fontSize: '11px' }}>Save</button>
              <button onClick={() => setShowCorrectionModal(false)} style={{ padding: '4px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoice;
