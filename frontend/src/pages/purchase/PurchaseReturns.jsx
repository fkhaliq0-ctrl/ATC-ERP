import React, { useState } from 'react';
import {
  WAREHOUSES,
  formatINR,
  formatDate,
  statusBadge,
  inputStyle,
  labelStyle,
  cardStyle,
  tableHeaderStyle,
  generateId,
  todayISO,
  calculateGST
} from './purchaseData';

const PurchaseReturns = ({ suppliers, purchaseInvoices, _grns, returns, setReturns }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [header, setHeader] = useState({
    returnNumber: '',
    returnDate: todayISO(),
    supplierId: '',
    purchaseInvoiceRef: '',
    grnRef: '',
    warehouse: WAREHOUSES[0],
    returnReason: '',
    returnMode: 'Replace',
    notes: ''
  });

  const [items, setItems] = useState([
    { id: 1, itemCode: '', name: '', hsn: '', qty: 1, unit: 'Pcs', price: 0, gstRate: 5, reason: '' }
  ]);

  // ─── Reset Form ────────────────────────────────────────────────
  const resetForm = () => {
    setHeader({
      returnNumber: '',
      returnDate: todayISO(),
      supplierId: '',
      purchaseInvoiceRef: '',
      grnRef: '',
      warehouse: WAREHOUSES[0],
      returnReason: '',
      returnMode: 'Replace',
      notes: ''
    });
    setItems([{ id: 1, itemCode: '', name: '', hsn: '', qty: 1, unit: 'Pcs', price: 0, gstRate: 5, reason: '' }]);
  };

  // ─── Handle Header Change ──────────────────────────────────────
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader((prev) => ({ ...prev, [name]: value }));

    // Auto-fill from Purchase Invoice
    if (name === 'purchaseInvoiceRef') {
      const inv = purchaseInvoices.find((i) => i.id === value);
      if (inv) {
        setHeader((prev) => ({
          ...prev,
          supplierId: inv.supplierId,
          warehouse: inv.warehouse,
          grnRef: inv.grnRef || ''
        }));
        if (inv.items && inv.items.length > 0) {
          setItems(
            inv.items.map((item) => ({
              id: Date.now() + Math.random(),
              itemCode: item.itemCode,
              name: item.name,
              hsn: item.hsn,
              qty: parseFloat(item.qty) || 0,
              unit: item.unit,
              price: parseFloat(item.price) || 0,
              gstRate: parseFloat(item.gstRate) || 0,
              reason: ''
            }))
          );
        }
      }
    }
  };

  // ─── Handle Item Value Change ──────────────────────────────────
  const handleItemValueChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ─── Add / Remove Item Rows ────────────────────────────────────
  const addItemRow = () => {
    setItems([...items, { id: Date.now(), itemCode: '', name: '', hsn: '', qty: 1, unit: 'Pcs', price: 0, gstRate: 5, reason: '' }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return alert('At least one item is required.');
    setItems(items.filter((_, i) => i !== index));
  };

  // ─── Calculations ──────────────────────────────────────────────
  const selectedSupplier = suppliers.find((s) => s.id === header.supplierId) || {};
  const calc = calculateGST(items, selectedSupplier.stateCode);

  // ─── Handle Submit ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!header.supplierId) return alert('Please select a supplier.');
    if (items.some((i) => !i.itemCode || !i.qty || parseFloat(i.qty) <= 0)) {
      return alert('Please select items and enter valid return quantities.');
    }

    const newId = generateId('PRN', returns.length + 1, 4, 1);
    const newReturn = {
      ...header,
      id: newId,
      returnNumber: newId,
      items: [...items],
      subTotal: calc.subTotal,
      totalGST: calc.totalGST,
      returnAmount: calc.grandTotal,
      status: 'Open'
    };

    setReturns([...returns, newReturn]);
    alert('Purchase Return recorded successfully! ID: ' + newId);
    resetForm();
    setShowForm(false);
  };

  // ─── Delete Return ─────────────────────────────────────────────
  const handleDelete = (id) => {
    if (!confirm('Delete this Purchase Return?')) return;
    setReturns(returns.filter((r) => r.id !== id));
    alert('Purchase Return deleted.');
  };

  // ─── Update Return Status ──────────────────────────────────────
  const handleStatusChange = (id, newStatus) => {
    setReturns(returns.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  // ─── Filtered Returns ──────────────────────────────────────────
  const filteredReturns = returns.filter((r) => {
    const supplier = suppliers.find((s) => s.id === r.supplierId);
    const supplierName = supplier ? supplier.companyName : '';
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      supplierName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>↩️ Purchase Returns / Debit Note</h2>
        <button
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
          style={{ padding: '10px 20px', backgroundColor: showForm ? '#6c757d' : '#fd7e14', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {showForm ? '✕ Close Form' : '➕ New Purchase Return'}
        </button>
      </div>

      {/* ─── Return Form ────────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...cardStyle, border: '1px solid #dee2e6' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fd7e14' }}>➕ Record Purchase Return / Debit Note</h3>

          {/* Header Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>Return No. (Auto)</label>
              <input type='text' value='(Auto-Generated)' readOnly style={{ ...inputStyle, background: '#e9ecef' }} />
            </div>
            <div>
              <label style={labelStyle}>Return Date *</label>
              <input type='date' name='returnDate' value={header.returnDate} onChange={handleHeaderChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Purchase Invoice Ref.</label>
              <select name='purchaseInvoiceRef' value={header.purchaseInvoiceRef} onChange={handleHeaderChange} style={inputStyle}>
                <option value=''>-- Select Invoice (Optional) --</option>
                {purchaseInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Return Mode</label>
              <select name='returnMode' value={header.returnMode} onChange={handleHeaderChange} style={inputStyle}>
                <option value='Replace'>Replace (New Stock)</option>
                <option value='Refund'>Refund (Money Back)</option>
                <option value='Credit Note'>Credit Note (Adjustment)</option>
              </select>
            </div>
          </div>

          {/* Supplier & Warehouse */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>Supplier *</label>
              <select name='supplierId' value={header.supplierId} onChange={handleHeaderChange} required style={inputStyle}>
                <option value=''>-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.companyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Warehouse</label>
              <select name='warehouse' value={header.warehouse} onChange={handleHeaderChange} style={inputStyle}>
                {WAREHOUSES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>GRN Reference</label>
              <input type='text' name='grnRef' value={header.grnRef} onChange={handleHeaderChange} placeholder='Original GRN No.' style={inputStyle} />
            </div>
          </div>

          {/* Supplier Info Display */}
          {selectedSupplier.id && (
            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', border: '1px solid #e9ecef' }}>
              <strong>{selectedSupplier.companyName}</strong> | {selectedSupplier.city}, {selectedSupplier.state} ({selectedSupplier.stateCode}) | Ph: {selectedSupplier.phone}
            </div>
          )}

          {/* Items Table */}
          <h4 style={{ margin: '15px 0 10px 0', color: '#333' }}>📦 Return Items</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '12px' }}>
              <thead>
                <tr style={tableHeaderStyle}>
                  <th style={{ padding: '8px' }}>#</th>
                  <th style={{ padding: '8px' }}>Item Name</th>
                  <th style={{ padding: '8px' }}>HSN</th>
                  <th style={{ padding: '8px' }}>Return Qty</th>
                  <th style={{ padding: '8px' }}>Unit</th>
                  <th style={{ padding: '8px' }}>Rate (₹)</th>
                  <th style={{ padding: '8px' }}>GST %</th>
                  <th style={{ padding: '8px' }}>Amount</th>
                  <th style={{ padding: '8px' }}>Reason</th>
                  <th style={{ padding: '8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const lineTotal = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{idx + 1}</td>
                      <td style={{ padding: '8px' }}>
                        <input type='text' value={item.name} onChange={(e) => handleItemValueChange(idx, 'name', e.target.value)} style={{ ...inputStyle, padding: '5px' }} />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type='text' value={item.hsn} onChange={(e) => handleItemValueChange(idx, 'hsn', e.target.value)} style={{ ...inputStyle, padding: '5px', width: '60px' }} />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type='number' value={item.qty} onChange={(e) => handleItemValueChange(idx, 'qty', e.target.value)} required style={{ ...inputStyle, padding: '5px', width: '70px' }} />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type='text' value={item.unit} onChange={(e) => handleItemValueChange(idx, 'unit', e.target.value)} style={{ ...inputStyle, padding: '5px', width: '60px' }} />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type='number' value={item.price} onChange={(e) => handleItemValueChange(idx, 'price', e.target.value)} style={{ ...inputStyle, padding: '5px', width: '80px' }} />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <input type='number' value={item.gstRate} onChange={(e) => handleItemValueChange(idx, 'gstRate', e.target.value)} style={{ ...inputStyle, padding: '5px', width: '50px' }} />
                      </td>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{formatINR(lineTotal)}</td>
                      <td style={{ padding: '8px' }}>
                        <input type='text' value={item.reason} onChange={(e) => handleItemValueChange(idx, 'reason', e.target.value)} placeholder='Damaged/Expired' style={{ ...inputStyle, padding: '5px', width: '100px' }} />
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <button type='button' onClick={() => removeItemRow(idx)} style={{ color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button type='button' onClick={addItemRow} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
            + Add Item Row
          </button>

          {/* Notes & Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Return Reason / Notes</label>
              <textarea name='notes' value={header.notes} onChange={handleHeaderChange} rows={4} placeholder='Explain the reason for return...' style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', fontSize: '13px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Sub Total:</span>
                <strong>{formatINR(calc.subTotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>GST:</span>
                <span>{formatINR(calc.totalGST)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #dee2e6', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#dc3545' }}>
                <strong>Return Amount:</strong>
                <strong>{formatINR(calc.grandTotal)}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#fd7e14', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Purchase Return
            </button>
            <button type='button' onClick={() => { resetForm(); setShowForm(false); }} style={{ padding: '10px 25px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ─── Search & Filter ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
        <input
          type='text'
          placeholder='🔍 Search by return no or supplier...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: '1', maxWidth: '400px' }}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, maxWidth: '180px' }}>
          <option value='All'>All Status</option>
          <option value='Open'>Open</option>
          <option value='Closed'>Closed</option>
        </select>
      </div>

      {/* ─── Returns Table ──────────────────────────────────────── */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={{ padding: '10px' }}>Return No.</th>
              <th style={{ padding: '10px' }}>Date</th>
              <th style={{ padding: '10px' }}>Supplier</th>
              <th style={{ padding: '10px' }}>Invoice Ref</th>
              <th style={{ padding: '10px' }}>Mode</th>
              <th style={{ padding: '10px' }}>Items</th>
              <th style={{ padding: '10px' }}>Return Amount</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.length === 0 ? (
              <tr>
                <td colSpan='9' style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  No purchase returns found.
                </td>
              </tr>
            ) : (
              filteredReturns.map((r) => {
                const supplier = suppliers.find((s) => s.id === r.supplierId);
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{r.id}</td>
                    <td style={{ padding: '10px' }}>{formatDate(r.returnDate)}</td>
                    <td style={{ padding: '10px' }}>{supplier ? supplier.companyName : '—'}</td>
                    <td style={{ padding: '10px' }}>{r.purchaseInvoiceRef || '—'}</td>
                    <td style={{ padding: '10px' }}>{r.returnMode}</td>
                    <td style={{ padding: '10px' }}>{r.items ? r.items.length : 0} item(s)</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#dc3545' }}>{formatINR(r.returnAmount || 0)}</td>
                    <td style={{ padding: '10px' }}>
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        style={{ ...inputStyle, padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                      >
                        <option value='Open'>Open</option>
                        <option value='Closed'>Closed</option>
                      </select>
                      <div style={{ marginTop: '4px' }}>
                        <span style={statusBadge(r.status)}>{r.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => handleDelete(r.id)} style={{ color: '#dc3545', border: '1px solid #dc3545', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseReturns;