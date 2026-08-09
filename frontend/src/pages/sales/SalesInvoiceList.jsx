import React, { useState, useMemo } from 'react';
import {
  COMPANY_DETAILS,
  SEED_SALES_ITEMS,
  formatINR,
  formatDate,
  statusBadge,
  inputStyle,
  labelStyle,
  cardStyle,
  tableHeaderStyle,
  generateId,
  todayISO,
  calculateGST,
  numberToWords,
  PAYMENT_STATUS_OPTIONS
} from './salesData';

const SalesInvoiceList = ({ customers, salesInvoices, setSalesInvoices, payments }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewInvoice, setViewInvoice] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);

  const [header, setHeader] = useState({
    invoiceNumber: '',
    invoiceDate: todayISO(),
    dueDate: '',
    customerId: '',
    placeOfSupply: 'New Delhi',
    transportName: 'Self',
    transportMode: 'By Road',
    vehicleNo: '-',
    paymentStatus: 'Unpaid',
    remarks: ''
  });

  const [items, setItems] = useState([
    { id: 1, itemCode: '', name: '', desc: '', hsn: '', qty: 1, unit: 'PCS', price: 0, discount: 0, gstRate: 0 }
  ]);

  // ─── Reset Form ────────────────────────────────────────────────
  const resetForm = () => {
    setHeader({
      invoiceNumber: '',
      invoiceDate: todayISO(),
      dueDate: '',
      customerId: '',
      placeOfSupply: 'New Delhi',
      transportName: 'Self',
      transportMode: 'By Road',
      vehicleNo: '-',
      paymentStatus: 'Unpaid',
      remarks: ''
    });
    setItems([{ id: 1, itemCode: '', name: '', desc: '', hsn: '', qty: 1, unit: 'PCS', price: 0, discount: 0, gstRate: 0 }]);
    setEditingId(null);
  };

  // ─── Handle Header Change ──────────────────────────────────────
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Handle Item Select ────────────────────────────────────────
  const handleItemSelect = (index, itemCode) => {
    const selected = SEED_SALES_ITEMS.find((m) => m.code === itemCode);
    if (!selected) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      itemCode: selected.code,
      name: selected.name,
      desc: selected.desc,
      hsn: selected.hsn,
      unit: selected.unit,
      price: selected.price,
      gstRate: selected.gstRate
    };
    setItems(updated);
  };

  const handleItemValueChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { id: Date.now(), itemCode: '', name: '', desc: '', hsn: '', qty: 1, unit: 'PCS', price: 0, discount: 0, gstRate: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return alert('At least one item is required.');
    setItems(items.filter((_, i) => i !== index));
  };

  // ─── Calculations ──────────────────────────────────────────────
  const selectedCustomer = customers.find((c) => c.id === header.customerId) || {};
  const calc = calculateGST(items, selectedCustomer.stateCode);
  const roundedTotal = Math.round(calc.grandTotal);
  const roundOff = roundedTotal - calc.grandTotal;

  // ─── Handle Submit ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!header.customerId) return alert('Please select a customer.');
    if (items.some((i) => !i.itemCode || !i.qty || parseFloat(i.qty) <= 0)) {
      return alert('Please select items and enter valid quantities.');
    }

    if (editingId) {
      setSalesInvoices(
        salesInvoices.map((inv) =>
          inv.id === editingId
            ? {
                ...header,
                id: editingId,
                items: [...items],
                subTotal: calc.subTotal,
                totalGST: calc.totalGST,
                cgst: calc.cgst,
                sgst: calc.sgst,
                igst: calc.igst,
                roundOff: roundOff,
                grandTotal: roundedTotal,
                isIntraState: calc.isIntraState,
                paymentStatus: inv.paymentStatus
              }
            : inv
        )
      );
      alert('Sales Invoice updated successfully!');
    } else {
      const newId = generateId('SAL-INV', salesInvoices.length + 1, 4, 1);
      const newInvoice = {
        ...header,
        id: newId,
        invoiceNumber: newId,
        items: [...items],
        subTotal: calc.subTotal,
        totalGST: calc.totalGST,
        cgst: calc.cgst,
        sgst: calc.sgst,
        igst: calc.igst,
        roundOff: roundOff,
        grandTotal: roundedTotal,
        isIntraState: calc.isIntraState
      };
      setSalesInvoices([...salesInvoices, newInvoice]);
      alert('Sales Invoice saved successfully! ID: ' + newId);
    }

    resetForm();
    setShowForm(false);
  };

  // ─── Edit Invoice ──────────────────────────────────────────────
  const handleEdit = (inv) => {
    setHeader({
      invoiceNumber: inv.invoiceNumber || inv.id,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate || '',
      customerId: inv.customerId,
      placeOfSupply: inv.placeOfSupply || 'New Delhi',
      transportName: inv.transportName || 'Self',
      transportMode: inv.transportMode || 'By Road',
      vehicleNo: inv.vehicleNo || '-',
      paymentStatus: inv.paymentStatus || 'Unpaid',
      remarks: inv.remarks || ''
    });
    setItems(inv.items ? [...inv.items] : [{ id: 1, itemCode: '', name: '', desc: '', hsn: '', qty: 1, unit: 'PCS', price: 0, discount: 0, gstRate: 0 }]);
    setEditingId(inv.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Delete Invoice ────────────────────────────────────────────
  const handleDelete = (id) => {
    if (!confirm('Delete this Sales Invoice?')) return;
    setSalesInvoices(salesInvoices.filter((inv) => inv.id !== id));
    alert('Sales Invoice deleted.');
  };

  // ─── Update Payment Status ─────────────────────────────────────
  const handlePaymentStatusChange = (id, newStatus) => {
    setSalesInvoices(salesInvoices.map((inv) => (inv.id === id ? { ...inv, paymentStatus: newStatus } : inv)));
  };

  // ─── Compute Paid Amount per Invoice ───────────────────────────
  const getPaidAmount = (invoiceId) => {
    return payments
      .filter((p) => p.partyType === 'Customer' && p.refDoc === invoiceId)
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  };

  // ─── Filtered Invoices ─────────────────────────────────────────
  const filteredInvoices = salesInvoices.filter((inv) => {
    const customer = customers.find((c) => c.id === inv.customerId);
    const customerName = customer ? customer.companyName : '';
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.invoiceNumber || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inv.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ─── Summary Stats ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalInvoiced = salesInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalReceived = payments.filter((p) => p.partyType === 'Customer').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalOutstanding = totalInvoiced - totalReceived;
    const unpaidCount = salesInvoices.filter((i) => i.paymentStatus === 'Unpaid').length;
    return { totalInvoiced, totalReceived, totalOutstanding, unpaidCount };
  }, [salesInvoices, payments]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>🧾 Sales Invoices & Payment Status</h2>
        <button
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
          style={{ padding: '10px 20px', backgroundColor: showForm ? '#6c757d' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {showForm ? '✕ Close Form' : '➕ New Sales Invoice'}
        </button>
      </div>

      {/* ─── Summary Cards ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: '#007bff', color: '#fff', padding: '15px 22px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>Total Invoiced</div>
          <h2 style={{ margin: '4px 0 0 0' }}>{formatINR(stats.totalInvoiced, 0)}</h2>
        </div>
        <div style={{ background: '#28a745', color: '#fff', padding: '15px 22px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>Total Received</div>
          <h2 style={{ margin: '4px 0 0 0' }}>{formatINR(stats.totalReceived, 0)}</h2>
        </div>
        <div style={{ background: '#dc3545', color: '#fff', padding: '15px 22px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>Outstanding</div>
          <h2 style={{ margin: '4px 0 0 0' }}>{formatINR(stats.totalOutstanding, 0)}</h2>
        </div>
        <div style={{ background: '#ffc107', color: '#000', padding: '15px 22px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>Unpaid Invoices</div>
          <h2 style={{ margin: '4px 0 0 0' }}>{stats.unpaidCount}</h2>
        </div>
      </div>

      {/* ─── Invoice Form ───────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...cardStyle, border: '1px solid #dee2e6' }}>
          <h3 style={{ margin: '0 0 15px 0', color: editingId ? '#ffc107' : '#007bff' }}>
            {editingId ? `✏️ Edit Sales Invoice (${editingId})` : '➕ Create Sales Invoice'}
          </h3>

          <div style={{ borderBottom: '2px solid #007bff', paddingBottom: '8px', marginBottom: '15px', color: '#007bff', fontWeight: 'bold' }}>
            📄 Invoice Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>Invoice No. (Auto)</label>
              <input type='text' value='(Auto-Generated)' readOnly style={{ ...inputStyle, background: '#e9ecef' }} />
            </div>
            <div>
              <label style={labelStyle}>Invoice Date *</label>
              <input type='date' name='invoiceDate' value={header.invoiceDate} onChange={handleHeaderChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type='date' name='dueDate' value={header.dueDate} onChange={handleHeaderChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Place of Supply</label>
              <input type='text' name='placeOfSupply' value={header.placeOfSupply} onChange={handleHeaderChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ borderBottom: '2px solid #28a745', paddingBottom: '8px', marginBottom: '15px', color: '#28a745', fontWeight: 'bold' }}>
            🧑‍💼 Customer Info
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>Select Customer *</label>
              <select name='customerId' value={header.customerId} onChange={handleHeaderChange} required style={inputStyle}>
                <option value=''>-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Customer GSTIN</label>
              <input type='text' value={selectedCustomer.gstin || '—'} readOnly style={{ ...inputStyle, background: '#e9ecef' }} />
            </div>
          </div>

          {selectedCustomer.id && (
            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', border: '1px solid #e9ecef' }}>
              <strong>{selectedCustomer.companyName}</strong> | {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} ({selectedCustomer.stateCode}) | Ph: {selectedCustomer.phone} | Terms: {selectedCustomer.paymentTerms}
            </div>
          )}

          <div style={{ borderBottom: '2px solid #17a2b8', paddingBottom: '8px', marginBottom: '15px', color: '#17a2b8', fontWeight: 'bold' }}>
            📦 Sales Item Details
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '13px' }}>
            <thead>
              <tr style={tableHeaderStyle}>
                <th style={{ padding: '8px' }}>#</th>
                <th style={{ padding: '8px' }}>Item Name</th>
                <th style={{ padding: '8px' }}>HSN</th>
                <th style={{ padding: '8px' }}>Qty</th>
                <th style={{ padding: '8px' }}>Unit</th>
                <th style={{ padding: '8px' }}>Rate (₹)</th>
                <th style={{ padding: '8px' }}>Disc</th>
                <th style={{ padding: '8px' }}>GST %</th>
                <th style={{ padding: '8px' }}>Amount</th>
                <th style={{ padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const baseAmt = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
                const lineTotal = baseAmt - (parseFloat(item.discount) || 0);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{idx + 1}</td>
                    <td style={{ padding: '8px' }}>
                      <select value={item.itemCode} onChange={(e) => handleItemSelect(idx, e.target.value)} style={{ ...inputStyle, padding: '6px' }}>
                        <option value=''>-- Select Item --</option>
                        {SEED_SALES_ITEMS.map((m) => (
                          <option key={m.code} value={m.code}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input type='text' value={item.hsn} onChange={(e) => handleItemValueChange(idx, 'hsn', e.target.value)} style={{ ...inputStyle, padding: '6px', width: '60px' }} />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input type='number' value={item.qty} onChange={(e) => handleItemValueChange(idx, 'qty', e.target.value)} style={{ ...inputStyle, padding: '6px', width: '70px' }} />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input type='text' value={item.unit} onChange={(e) => handleItemValueChange(idx, 'unit', e.target.value)} style={{ ...inputStyle, padding: '6px', width: '60px' }} />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input type='number' value={item.price} onChange={(e) => handleItemValueChange(idx, 'price', e.target.value)} style={{ ...inputStyle, padding: '6px', width: '90px' }} />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input type='number' value={item.discount} onChange={(e) => handleItemValueChange(idx, 'discount', e.target.value)} style={{ ...inputStyle, padding: '6px', width: '60px' }} />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input type='number' value={item.gstRate} onChange={(e) => handleItemValueChange(idx, 'gstRate', e.target.value)} style={{ ...inputStyle, padding: '6px', width: '60px' }} />
                    </td>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{formatINR(Math.max(lineTotal, 0))}</td>
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
          <button type='button' onClick={addItemRow} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
            + Add Item Row
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Remarks / Internal Notes</label>
              <textarea name='remarks' value={header.remarks} onChange={handleHeaderChange} rows={4} placeholder='Enter any notes or terms...' style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', fontSize: '13px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Sub Total (Taxable):</span>
                <strong>{formatINR(calc.subTotal)}</strong>
              </div>
              {calc.isIntraState ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>CGST:</span>
                    <span>{formatINR(calc.cgst)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>SGST:</span>
                    <span>{formatINR(calc.sgst)}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>IGST:</span>
                  <span>{formatINR(calc.igst)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Round Off:</span>
                <span>{formatINR(roundOff)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #dee2e6', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#28a745' }}>
                <strong>Grand Total:</strong>
                <strong>{formatINR(roundedTotal)}</strong>
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', fontStyle: 'italic', color: '#6c757d' }}>
                {numberToWords(roundedTotal)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editingId ? 'Update Invoice' : 'Save Sales Invoice'}
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
          placeholder='🔍 Search by invoice no, customer, or bill no...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: '1', maxWidth: '400px' }}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, maxWidth: '180px' }}>
          <option value='All'>All Payment Status</option>
          {PAYMENT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ─── Invoices Table ─────────────────────────────────────── */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={{ padding: '10px' }}>Invoice No.</th>
              <th style={{ padding: '10px' }}>Customer</th>
              <th style={{ padding: '10px' }}>Date</th>
              <th style={{ padding: '10px' }}>Grand Total</th>
              <th style={{ padding: '10px' }}>Paid</th>
              <th style={{ padding: '10px' }}>Balance</th>
              <th style={{ padding: '10px' }}>Payment Status</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan='8' style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  No sales invoices found. Click "New Sales Invoice" to create one.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const customer = customers.find((c) => c.id === inv.customerId);
                const paid = getPaidAmount(inv.id);
                const balance = (inv.grandTotal || 0) - paid;
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{inv.id}</td>
                    <td style={{ padding: '10px' }}>{customer ? customer.companyName : '—'}</td>
                    <td style={{ padding: '10px' }}>{formatDate(inv.invoiceDate)}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#28a745' }}>{formatINR(inv.grandTotal || 0)}</td>
                    <td style={{ padding: '10px', color: '#28a745' }}>{formatINR(paid)}</td>
                    <td style={{ padding: '10px', color: balance > 0 ? '#dc3545' : '#28a745' }}>{formatINR(balance)}</td>
                    <td style={{ padding: '10px' }}>
                      <select
                        value={inv.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(inv.id, e.target.value)}
                        style={{ ...inputStyle, padding: '4px 8px', fontSize: '12px', width: 'auto', marginBottom: '4px' }}
                      >
                        {PAYMENT_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div>
                        <span style={statusBadge(inv.paymentStatus)}>{inv.paymentStatus}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                      <button onClick={() => setViewInvoice(inv)} style={{ color: '#17a2b8', border: '1px solid #17a2b8', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', marginRight: '5px' }}>
                        Invoice
                      </button>
                      <button onClick={() => setViewReceipt(inv)} style={{ color: '#6f42c1', border: '1px solid #6f42c1', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', marginRight: '5px' }}>
                        Receipt
                      </button>
                      <button onClick={() => handleEdit(inv)} style={{ color: '#007bff', border: '1px solid #007bff', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', marginRight: '5px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(inv.id)} style={{ color: '#dc3545', border: '1px solid #dc3545', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
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

      {/* ─── Printable Invoice Modal ────────────────────────────── */}
      {viewInvoice && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '20px'
          }}
          onClick={() => setViewInvoice(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '8px', padding: '30px',
              maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              fontFamily: 'Arial, sans-serif'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} className="no-print">
              <h2 style={{ margin: 0, color: '#333' }}>Tax Invoice</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => window.print()} style={{ padding: '8px 16px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  🖨️ Print
                </button>
                <button onClick={() => setViewInvoice(null)} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="printable-invoice" style={{ border: '1px solid #000', padding: '15px' }}>
              {/* Company Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '12px' }}>
                <h1 style={{ margin: 0, fontSize: '18px', color: '#0b1b80' }}>{COMPANY_DETAILS.name}</h1>
                <div style={{ fontSize: '11px', color: '#555' }}>{COMPANY_DETAILS.address}</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '3px' }}>
                  GSTIN: {COMPANY_DETAILS.gstin} | State: {COMPANY_DETAILS.state} (Code: {COMPANY_DETAILS.stateCode})
                </div>
                <div style={{ fontSize: '10px', color: '#333' }}>Email: {COMPANY_DETAILS.email} | Mobile: {COMPANY_DETAILS.phone}</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '5px', color: '#000' }}>TAX INVOICE</div>
              </div>

              {/* Invoice & Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', fontSize: '12px' }}>
                <div>
                  <strong>Invoice No.:</strong> {viewInvoice.id}<br />
                  <strong>Invoice Date:</strong> {formatDate(viewInvoice.invoiceDate)}<br />
                  <strong>Due Date:</strong> {viewInvoice.dueDate ? formatDate(viewInvoice.dueDate) : 'On Receipt'}<br />
                  <strong>Place of Supply:</strong> {viewInvoice.placeOfSupply}
                </div>
                <div>
                  {(() => {
                    const cust = customers.find((c) => c.id === viewInvoice.customerId);
                    return cust ? (
                      <>
                        <strong>Customer:</strong> {cust.companyName}<br />
                        <strong>Address:</strong> {cust.address}, {cust.city}, {cust.state} ({cust.stateCode})<br />
                        <strong>GSTIN:</strong> {cust.gstin}<br />
                        <strong>Phone:</strong> {cust.phone}
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '12px', border: '1px solid #000' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #000', padding: '5px' }}>#</th>
                    <th style={{ border: '1px solid #000', padding: '5px', textAlign: 'left' }}>Item</th>
                    <th style={{ border: '1px solid #000', padding: '5px' }}>HSN</th>
                    <th style={{ border: '1px solid #000', padding: '5px' }}>Qty</th>
                    <th style={{ border: '1px solid #000', padding: '5px' }}>Rate</th>
                    <th style={{ border: '1px solid #000', padding: '5px' }}>Disc</th>
                    <th style={{ border: '1px solid #000', padding: '5px' }}>GST%</th>
                    <th style={{ border: '1px solid #000', padding: '5px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {viewInvoice.items && viewInvoice.items.map((item, idx) => {
                    const baseAmt = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
                    const lineTotal = baseAmt - (parseFloat(item.discount) || 0);
                    return (
                      <tr key={idx}>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '5px' }}>{item.name}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{item.hsn}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{item.qty} {item.unit}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{formatINR(item.price)}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{item.discount || 0}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{item.gstRate}%</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>{formatINR(Math.max(lineTotal, 0))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ width: '55%' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Amount Chargeable (in words):</strong><br />
                    <span style={{ fontStyle: 'italic' }}>{numberToWords(viewInvoice.grandTotal)}</span>
                  </div>
                  <div style={{ fontSize: '11px' }}>
                    <strong>Payment Status:</strong> <span style={statusBadge(viewInvoice.paymentStatus)}>{viewInvoice.paymentStatus}</span>
                  </div>
                </div>
                <div style={{ width: '40%' }}>
                  <table style={{ width: '100%', fontSize: '12px' }}>
                    <tbody>
                      <tr><td>Sub Total:</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatINR(viewInvoice.subTotal)}</td></tr>
                      {viewInvoice.isIntraState ? (
                        <>
                          <tr><td>CGST:</td><td style={{ textAlign: 'right' }}>{formatINR(viewInvoice.cgst)}</td></tr>
                          <tr><td>SGST:</td><td style={{ textAlign: 'right' }}>{formatINR(viewInvoice.sgst)}</td></tr>
                        </>
                      ) : (
                        <tr><td>IGST:</td><td style={{ textAlign: 'right' }}>{formatINR(viewInvoice.igst)}</td></tr>
                      )}
                      <tr><td>Round Off:</td><td style={{ textAlign: 'right' }}>{formatINR(viewInvoice.roundOff)}</td></tr>
                      <tr style={{ borderTop: '2px solid #000', fontSize: '14px' }}>
                        <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Grand Total:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', color: '#0b1b80' }}>{formatINR(viewInvoice.grandTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature */}
              <div style={{ marginTop: '30px', borderTop: '1px dashed #ccc', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px' }}>
                <div style={{ color: '#6c757d' }}>
                  <div>This is a computer generated invoice.</div>
                  <div>Subject to Delhi Jurisdiction.</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '30px' }}>For {COMPANY_DETAILS.name}</div>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '3px', fontWeight: 'bold' }}>Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Printable Receipt Modal ────────────────────────────── */}
      {viewReceipt && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '20px'
          }}
          onClick={() => setViewReceipt(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '8px', padding: '30px',
              maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              fontFamily: 'Arial, sans-serif'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} className="no-print">
              <h2 style={{ margin: 0, color: '#333' }}>Payment Receipt</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => window.print()} style={{ padding: '8px 16px', backgroundColor: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  🖨️ Print
                </button>
                <button onClick={() => setViewReceipt(null)} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="printable-invoice" style={{ border: '1px solid #000', padding: '20px' }}>
              {/* Company Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
                <h1 style={{ margin: 0, fontSize: '18px', color: '#0b1b80' }}>{COMPANY_DETAILS.name}</h1>
                <div style={{ fontSize: '11px', color: '#555' }}>{COMPANY_DETAILS.address}</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '3px' }}>
                  GSTIN: {COMPANY_DETAILS.gstin} | Mobile: {COMPANY_DETAILS.phone}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '6px', color: '#6f42c1' }}>PAYMENT RECEIPT</div>
              </div>

              {/* Receipt Details */}
              <div style={{ fontSize: '13px', marginBottom: '15px' }}>
                {(() => {
                  const cust = customers.find((c) => c.id === viewReceipt.customerId);
                  const paid = getPaidAmount(viewReceipt.id);
                  const balance = (viewReceipt.grandTotal || 0) - paid;
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span><strong>Receipt No.:</strong> RCP-{viewReceipt.id}</span>
                        <span><strong>Date:</strong> {formatDate(todayISO())}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span><strong>Invoice No.:</strong> {viewReceipt.id}</span>
                        <span><strong>Invoice Date:</strong> {formatDate(viewReceipt.invoiceDate)}</span>
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <strong>Received from:</strong> {cust ? cust.companyName : '—'}
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <strong>Address:</strong> {cust ? `${cust.address}, ${cust.city}, ${cust.state}` : '—'}
                      </div>
                      <div style={{ marginBottom: '6px' }}>
                        <strong>GSTIN:</strong> {cust ? cust.gstin : '—'}
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '10px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '6px' }}>
                        <span><strong>Invoice Amount:</strong></span>
                        <span>{formatINR(viewReceipt.grandTotal || 0)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '6px', color: '#28a745' }}>
                        <span><strong>Amount Received:</strong></span>
                        <span><strong>{formatINR(paid)}</strong></span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '6px', color: balance > 0 ? '#dc3545' : '#28a745' }}>
                        <span><strong>Balance Due:</strong></span>
                        <span><strong>{formatINR(balance)}</strong></span>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <strong>Payment Status:</strong> <span style={statusBadge(viewReceipt.paymentStatus)}>{viewReceipt.paymentStatus}</span>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '10px 0' }} />
                      <div style={{ fontStyle: 'italic', fontSize: '12px' }}>
                        Received with thanks the sum of Rupees <strong>{numberToWords(paid)}</strong>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Signature */}
              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', fontSize: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '30px' }}>For {COMPANY_DETAILS.name}</div>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '3px', fontWeight: 'bold' }}>Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoiceList;