import React, { useState, useCallback } from 'react';
import './MenuCalculator.css';

/* ── Constants ────────────────────────────────────────── */
const CATEGORIES = ['Starters', 'Main Course', 'Breads', 'Desserts', 'Beverages', 'Stalls'];
const GATHERING_TYPES = ['Mix', 'Segregated'];
const FUNCTION_TYPES = ['Marriage', 'Reception', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Other'];

const EMPTY_ITEM = {
  category: 'Starters',
  item_name: '',
  quantity: 0,
  rate: 0,
  total: 0,
};

const EXTRAS_FIELDS = [
  { key: 'staff', label: 'Staff' },
  { key: 'crockery', label: 'Crockery' },
  { key: 'disposables', label: 'Disposables' },
  { key: 'cartage', label: 'Cartage' },
  { key: 'water_ice', label: 'Water & Ice' },
  { key: 'desi_ghee_zafran', label: 'Desi Ghee & Zafran' },
  { key: 'misc_tips', label: 'Miscellaneous & Tips' },
  { key: 'veg', label: 'Veg' },
];

/* ── Helper ───────────────────────────────────────────── */
const fmt = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── Component ────────────────────────────────────────── */
const MenuCalculator = () => {
  /* Customer Details */
  const [customer, setCustomer] = useState({
    name: '',
    id: 'CUST-0001',
    phone: '',
    email: '',
    venue: '',
    pax: 0,
    date: new Date().toISOString().split('T')[0],
    time: '',
    gathering_type: 'Mix',
    function_type: 'Marriage',
  });

  /* Menu Items */
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);

  /* Extras */
  const [extras, setExtras] = useState({
    staff: 0,
    crockery: 0,
    disposables: 0,
    cartage: 0,
    water_ice: 0,
    desi_ghee_zafran: 0,
    misc_tips: 0,
    veg: 0,
  });

  /* ── Handlers ─────────────────────────────────────────── */
  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => {
      const next = { ...prev, [field]: value };
      // Recalculate item quantities when PAX changes
      if (field === 'pax') {
        const pax = parseInt(value) || 0;
        setItems((prevItems) =>
          prevItems.map((it) => ({
            ...it,
            quantity: Math.ceil(pax / 4),
            total: Math.ceil(pax / 4) * it.rate,
          }))
        );
      }
      return next;
    });
  };

  const handleItemChange = useCallback((index, field, value) => {
    setItems((prevItems) => {
      const updated = [...prevItems];
      updated[index] = { ...updated[index], [field]: value };

      // Auto-calc total
      if (field === 'quantity' || field === 'rate') {
        const qty = field === 'quantity' ? (parseInt(value) || 0) : (parseInt(updated[index].quantity) || 0);
        const rate = field === 'rate' ? (parseFloat(value) || 0) : (parseFloat(updated[index].rate) || 0);
        updated[index].total = qty * rate;
      }
      return updated;
    });
  }, []);

  const addItem = () => {
    const pax = parseInt(customer.pax) || 0;
    setItems((prev) => [
      ...prev,
      { ...EMPTY_ITEM, quantity: Math.ceil(pax / 4) },
    ]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExtrasChange = (key, value) => {
    setExtras((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const resetForm = () => {
    setCustomer({
      name: '',
      id: 'CUST-0001',
      phone: '',
      email: '',
      venue: '',
      pax: 0,
      date: new Date().toISOString().split('T')[0],
      time: '',
      gathering_type: 'Mix',
      function_type: 'Marriage',
    });
    setItems([{ ...EMPTY_ITEM }]);
    setExtras({
      staff: 0, crockery: 0, disposables: 0, cartage: 0,
      water_ice: 0, desi_ghee_zafran: 0, misc_tips: 0, veg: 0,
    });
  };

  /* ── Calculations ─────────────────────────────────────── */
  const itemsSubtotal = items.reduce((sum, it) => sum + (it.total || 0), 0);
  const extrasTotal = Object.values(extras).reduce((sum, v) => sum + v, 0);
  const subtotal = itemsSubtotal + extrasTotal;
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;
  const advance = grandTotal * 0.30;
  const oneWeekBefore = grandTotal * 0.30;
  const dayBefore = grandTotal * 0.40;

  /* ── Button Actions ───────────────────────────────────── */
  const handleSave = () => {
    alert(`Estimate saved!\nCustomer: ${customer.name}\nGrand Total: ${fmt(grandTotal)}`);
  };

  const handleGeneratePDF = () => {
    alert(`PDF generation would create:\n${customer.name || 'Customer'}_Estimate_${Date.now()}.pdf`);
  };

  const handleSendWhatsApp = () => {
    const msg =
      `Dear ${customer.name},\nYour catering estimate has been prepared.\n` +
      `Venue: ${customer.venue}\nPAX: ${customer.pax}\n` +
      `Grand Total: ${fmt(grandTotal)}\nAdvance: ${fmt(advance)}\n\n` +
      `Allied Trading Corporation`;
    const rawPhone = customer.phone ? customer.phone.replace(/\D/g, '') : '';
    if (rawPhone) {
      const phone = rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone;
      window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    } else {
      alert('Please enter a phone number first.');
    }
  };

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div className="mc-container">
      {/* Header */}
      <div className="mc-header">
        <h1>Menu Calculator</h1>
        <span className="mc-badge">ESTIMATE</span>
      </div>

      {/* 1. Customer Details */}
      <div className="mc-section">
        <h2>Customer Details</h2>
        <div className="mc-form-grid">
          <div className="mc-form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => handleCustomerChange('name', e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div className="mc-form-group">
            <label>Customer ID</label>
            <input type="text" value={customer.id} disabled />
          </div>
          <div className="mc-form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) => handleCustomerChange('phone', e.target.value)}
              placeholder="Phone number"
            />
          </div>
          <div className="mc-form-group">
            <label>Email</label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => handleCustomerChange('email', e.target.value)}
              placeholder="Email address"
            />
          </div>
          <div className="mc-form-group">
            <label>Venue</label>
            <input
              type="text"
              value={customer.venue}
              onChange={(e) => handleCustomerChange('venue', e.target.value)}
              placeholder="Event venue"
            />
          </div>
          <div className="mc-form-group">
            <label>PAX</label>
            <input
              type="number"
              value={customer.pax || ''}
              onChange={(e) => handleCustomerChange('pax', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="mc-form-group">
            <label>Date</label>
            <input
              type="date"
              value={customer.date}
              onChange={(e) => handleCustomerChange('date', e.target.value)}
            />
          </div>
          <div className="mc-form-group">
            <label>Time</label>
            <input
              type="time"
              value={customer.time}
              onChange={(e) => handleCustomerChange('time', e.target.value)}
            />
          </div>
          <div className="mc-form-group">
            <label>Gathering Type</label>
            <select
              value={customer.gathering_type}
              onChange={(e) => handleCustomerChange('gathering_type', e.target.value)}
            >
              {GATHERING_TYPES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="mc-form-group">
            <label>Function Type</label>
            <select
              value={customer.function_type}
              onChange={(e) => handleCustomerChange('function_type', e.target.value)}
            >
              {FUNCTION_TYPES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Menu Items Table */}
      <div className="mc-section">
        <h2>Menu Items</h2>
        <div className="mc-table-wrapper">
          <table className="mc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Rate (₹)</th>
                <th>Total (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                      placeholder="Item name"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="mc-total-cell">{fmt(item.total)}</td>
                  <td className="mc-action-cell">
                    <button className="mc-btn-remove" onClick={() => removeItem(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#999', padding: 16 }}>
                    No items. Click "Add Item" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button className="mc-btn-add" onClick={addItem}>+ Add Item</button>
      </div>

      {/* 3. Extras */}
      <div className="mc-section">
        <h2>Extras</h2>
        <div className="mc-extras-grid">
          {EXTRAS_FIELDS.map(({ key, label }) => (
            <div className="mc-form-group" key={key}>
              <label>{label} (₹)</label>
              <input
                type="number"
                value={extras[key] || ''}
                onChange={(e) => handleExtrasChange(key, e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Summary */}
      <div className="mc-section">
        <h2>Summary</h2>
        <div className="mc-summary">
          <div className="mc-summary-left">
            <div className="mc-summary-row">
              <span className="mc-summary-label">Items Subtotal</span>
              <span className="mc-summary-value">{fmt(itemsSubtotal)}</span>
            </div>
            <div className="mc-summary-row">
              <span className="mc-summary-label">Extras Total</span>
              <span className="mc-summary-value">{fmt(extrasTotal)}</span>
            </div>
            <div className="mc-summary-row">
              <span className="mc-summary-label">Subtotal (before GST)</span>
              <span className="mc-summary-value">{fmt(subtotal)}</span>
            </div>
            <div className="mc-summary-row">
              <span className="mc-summary-label">GST (18%)</span>
              <span className="mc-summary-value">{fmt(gst)}</span>
            </div>
          </div>
          <div className="mc-summary-right">
            <div className="mc-summary-row mc-grand-total">
              <span className="mc-summary-label">Grand Total</span>
              <span className="mc-summary-value">{fmt(grandTotal)}</span>
            </div>
            <div className="mc-summary-row mc-advance">
              <span className="mc-summary-label">Advance (30%)</span>
              <span className="mc-summary-value">{fmt(advance)}</span>
            </div>
            <div className="mc-summary-row">
              <span className="mc-summary-label">One Week Before (30%)</span>
              <span className="mc-summary-value">{fmt(oneWeekBefore)}</span>
            </div>
            <div className="mc-summary-row">
              <span className="mc-summary-label">Day Before (40%)</span>
              <span className="mc-summary-value">{fmt(dayBefore)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Buttons */}
      <div className="mc-buttons">
        <button className="mc-btn mc-btn-save" onClick={handleSave}>💾 Save Estimate</button>
        <button className="mc-btn mc-btn-pdf" onClick={handleGeneratePDF}>📄 Generate PDF</button>
        <button className="mc-btn mc-btn-whatsapp" onClick={handleSendWhatsApp}>📱 Send WhatsApp</button>
        <button className="mc-btn mc-btn-reset" onClick={resetForm}>🔄 Reset</button>
      </div>
    </div>
  );
};

export default MenuCalculator;
