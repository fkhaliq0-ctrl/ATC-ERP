import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = 'https://atc-geca.onrender.com/api';

const SalesInvoice = () => {
  const [isSuperUser, setIsSuperUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Faisal Khaliq', address: 'G45 A, Maupur', city: 'Delhi', state: 'Delhi', stateCode: '07', country: 'India', phone: '+91 9818182021', gstin: '07ALFPK0050N2Z5', pan: 'ALFPK0050N' },
    { id: 2, name: 'Rajesh Kumar', address: '123 Main Road', city: 'Mumbai', state: 'Maharashtra', stateCode: '27', country: 'India', phone: '+91 9876543210', gstin: '27AAAAA0000A1Z5', pan: 'ABCDE1234F' },
    { id: 3, name: 'Priya Singh', address: '456 Park Avenue', city: 'Bangalore', state: 'Karnataka', stateCode: '29', country: 'India', phone: '+91 9876543211', gstin: '29BBBBB0000B1Z5', pan: 'FGHIJ5678K' },
  ]);

  const [itemMaster, setItemMaster] = useState([
    { id: 1, category: 'Electronics', description: 'LED TV 32 Inch', hsn: '85287219', unit: 'PCS', gst: 18, purchasePrice: 15000, freight: 500, otherCharges: 200, stock: 25 },
    { id: 2, category: 'Furniture', description: 'Office Chair', hsn: '94017100', unit: 'PCS', gst: 12, purchasePrice: 4500, freight: 300, otherCharges: 100, stock: 15 },
    { id: 3, category: 'Electronics', description: 'Smartphone 5G', hsn: '85171200', unit: 'PCS', gst: 18, purchasePrice: 25000, freight: 200, otherCharges: 100, stock: 40 },
    { id: 4, category: 'Clothing', description: 'Cotton T-Shirt', hsn: '61091000', unit: 'DZN', gst: 5, purchasePrice: 1200, freight: 100, otherCharges: 50, stock: 100 },
    { id: 5, category: 'Stationery', description: 'A4 Paper 500 Sheets', hsn: '48201000', unit: 'BOX', gst: 12, purchasePrice: 350, freight: 50, otherCharges: 20, stock: 200 },
  ]);

  const [formData, setFormData] = useState({
    salesInvoiceNo: 'SI-001',
    salesInvoiceDate: new Date().toISOString().split('T')[0],
    bookNo: '',
    customerOrderNo: '',
    orderDate: new Date().toISOString().split('T')[0],
    customerId: '',
    customer: '',
    address: '',
    city: '',
    state: '',
    stateCode: '',
    country: 'India',
    phone: '',
    customerDocType: 'GST No.',
    customerDocNumber: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeState: '',
    consigneeStateCode: '',
    consigneeCountry: 'India',
    consigneePhone: '',
    consigneeDocType: 'GST No.',
    consigneeDocNumber: '',
    grNo: '',
    grDate: '',
    transportName: '',
    mode: 'Road',
    vehicleNo: '',
    packages: 0,
    brand: 'Allied Trading Corporation',
    freight: 0,
    roundOff: 0,
  });

  const [entryItem, setEntryItem] = useState({
    id: 0,
    categoryId: '',
    category: '',
    description: '',
    hsn: '',
    unit: '',
    quantity: 1,
    stock: 0,
    rate: '',
    purchasePrice: 0,
    gst: 0,
    amount: 0
  });

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const categoryRefs = useRef([]);
  const descriptionRefs = useRef([]);
  const hsnRefs = useRef([]);
  const unitRefs = useRef([]);
  const qtyRefs = useRef([]);
  const rateRefs = useRef([]);

  const documentTypes = ['GST No.', 'PAN No.', 'Aadhaar No.'];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = 'input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}input[type=number]{-moz-appearance:textfield;appearance:textfield;}';
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    generateInvoiceNo();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (e) => {
    const customerId = Number(e.target.value);
    if (customerId === -1) {
      setFormData(prev => ({
        ...prev,
        customerId: '',
        customer: '',
        address: '',
        city: '',
        state: '',
        stateCode: '',
        country: 'India',
        phone: '',
        customerDocNumber: '',
        consigneeName: '',
        consigneeAddress: '',
        consigneeCity: '',
        consigneeState: '',
        consigneeStateCode: '',
        consigneeCountry: 'India',
        consigneePhone: '',
        consigneeDocNumber: '',
      }));
      return;
    }
    
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
        phone: selectedCustomer.phone,
        customerDocNumber: selectedCustomer.gstin || '',
        consigneeName: selectedCustomer.name,
        consigneeAddress: selectedCustomer.address,
        consigneeCity: selectedCustomer.city,
        consigneeState: selectedCustomer.state,
        consigneeStateCode: selectedCustomer.stateCode,
        consigneeCountry: selectedCustomer.country,
        consigneePhone: selectedCustomer.phone,
        consigneeDocNumber: selectedCustomer.gstin || '',
      }));
    }
  };

  const handleEntryCategorySelect = (categoryId) => {
    const selectedItem = itemMaster.find(item => item.id === Number(categoryId));
    if (selectedItem) {
      setEntryItem({
        ...entryItem,
        categoryId: selectedItem.id,
        category: selectedItem.category,
        description: selectedItem.description,
        hsn: selectedItem.hsn,
        unit: selectedItem.unit,
        stock: selectedItem.stock || 0,
        purchasePrice: selectedItem.purchasePrice + selectedItem.freight + selectedItem.otherCharges,
        gst: selectedItem.gst,
        amount: entryItem.quantity * (entryItem.rate || 0)
      });
    }
  };

  const updateEntryItem = (field, value) => {
    const updated = { ...entryItem, [field]: value };
    updated.amount = updated.quantity * (updated.rate || 0);
    setEntryItem(updated);
  };

  const addCompletedItem = () => {
    if (!entryItem.categoryId || entryItem.quantity <= 0 || !entryItem.rate || entryItem.rate <= 0) {
      alert('Please select Category, Qty and Rate');
      return false;
    }
    
    const existingItem = items.find(item => item.categoryId === entryItem.categoryId);
    if (existingItem) {
      const confirmAdd = window.confirm('This item is already added. Do you want to add it again?');
      if (!confirmAdd) {
        return false;
      }
    }
    
    const newItem = {
      ...entryItem,
      id: items.length + 1,
      rate: Number(entryItem.rate)
    };
    setItems([...items, newItem]);

    setEntryItem({
      id: 0,
      categoryId: '',
      category: '',
      description: '',
      hsn: '',
      unit: '',
      quantity: 1,
      stock: 0,
      rate: '',
      purchasePrice: 0,
      gst: 0,
      amount: 0
    });

    setTimeout(() => {
      if (categoryRefs.current[0]) {
        categoryRefs.current[0].focus();
      }
    }, 100);

    calculateTotal([...items, newItem]);
    return true;
  };

  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleEntryKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (field === 'category') {
        if (categoryRefs.current[0]) {
          categoryRefs.current[0].click();
          categoryRefs.current[0].focus();
        }
        return;
      }
      
      const fields = ['description', 'hsn', 'unit', 'quantity', 'rate'];
      const currentFieldIndex = fields.indexOf(field);
      const nextField = fields[currentFieldIndex + 1];
      
      if (field === 'rate') {
        const added = addCompletedItem();
        if (added) {
          setTimeout(() => {
            if (categoryRefs.current[0]) {
              categoryRefs.current[0].focus();
            }
          }, 100);
        }
        return;
      }
      
      if (nextField) {
        let targetRef = null;
        switch(nextField) {
          case 'description': targetRef = descriptionRefs.current[0]; break;
          case 'hsn': targetRef = hsnRefs.current[0]; break;
          case 'unit': targetRef = unitRefs.current[0]; break;
          case 'quantity': targetRef = qtyRefs.current[0]; break;
          case 'rate': targetRef = rateRefs.current[0]; break;
          default: targetRef = null;
        }
        if (targetRef) {
          targetRef.focus();
          if (targetRef.tagName === 'SELECT') {
            targetRef.click();
          }
        }
      }
    }
  };

  const handleEnterPrevent = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs = e.target.closest('form').querySelectorAll('input, select');
      const currentIndex = Array.from(inputs).indexOf(e.target);
      if (currentIndex > -1 && currentIndex < inputs.length - 1) {
        const nextInput = inputs[currentIndex + 1];
        if (nextInput) {
          nextInput.focus();
          if (nextInput.tagName === 'SELECT') {
            nextInput.click();
          }
        }
      }
    }
  };

  const calculateTotal = (updatedItems) => {
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = updatedItems.reduce((sum, item) => {
      const itemTax = (item.amount || 0) * ((item.gst || 0) / 100);
      return sum + itemTax;
    }, 0);
    const grandTotal = subtotal + taxAmount + (formData.freight || 0) + (formData.roundOff || 0);
    setTotal(grandTotal);
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₹0.00';
    }
    return '₹' + amount.toFixed(2);
  };

  const generateFileName = (customerName, invoiceNo) => {
    if (!customerName || customerName.trim() === '') {
      return 'Invoice_' + invoiceNo;
    }
    
    const nameParts = customerName.trim().split(/\s+/);
    let fileName = '';
    
    if (nameParts.length === 1) {
      fileName = nameParts[0];
    } else if (nameParts.length === 2) {
      fileName = nameParts[0];
    } else {
      fileName = nameParts.map(function(part) {
        return part.charAt(0).toUpperCase();
      }).join('');
    }
    
    fileName = fileName.replace(/[^a-zA-Z0-9]/g, '');
    
    return fileName + 'Invoice' + invoiceNo;
  };

  const saveAndGeneratePDF = async (sendWhatsApp) => {
    if (entryItem.categoryId && entryItem.quantity > 0 && entryItem.rate) {
      addCompletedItem();
    }
    
    if (items.length === 0) {
      alert('Please add at least one item to the invoice.');
      return;
    }

    setLoading(true);
    try {
      const invoiceData = { 
        ...formData, 
        items: items,
        customerName: formData.customer || 'Walk-in Customer',
        customerPhone: formData.phone || '',
        outstandingAmount: 0,
        totalAmount: grandTotal,
        invoiceNo: formData.salesInvoiceNo,
        customerDocType: formData.customerDocType,
        customerDocNumber: formData.customerDocNumber,
        packages: formData.packages || 0,
      };

      const saveUrl = editingId ? API_BASE + '/sales-invoices/' + editingId + '/' : API_BASE + '/sales-invoices/';
      const saveMethod = editingId ? 'put' : 'post';
      const saveResponse = await axios[saveMethod](saveUrl, invoiceData);
      
      if (saveResponse.status === 200 || saveResponse.status === 201) {
        const savedInvoice = saveResponse.data;
        const invoiceId = savedInvoice.id || editingId;
        
        const fileName = generateFileName(formData.customer || 'Walk-in', formData.salesInvoiceNo);
        
        let outstandingAmount = 0;
        try {
          const ledgerResponse = await axios.get(API_BASE + '/customer-ledger/' + (formData.customerId || 0) + '/');
          if (ledgerResponse.data && ledgerResponse.data.outstanding) {
            outstandingAmount = ledgerResponse.data.outstanding;
          }
        } catch (err) {
          console.log('Could not fetch outstanding amount, using 0');
        }
        
        const pdfResponse = await axios.post(API_BASE + '/generate-pdf/', {
          invoice_id: invoiceId,
          invoice_type: 'sales',
          file_name: fileName,
          save_path: 'C:\\Users\\Lenovo\\Desktop\\ATC_Invoices',
          send_whatsapp: sendWhatsApp || false,
          whatsapp_message: sendWhatsApp ? 'Dear Customer, your invoice has been generated. Invoice No: ' + formData.salesInvoiceNo + ', Amount: ' + formatCurrency(grandTotal) + ', Total outstanding: ' + formatCurrency(outstandingAmount) + ', Thank you for your business! Allied Trading Corporation' : '',
          packages: formData.packages || 0,
        }, {
          responseType: 'blob'
        });

        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        if (sendWhatsApp) {
          alert('Invoice saved and sent via WhatsApp to customer!');
        } else {
          alert('Invoice saved and PDF downloaded!');
        }
        
        resetForm();
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveAndGeneratePDF(false);
  };

  const handleEdit = (invoice) => {
    if (!isSuperUser) {
      alert('Only Super User can edit invoices.');
      return;
    }
    setEditingId(invoice.id);
    setFormData({
      salesInvoiceNo: invoice.salesInvoiceNo || 'SI-001',
      salesInvoiceDate: invoice.salesInvoiceDate || new Date().toISOString().split('T')[0],
      bookNo: invoice.bookNo || '',
      customerOrderNo: invoice.customerOrderNo || '',
      orderDate: invoice.orderDate || new Date().toISOString().split('T')[0],
      customerId: invoice.customerId || '',
      customer: invoice.customer || '',
      address: invoice.address || '',
      city: invoice.city || '',
      state: invoice.state || '',
      stateCode: invoice.stateCode || '',
      country: invoice.country || 'India',
      phone: invoice.phone || '',
      customerDocType: invoice.customerDocType || 'GST No.',
      customerDocNumber: invoice.customerDocNumber || '',
      consigneeName: invoice.consigneeName || '',
      consigneeAddress: invoice.consigneeAddress || '',
      consigneeCity: invoice.consigneeCity || '',
      consigneeState: invoice.consigneeState || '',
      consigneeStateCode: invoice.consigneeStateCode || '',
      consigneeCountry: invoice.consigneeCountry || 'India',
      consigneePhone: invoice.consigneePhone || '',
      consigneeDocType: invoice.consigneeDocType || 'GST No.',
      consigneeDocNumber: invoice.consigneeDocNumber || '',
      grNo: invoice.grNo || '',
      grDate: invoice.grDate || '',
      transportName: invoice.transportName || '',
      mode: invoice.mode || 'Road',
      vehicleNo: invoice.vehicleNo || '',
      packages: invoice.packages || 0,
      brand: invoice.brand || 'Allied Trading Corporation',
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
      salesInvoiceNo: 'SI-001',
      salesInvoiceDate: new Date().toISOString().split('T')[0],
      bookNo: '',
      customerOrderNo: '',
      orderDate: new Date().toISOString().split('T')[0],
      customerId: '',
      customer: '',
      address: '',
      city: '',
      state: '',
      stateCode: '',
      country: 'India',
      phone: '',
      customerDocType: 'GST No.',
      customerDocNumber: '',
      consigneeName: '',
      consigneeAddress: '',
      consigneeCity: '',
      consigneeState: '',
      consigneeStateCode: '',
      consigneeCountry: 'India',
      consigneePhone: '',
      consigneeDocType: 'GST No.',
      consigneeDocNumber: '',
      grNo: '',
      grDate: '',
      transportName: '',
      mode: 'Road',
      vehicleNo: '',
      packages: 0,
      brand: 'Allied Trading Corporation',
      freight: 0,
      roundOff: 0,
    });
    setItems([]);
    setEntryItem({
      id: 0,
      categoryId: '',
      category: '',
      description: '',
      hsn: '',
      unit: '',
      quantity: 1,
      stock: 0,
      rate: '',
      purchasePrice: 0,
      gst: 0,
      amount: 0
    });
    setTotal(0);
    generateInvoiceNo();
    setTimeout(() => {
      if (categoryRefs.current[0]) {
        categoryRefs.current[0].focus();
      }
    }, 100);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = items.reduce((sum, item) => {
    const itemTax = (item.amount || 0) * ((item.gst || 0) / 100);
    return sum + itemTax;
  }, 0);
  const grandTotal = subtotal + taxAmount + (formData.freight || 0) + (formData.roundOff || 0);

  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#f0f2f5',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>Sales Invoice</h1>
            <p style={{ color: '#666', fontSize: '12px', margin: '2px 0 0 0' }}>
              {editingId ? 'Edit Sales Invoice' : 'Create and manage sales invoices'}
            </p>
          </div>
          {isSuperUser && <span style={{ padding: '3px 12px', backgroundColor: '#ff9800', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>Super User</span>}
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '6px', flexShrink: 0 }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Invoice No.</label>
                <input name="salesInvoiceNo" value={formData.salesInvoiceNo} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Invoice Date</label>
                <input type="date" name="salesInvoiceDate" value={formData.salesInvoiceDate} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Book No.</label>
                <input name="bookNo" value={formData.bookNo} onChange={handleChange} placeholder="Book No" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Customer Order No.</label>
                <input name="customerOrderNo" value={formData.customerOrderNo} onChange={handleChange} placeholder="Order no" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Order Date</label>
                <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px', flexShrink: 0 }}>
              <div style={{ border: '1px solid #e8ecf1', borderRadius: '6px', padding: '6px 8px', background: '#fafbfc' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a237e', margin: '0 0 4px 0' }}>Customer (Billed to)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                  <select name="customerId" value={formData.customerId} onChange={handleCustomerSelect} style={{ ...inputStyle, height: '24px', fontSize: '10px' }}>
                    <option value="">-- Select --</option>
                    <option value="-1">+ Add New</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input name="customer" value={formData.customer} onChange={handleChange} placeholder="Customer Name" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px', marginTop: '3px' }}>
                  <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="State" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px', marginTop: '3px' }}>
                  <input name="stateCode" value={formData.stateCode} onChange={handleChange} placeholder="State Code" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <select name="customerDocType" value={formData.customerDocType} onChange={handleChange} style={{ ...inputStyle, height: '24px', fontSize: '10px' }}>
                    {documentTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginTop: '3px' }}>
                  <input name="customerDocNumber" value={formData.customerDocNumber} onChange={handleChange} placeholder="Document No." style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                </div>
              </div>

              <div style={{ border: '1px solid #e8ecf1', borderRadius: '6px', padding: '6px 8px', background: '#fafbfc' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a237e', margin: '0 0 4px 0' }}>Consignee (Shipped to)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                  <input name="consigneeName" value={formData.consigneeName} onChange={handleChange} placeholder="Name" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <input name="consigneeAddress" value={formData.consigneeAddress} onChange={handleChange} placeholder="Address" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px', marginTop: '3px' }}>
                  <input name="consigneeCity" value={formData.consigneeCity} onChange={handleChange} placeholder="City" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <input name="consigneeState" value={formData.consigneeState} onChange={handleChange} placeholder="State" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <input name="consigneeStateCode" value={formData.consigneeStateCode} onChange={handleChange} placeholder="State Code" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px', marginTop: '3px' }}>
                  <input name="consigneePhone" value={formData.consigneePhone} onChange={handleChange} placeholder="Phone" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                  <select name="consigneeDocType" value={formData.consigneeDocType} onChange={handleChange} style={{ ...inputStyle, height: '24px', fontSize: '10px' }}>
                    {documentTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input name="consigneeDocNumber" value={formData.consigneeDocNumber} onChange={handleChange} placeholder="Document No." style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginTop: '3px' }}>
                  <input name="consigneeCountry" value={formData.consigneeCountry} onChange={handleChange} placeholder="Country" style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '6px', flexShrink: 0 }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>GR No. <span style={{ color: '#999', fontSize: '8px' }}>(optional)</span></label>
                <input name="grNo" value={formData.grNo} onChange={handleChange} onKeyDown={handleEnterPrevent} style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Transporter Name <span style={{ color: '#999', fontSize: '8px' }}>(optional)</span></label>
                <input name="transportName" value={formData.transportName} onChange={handleChange} onKeyDown={handleEnterPrevent} style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>GR Date <span style={{ color: '#999', fontSize: '8px' }}>(optional)</span></label>
                <input type="date" name="grDate" value={formData.grDate} onChange={handleChange} onKeyDown={handleEnterPrevent} style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Mode</label>
                <select name="mode" value={formData.mode} onChange={handleChange} onKeyDown={handleEnterPrevent} style={{ ...inputStyle, height: '24px', fontSize: '10px' }}>
                  <option>Road</option><option>Rail</option><option>Air</option><option>Sea</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Vehicle No.</label>
                <input name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} onKeyDown={handleEnterPrevent} style={{ ...inputStyle, height: '24px', fontSize: '10px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', marginBottom: '6px', flexShrink: 0 }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>No. of Packages</label>
                <input 
                  type="number" 
                  name="packages" 
                  value={formData.packages || 0} 
                  onChange={handleChange} 
                  onKeyDown={handleEnterPrevent}
                  style={{ ...inputStyle, height: '24px', fontSize: '10px', width: '200px' }} 
                  placeholder="e.g., 5 Rolls"
                />
              </div>
            </div>

            <div style={{ 
              border: '1px solid #e8ecf1', 
              borderRadius: '6px', 
              padding: '6px', 
              marginBottom: '6px',
              height: '150px',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflow: 'hidden',
              background: '#fafbfc'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', flexShrink: 0 }}>
                <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a237e', margin: 0 }}>Sales Items</h4>
                <span style={{ fontSize: '9px', color: '#888' }}>Category (Enter to open) -- Rate (Enter to add)</span>
              </div>
              <div style={{ 
                overflowY: 'auto',
                flex: 1,
                minHeight: 0
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#eef1f5' }}>
                    <tr>
                      <th style={{ padding: '3px 4px', textAlign: 'left', width: '3%' }}>#</th>
                      <th style={{ padding: '3px 4px', textAlign: 'left', width: '12%' }}>Category</th>
                      <th style={{ padding: '3px 4px', textAlign: 'left', width: '16%' }}>Description</th>
                      <th style={{ padding: '3px 4px', textAlign: 'left', width: '8%' }}>HSN</th>
                      <th style={{ padding: '3px 4px', textAlign: 'left', width: '6%' }}>Unit</th>
                      <th style={{ padding: '3px 4px', textAlign: 'center', width: '6%' }}>Qty</th>
                      <th style={{ padding: '3px 4px', textAlign: 'center', width: '4%' }}>S</th>
                      <th style={{ padding: '3px 4px', textAlign: 'right', width: '10%' }}>Rate</th>
                      <th style={{ padding: '3px 4px', textAlign: 'right', width: '10%' }}>Pur. Price</th>
                      <th style={{ padding: '3px 4px', textAlign: 'center', width: '5%' }}>GST%</th>
                      <th style={{ padding: '3px 4px', textAlign: 'right', width: '10%' }}>Amount</th>
                      <th style={{ padding: '3px 4px', textAlign: 'center', width: '5%' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ 
                      background: '#f8f9fa',
                      borderLeft: '3px solid #1a237e'
                    }}>
                      <td style={{ padding: '2px 4px', fontWeight: 'bold', color: '#1a237e', fontSize: '10px' }}>►</td>
                      <td style={{ padding: '2px 4px' }}>
                        <select 
                          ref={el => { categoryRefs.current[0] = el; }}
                          value={entryItem.categoryId || ''} 
                          onChange={(e) => handleEntryCategorySelect(e.target.value)}
                          onKeyDown={(e) => handleEntryKeyDown(e, 'category')}
                          style={{ 
                            ...inputStyle, 
                            height: '24px', 
                            fontSize: '9px', 
                            borderColor: '#1a237e',
                            borderWidth: '1.5px',
                            background: '#ffffff'
                          }}
                        >
                          <option value="">-- Select Category --</option>
                          {itemMaster.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.category}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '2px 4px' }}>
                        <input 
                          ref={el => { descriptionRefs.current[0] = el; }}
                          type="text" 
                          placeholder="Item" 
                          value={entryItem.description || ''} 
                          onChange={(e) => updateEntryItem('description', e.target.value)} 
                          onKeyDown={(e) => handleEntryKeyDown(e, 'description')}
                          style={{ 
                            ...inputStyle, 
                            height: '24px', 
                            fontSize: '9px', 
                            borderColor: '#1a237e',
                            borderWidth: '1.5px',
                            background: '#ffffff'
                          }} 
                          readOnly
                        />
                      </td>
                      <td style={{ padding: '2px 4px' }}>
                        <input 
                          ref={el => { hsnRefs.current[0] = el; }}
                          type="text" 
                          placeholder="HSN" 
                          value={entryItem.hsn || ''} 
                          onChange={(e) => updateEntryItem('hsn', e.target.value)} 
                          onKeyDown={(e) => handleEntryKeyDown(e, 'hsn')}
                          style={{ 
                            ...inputStyle, 
                            height: '24px', 
                            fontSize: '9px', 
                            borderColor: '#1a237e',
                            borderWidth: '1.5px',
                            background: '#ffffff'
                          }} 
                          readOnly
                        />
                      </td>
                      <td style={{ padding: '2px 4px' }}>
                        <input 
                          ref={el => { unitRefs.current[0] = el; }}
                          type="text" 
                          placeholder="Unit" 
                          value={entryItem.unit || ''} 
                          onChange={(e) => updateEntryItem('unit', e.target.value)} 
                          onKeyDown={(e) => handleEntryKeyDown(e, 'unit')}
                          style={{ 
                            ...inputStyle, 
                            height: '24px', 
                            fontSize: '9px', 
                            borderColor: '#1a237e',
                            borderWidth: '1.5px',
                            background: '#ffffff'
                          }} 
                          readOnly
                        />
                      </td>
                      <td style={{ padding: '2px 4px', textAlign: 'center' }}>
                        <input 
                          ref={el => { qtyRefs.current[0] = el; }}
                          type="number" 
                          min="1" 
                          value={entryItem.quantity || 1} 
                          onChange={(e) => updateEntryItem('quantity', Number(e.target.value))} 
                          onKeyDown={(e) => handleEntryKeyDown(e, 'quantity')}
                          style={{ 
                            ...inputStyle, 
                            width: '40px', 
                            height: '24px', 
                            textAlign: 'center', 
                            fontSize: '9px',
                            borderColor: '#1a237e',
                            borderWidth: '1.5px',
                            background: '#ffffff'
                          }} 
                        />
                      </td>
                      <td style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontSize: '9px' }}>
                        {entryItem.stock !== undefined ? entryItem.stock : 0}
                      </td>
                      <td style={{ padding: '2px 4px', textAlign: 'right' }}>
                        <input 
                          ref={el => { rateRefs.current[0] = el; }}
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={entryItem.rate || ''} 
                          onChange={(e) => updateEntryItem('rate', Number(e.target.value))} 
                          onKeyDown={(e) => handleEntryKeyDown(e, 'rate')}
                          style={{ 
                            ...inputStyle, 
                            width: '60px', 
                            height: '24px', 
                            textAlign: 'right', 
                            fontSize: '9px',
                            borderColor: '#1a237e',
                            borderWidth: '1.5px',
                            background: '#ffffff'
                          }} 
                          placeholder="0"
                        />
                      </td>
                      <td style={{ padding: '2px 4px', textAlign: 'right', fontWeight: 'bold', fontSize: '8px', color: '#e65100' }}>
                        {formatCurrency(entryItem.purchasePrice)}
                      </td>
                      <td style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontSize: '9px' }}>
                        {entryItem.gst || 0}%
                      </td>
                      <td style={{ padding: '2px 4px', textAlign: 'right', fontWeight: 'bold', fontSize: '9px' }}>{formatCurrency(entryItem.amount)}</td>
                      <td style={{ padding: '2px 4px', textAlign: 'center' }}>
                        <span style={{ fontSize: '8px', color: '#1a237e', fontWeight: 'bold' }}>●</span>
                      </td>
                    </tr>

                    {items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '2px 4px', fontSize: '9px' }}>{item.id}</td>
                        <td style={{ padding: '2px 4px' }}>
                          <input type="text" value={item.category || ''} style={{ ...inputStyle, height: '24px', fontSize: '9px', background: '#f8f9fa', borderColor: '#e8ecf1' }} readOnly />
                        </td>
                        <td style={{ padding: '2px 4px' }}>
                          <input type="text" value={item.description || ''} style={{ ...inputStyle, height: '24px', fontSize: '9px', background: '#f8f9fa', borderColor: '#e8ecf1' }} readOnly />
                        </td>
                        <td style={{ padding: '2px 4px' }}>
                          <input type="text" value={item.hsn || ''} style={{ ...inputStyle, height: '24px', fontSize: '9px', background: '#f8f9fa', borderColor: '#e8ecf1' }} readOnly />
                        </td>
                        <td style={{ padding: '2px 4px' }}>
                          <input type="text" value={item.unit || ''} style={{ ...inputStyle, height: '24px', fontSize: '9px', background: '#f8f9fa', borderColor: '#e8ecf1' }} readOnly />
                        </td>
                        <td style={{ padding: '2px 4px', textAlign: 'center' }}>
                          <input type="number" value={item.quantity || 0} style={{ ...inputStyle, width: '40px', height: '24px', textAlign: 'center', fontSize: '9px', background: '#f8f9fa', borderColor: '#e8ecf1' }} readOnly />
                        </td>
                        <td style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontSize: '9px' }}>
                          {item.stock !== undefined ? item.stock : 0}
                        </td>
                        <td style={{ padding: '2px 4px', textAlign: 'right' }}>
                          <input type="number" value={item.rate || 0} style={{ ...inputStyle, width: '60px', height: '24px', textAlign: 'right', fontSize: '9px', background: '#f8f9fa', borderColor: '#e8ecf1' }} readOnly />
                        </td>
                        <td style={{ padding: '2px 4px', textAlign: 'right', fontWeight: 'bold', fontSize: '8px', color: '#e65100' }}>
                          {formatCurrency(item.purchasePrice)}
                        </td>
                        <td style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', color: '#1a237e', fontSize: '9px' }}>
                          {item.gst || 0}%
                        </td>
                        <td style={{ padding: '2px 4px', textAlign: 'right', fontWeight: 'bold', fontSize: '9px' }}>{formatCurrency(item.amount)}</td>
                        <td style={{ padding: '2px 4px', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeItem(item.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '1px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '9px' }}>X</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '6px', flexShrink: 0 }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Subtotal</label>
                <input value={formatCurrency(subtotal)} readOnly style={{ ...inputStyle, fontWeight: 'bold', backgroundColor: '#f0f4f8', fontSize: '12px', height: '24px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Tax Amount</label>
                <input value={formatCurrency(taxAmount)} readOnly style={{ ...inputStyle, fontWeight: 'bold', backgroundColor: '#f0f4f8', fontSize: '12px', height: '24px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Freight</label>
                <input type="number" name="freight" value={formData.freight || 0} onChange={handleChange} step="0.01" min="0" style={{ ...inputStyle, fontWeight: 'bold', borderColor: '#1a237e', height: '24px', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Round Off</label>
                <input type="number" name="roundOff" value={formData.roundOff || 0} onChange={handleChange} step="0.01" style={{ ...inputStyle, fontWeight: 'bold', borderColor: '#1a237e', height: '24px', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#555', marginBottom: '2px' }}>Grand Total</label>
                <input value={formatCurrency(grandTotal)} readOnly style={{ ...inputStyle, fontWeight: 'bold', fontSize: '14px', color: '#1a237e', backgroundColor: '#e8edf5', height: '24px' }} />
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              alignItems: 'center',
              borderTop: '2px solid #1a237e', 
              paddingTop: '8px', 
              flexShrink: 0,
              marginTop: '10px',
              backgroundColor: '#ffffff',
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              paddingBottom: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange} style={{ ...inputStyle, width: '160px', height: '28px', fontSize: '11px' }}>
                  <option>Allied Trading Corporation</option>
                  <option>Zebaish</option>
                  <option>Signature Spread</option>
                </select>
              </div>

              <button 
                type="button" 
                onClick={() => saveAndGeneratePDF(false)} 
                disabled={loading} 
                style={{ ...buttonStyle, background: '#1a237e', padding: '5px 16px', fontSize: '11px' }}
              >
                Print and Save
              </button>

              <button 
                type="button" 
                onClick={() => saveAndGeneratePDF(true)} 
                disabled={loading} 
                style={{ ...buttonStyle, background: '#25D366', padding: '5px 16px', fontSize: '11px' }}
              >
                Send and Save
              </button>

              <button type="submit" style={{ display: 'none' }}>Hidden</button>
              
              {editingId && (
                <button type="button" onClick={resetForm} style={{ ...buttonStyle, background: '#6c757d', padding: '5px 16px', fontSize: '11px' }}>Cancel</button>
              )}
              <button type="button" onClick={resetForm} style={{ ...buttonStyle, background: '#ff6f00', padding: '5px 16px', fontSize: '11px' }}>New</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '3px 6px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '12px',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  height: '28px'
};

const buttonStyle = {
  padding: '6px 16px',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
};

export default SalesInvoice;
